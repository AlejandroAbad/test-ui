import React, { createContext, useCallback, useState } from 'react';

import useStateLocalStorage from 'hooks/useStateLocalStorage';
import useInterval from 'hooks/useInterval';


const ContextoAplicacion = createContext(null);
const { Provider } = ContextoAplicacion;

const ProveedorContextoAplicacion = ({ children }) => {

	const [jwt, _setJwt] = useStateLocalStorage('login.jwt', null, true);
	const [usuario, _setUsuario] = useStateLocalStorage('login.usuario', null, true);
	const [tiempoRestanteToken, _setTiempoRestanteToken] = useState(Infinity);

	useInterval( async () => {
		
		if (usuario?.exp > 0 && usuario?.exp < 9999999999999) {
			let now = (new Date()).getTime() / 1000;
			let ttl = Math.round(usuario.exp - now);

			if (ttl < 0) {
				setJwt(null, null);
				return;
			}

			if (tiempoRestanteToken !== ttl) {
				_setTiempoRestanteToken(ttl);
			}
		} else {
			if (tiempoRestanteToken !== Infinity) {
				_setTiempoRestanteToken(Infinity);
			}
		}

	}, 1000)

	const setJwt = useCallback((token, datos) => {
		_setJwt(token);
		_setUsuario(datos);

	}, [_setJwt, _setUsuario]);




	return <Provider value={{ jwt, usuario, tiempoRestanteToken,  setJwt }}>{children}</Provider>;
};

export { ContextoAplicacion, ProveedorContextoAplicacion };
export default ContextoAplicacion;