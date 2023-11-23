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

ReactDOM.render(
  <React.StrictMode>
    <CustomUiRouter>
      <Routes>
        <Route exact path='/module/test-custom-ui-app-hello-world-page' element={<App />} />
        <Route exact path='/module/test-custom-ui-app-hello-world-page/modal/add-property' element={<AddPropertyModal />} />
      </Routes>
    </CustomUiRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
