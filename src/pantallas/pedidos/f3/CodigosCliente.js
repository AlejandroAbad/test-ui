import { useState } from "react";
import { Box, makeStyles, Paper } from "@material-ui/core"
import { ControlTextoChip } from "global/camposFormulario/ControlTextoChip";
import ControlModoFiltro from "global/camposFormulario/ControlModoFiltro";
import { ArrowRight, RemoveCircleOutline } from "@material-ui/icons";



const useStyles = makeStyles((theme) => ({
	boxSelector: {
		margin: theme.spacing(0, 0, 2),
		padding: theme.spacing(2, 4, 4)
	}
}));

const MODOS = [
	{ texto: 'Incluye', color: 'success', icono: <ArrowRight/>},
	{ texto: 'NO incluye', color: 'danger', icono: <RemoveCircleOutline/>}
]


export const CodigoCliente = ({ codigoCliente, setCodigoCliente }) => {

	const classes = useStyles();
	const [seleccionActual, setSeleccionActual] = useState([]);
	const [modo, setModo] = useState(0);

	return <Box component={Paper} elevation={3} className={classes.boxSelector} >

		<h3>Códigos de cliente <ControlModoFiltro modo={modo} onChange={setModo} listaModos={MODOS} /></h3>

		<ControlTextoChip
			regexValidacion={/^(PT|pt|Pt|pT)[0-9]{10}$|^[0-9]{1,10}|^[0-9]{8}@hefame$|F\+Online|empleado/}
			regexParticionado={/[\s\r\n\t,-.]+/}
			opciones= {['empleado', 'F+Online']}
			valor={seleccionActual}
			onChange={setSeleccionActual}
			label="Códigos"
			placeholder="Introduzca códigos de cliente"
		/>

	</Box>


}


export default CodigoCliente;