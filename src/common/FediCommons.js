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

const FediCommons = {
	convertirErrorLlamadaFedicom
}

export default FediCommons;