import ReactDOM from 'react-dom';
import moment from 'moment';


import { ProveedorContextoAplicacion } from 'contexto';
import App from 'App';

import './index.css';

import 'fontsource-roboto';
import 'moment/locale/es';
moment.locale('es');



ReactDOM.render(
  <ProveedorContextoAplicacion>
    <App />
  </ProveedorContextoAplicacion>,
  document.getElementById('root')
);
