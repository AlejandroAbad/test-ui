import K from 'K';
import { Button, Container } from "@material-ui/core";
import { useApiCall } from "hooks/useApiCall";
import TituloPantalla from "navegacion/TituloPantalla";
import ContextoAplicacion from 'contexto';
import { useContext, useEffect, useState } from 'react';
import ReactJson from 'react-json-view';
import BarraProgresoSuperior from 'navegacion/BarraProgresoSuperior';
import DialogoFiltroPedidos from './DialogoFiltros';


export default function PantallaPedidosF3() {

	const { getJwt } = useContext(ContextoAplicacion);
	const [dialogoFiltrosAbierto, setDialogoFiltrosAbierto] = useState(false);

	const { resultado, put: getPedidos } = useApiCall(K.URL_MONITOR, getJwt());

	useEffect(() => {
		getPedidos('/transmisiones', {
			filtro: {
				type: 10
			},
			proyeccion: {
				client: 1,
				createdAt: 1
			},
			limite: 10
		})
	}, [getPedidos])



	let listadoPedidos = <ReactJson src={resultado.datos} />

	return (
		<Container fixed maxWidth="xl">
			<BarraProgresoSuperior cargando={resultado.cargando} />
			<TituloPantalla titulo="Pedidos Fedicom3" />

			<Button onClick={() => setDialogoFiltrosAbierto(true)}>Abrir filtro</Button>

			{listadoPedidos}


			<DialogoFiltroPedidos
				open={dialogoFiltrosAbierto}
				onClose={() => setDialogoFiltrosAbierto(false)}
			/>


		</Container>
	)


}