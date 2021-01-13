import ReactDOM from 'react-dom';

import { ProveedorContextoAplicacion } from 'contexto';
import App from 'App';

import 'fontsource-roboto';

ReactDOM.render(
  <ProveedorContextoAplicacion>
    <App />
  </ProveedorContextoAplicacion>,
  document.getElementById('root')
);
