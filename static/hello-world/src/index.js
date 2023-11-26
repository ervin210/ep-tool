import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Routes } from 'react-router-dom';
import App from './App';
import { CustomUiRouter } from './CustomUiRouter';
import { AddPropertyModal } from './AddPropertyModal';

import '@atlaskit/css-reset';
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";
import { ProjectPropertyApi } from './apis/project';
import { IssuePropertyApi } from './apis/issue';

ReactDOM.render(
  <React.StrictMode>
    <CustomUiRouter>
      <Routes>
        <Route exact path='/module/project-entity-properties' element={<App propertyApi={ProjectPropertyApi} />} />
        <Route exact path='/module/issue-entity-properties' element={<App propertyApi={IssuePropertyApi} />} />
        <Route exact path='/module/user-entity-properties' element={<App propertyApi={IssuePropertyApi} />} />
        <Route exact path='/module/project-entity-properties/modal/add-property' element={<AddPropertyModal />} />
        <Route exact path='/module/issue-entity-properties/modal/add-property' element={<AddPropertyModal />} />
        <Route exact path='/module/user-entity-properties/modal/add-property' element={<AddPropertyModal />} />
      </Routes>
    </CustomUiRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
