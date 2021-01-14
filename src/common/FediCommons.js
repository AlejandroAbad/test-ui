import { Box } from "@material-ui/core";



export const convertirErrorLlamadaFedicom = (errorFedicom, pintarCodigos) => {

	let mensajes = [];

	if (!errorFedicom) {
		mensajes.push(<>Error desconocido.</>);
	} else if (typeof errorFedicom === 'string') {
		mensajes.push(<>{errorFedicom}</>);
	} else if (errorFedicom.message) {
		if (errorFedicom.message === 'Failed to fetch') mensajes.push(<>No se pudo alcanzar el servidor.</>);
		else mensajes.push(<>{errorFedicom.message}.</>);
	} else if (errorFedicom.map) {
		mensajes = errorFedicom
			.filter(e => e.descripcion)
			.map(e => pintarCodigos && e.codigo ? <>{e.descripcion}. (<small>{e.codigo}</small>) </> : <>{e.descripcion}.</>)
	}

	return mensajes.map((m, i) => <Box key={i}>{m}</Box>)

}



export const tiempoParaExpiracionToken = (segundos) => {

	if (segundos === Infinity) return 'no caduca';

	let valor = segundos;
	let unidad = ' segundo';


	if (valor >= 3600) {
		valor = Math.floor(valor / 3600);
		unidad = ' hora';
	} else if (valor >= 60) {
		valor = Math.floor(valor / 60);
		unidad = ' minuto';
	}

	return 'caduca en ' + valor + unidad +  (valor === 1 ? '' : 's');

}

const FediCommons = {
	convertirErrorLlamadaFedicom,
	tiempoParaExpiracionToken
}

export default FediCommons;