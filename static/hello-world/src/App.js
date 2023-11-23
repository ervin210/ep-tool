
import React, { useState } from 'react';
import { invoke, requestJira, view, Modal } from '@forge/bridge';
import { useEffectAsync } from './useEffectAsync';
import { isPresent } from 'ts-is-present';
import { Property } from './Property';
import EditorAddIcon from '@atlaskit/icon/glyph/editor/add';
import Button from '@atlaskit/button';
import { TYPE_CREATE } from './AddPropertyModal';

const ProjectPropertyApi = {
  getPropertyKeys: async (projectId) => {
    const propertiesResponse = await requestJira(`/rest/api/3/project/${projectId}/properties`);
    if (!propertiesResponse.ok) {
      throw new Error('Did not perform operation successfully');
    }
    const propertyPayload = await propertiesResponse.json();
    return propertyPayload.keys.map(p => p.key);
  },
  getProperty: async (projectId, propertyKey) => {
    const propertiesResponse = await requestJira(`/rest/api/3/project/${projectId}/properties/${encodeURIComponent(propertyKey)}`);
    if (!propertiesResponse.ok) {
      throw new Error('Did not perform operation successfully');
    }
    return await propertiesResponse.json();
  },
  setProperty: async (projectId, propertyKey, data) => {
    const propertiesResponse = await requestJira(`/rest/api/3/project/${projectId}/properties/${encodeURIComponent(propertyKey)}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Content-type': "application/json"
      }
    });
    if (!propertiesResponse.ok) {
      throw new Error('Did not perform operation successfully');
    }
  },
  deleteProperty: async (projectId, propertyKey) => {
    const propertiesResponse = await requestJira(`/rest/api/3/project/${projectId}/properties/${encodeURIComponent(propertyKey)}`, {
      method: 'DELETE',
      headers: {
        'Content-type': "application/json"
      }
    });
    if (!propertiesResponse.ok) {
      throw new Error('Did not perform operation successfully');
    }
  }
}

function App() {
  const propertyApi = ProjectPropertyApi;
  const [entityPropertyState, setEntityPropertyState] = useState(undefined);

  async function loadEntityPropertyState() {
    const context = await view.getContext();
    console.log('context', context);
    const projectId = context.extension.project.id;
    return {
      projectId,
      keys: await propertyApi.getPropertyKeys(projectId)
    };
  }

  useEffectAsync(async () => {
    setEntityPropertyState(await loadEntityPropertyState());
  }, entityPropertyState);

  async function onDelete(propertyKey) {
    await propertyApi.deleteProperty(entityPropertyState.projectId, propertyKey);
    setEntityPropertyState(await loadEntityPropertyState());
  }

  const addPropertyClosed = async (payload) => {
    if (payload.type === TYPE_CREATE) {
      const { propertyKey, propertyValue } = payload.data;

      // TODO what if this fails?
      await propertyApi.setProperty(entityPropertyState.projectId, propertyKey, JSON.parse(propertyValue));

      setEntityPropertyState(await loadEntityPropertyState());
    }
  };

  const addPropertyModal = new Modal({
    onClose: (payload) => addPropertyClosed(payload),
    size: 'medium',
    context: {
      type: 'add-property'
    }
  });

  return (
    <div>
      <p>These are the entity properties for this project.</p>
      {!isPresent(entityPropertyState) && (
        <div>Loading the properties for this project...</div>
      )}
      {isPresent(entityPropertyState) && (
        <>
          <Button iconBefore={<EditorAddIcon />} onClick={() => addPropertyModal.open()}>Add property</Button>
          {entityPropertyState.keys.map(key => (
            <Property
              key={`${key}`}
              projectId={entityPropertyState.projectId}
              propertyKey={key}
              propertyApi={propertyApi}
              onDelete={() => onDelete(key)}
            />
          ))}
        </>
      )}
    </div>
  );
}

export default App;
