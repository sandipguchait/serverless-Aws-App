import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
//imorting aws amplify 
import Amplify from 'aws-amplify';
//importing aws configuration files 
import aws_exports from './aws-exports';
Amplify.configure(aws_exports);


ReactDOM.render(<App />, document.getElementById('root'));

