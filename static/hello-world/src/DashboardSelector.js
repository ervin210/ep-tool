import React, { useState } from 'react';
import { requestJira } from '@forge/bridge';
import { useEffectAsync } from './useEffectAsync';
import Select, { AsyncSelect } from '@atlaskit/select';
import Spinner from '@atlaskit/spinner';
import { Label } from '@atlaskit/form';
import { isPresent } from 'ts-is-present';
import { getUserPropertyApi } from './apis/user';
import App from './App';
import styled from 'styled-components';
import { useViewContext } from './ViewContext';
import { getDashboardItemPropertyApi } from './apis/dashboard-item';
import { debounce } from 'throttle-debounce';

const AppContainer = styled.div`
  margin-top: 16px;
`;

const LoadingIndicator = (props) => {
  return <Spinner {...props} />;
};

async function searchForDashboards(searchQuery) {
  const dashboardSearchResponse = await requestJira(`/rest/api/3/dashboard/search?dashboardName=${encodeURIComponent(searchQuery)}`);
  if (!dashboardSearchResponse.ok) {
    throw new Error('Did not perform operation successfully');
  }
  const response = await dashboardSearchResponse.json();
  return response.values;
}

async function getDashboardItems(dashboardId) {
  const dashboardItemsResponse = await requestJira(`/rest/api/3/dashboard/${dashboardId}/gadget`);
  if (!dashboardItemsResponse.ok) {
    throw new Error('Did not perform operation successfully');
  }
  const response = await dashboardItemsResponse.json();
  return response.gadgets;
}

// TODO
function toLabel(dashboard) {
  const description = (dashboard.description || '').length > 0 ? ` - ${dashboard.description}` : '';
  return `${dashboard.name} (${dashboard.id})${description}`
}

/**
 * The purpose of this class is to offer user selection capabilites before
 * landing straight into the Entity Property modification UI.
 *
 * By default we should select the current user viewing this request.
 *
 * We should check if the current user has the permissions to modify the
 * user properties of other users (somewhere in this UI).
 *
 * We should also provide a "selector" experience to find other users and
 * attempt to view their properties.
 */
export function DashboardSelector() {
  const [initialState, setInitialState] = useState(undefined);
  const [selected, setSelected] = useState(undefined);
  const context = useViewContext();

  async function getDashboardOptions(inputValue) {
    const dashboards = await searchForDashboards(inputValue);

    return dashboards.map(dashboard => ({
      label: toLabel(dashboard),
      value: dashboard.id
    }));
  }

  async function getDashboardItemOptions(dashboardId) {
    const dashboardItems = await getDashboardItems(dashboardId);

    return dashboardItems.map(dashboardItem => ({
      label: `${dashboardItem.title} ${dashboardItem.id}`,
      value: dashboardItem.id
    }));
  }

  function onDashboardSelectChange(selectedOption) {
    getDashboardItemOptions(selectedOption.value).then(dashboardItemOptions => {
      setSelected({
        dashboard: selectedOption,
        dashboardItemOptions,
        dashboardItem: dashboardItemOptions[0]
      });
    });
  }

  // TODO Find a way to debounce getDashboardOptions
  return (
    <>
      <p>Dashboard Items (Gadgets) can have entity properties. Use this screen to modify them.</p>
      <Label htmlFor="dashboard-select">Which dashboard?</Label>
      <AsyncSelect
        inputId="dashboard-select"
        cacheOptions
        loadOptions={e => getDashboardOptions(e)}
        components={{ LoadingIndicator }}
        onChange={onDashboardSelectChange}
      />
      {isPresent(selected) && isPresent(selected.dashboard) && (
        <>
          <Label htmlFor="item-select">Which Dashboard Item?</Label>
          <Select
            inputId="item-select"
            defaultValue={selected.dashboardItemOptions[0]}
            options={selected.dashboardItemOptions}
            onChange={(selectedOption) => {
              setSelected({
                ...selected,
                dashboardItem: selectedOption
              });
            }}
          />
        </>
      )}
      {isPresent(selected) && isPresent(selected.dashboardItem) && (
        <AppContainer>
          <App propertyApi={getDashboardItemPropertyApi(selected.dashboard.value, selected.dashboardItem.value)} />
        </AppContainer>
      )}
    </>
  );
}