import React, { createContext, useCallback } from 'react';

import useStateLocalStorage from 'hooks/useStateLocalStorage';


const ContextoAplicacion = createContext(null);
const { Provider } = ContextoAplicacion;

const ProveedorContextoAplicacion = ({ children }) => {

	const [jwt, _setJwt] = useStateLocalStorage('login.jwt', null, true);
	const [usuario, _setUsuario] = useStateLocalStorage('login.usuario', null, true);

	const setJwt = useCallback((token, datos) => {
		_setJwt(token);
		_setUsuario(datos);
	}, [_setJwt, _setUsuario])

	return <Provider value={{ jwt, usuario, setJwt }}>{children}</Provider>;
};

export { ContextoAplicacion, ProveedorContextoAplicacion };
export default ContextoAplicacion;