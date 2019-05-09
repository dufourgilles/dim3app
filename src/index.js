import React from 'react';
import {render} from 'react-dom';
import {Route} from 'react-router';
import {BrowserRouter} from 'react-router-dom';
import App from './App';
import './GDNetBoostrapThemes.css';

console.log("Starting");
render(
  <div>
    <BrowserRouter>
      <Route path="/" component={App}/>
    </BrowserRouter>
  </div>,
  document.getElementById('root')
);
