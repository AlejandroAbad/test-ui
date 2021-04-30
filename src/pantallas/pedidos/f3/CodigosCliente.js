import { useState } from "react";
import { Box, makeStyles, Paper } from "@material-ui/core"
import { ControlTextoChip } from "global/camposFormulario/ControlTextoChip";
import ControlModoFiltro from "global/camposFormulario/ControlModoFiltro";
import { AddCircleOutline, PauseCircleOutline, RemoveCircleOutline } from "@material-ui/icons";



const useStyles = makeStyles((theme) => ({
	boxSelector: {
		margin: theme.spacing(0, 0, 2),
		padding: theme.spacing(1, 4, 4)
	},
	boxSelectorDisabled: {
		backgroundColor: theme.palette.grey[200]
	}
}));

const MODOS = [
	{ texto: 'Incluye', color: 'success', icono: <AddCircleOutline /> },
	{ texto: 'NO incluye', color: 'danger', icono: <RemoveCircleOutline /> },
	{ texto: 'Filtro desactivado', color: 'mutted', icono: <PauseCircleOutline /> }
]


export const CodigoCliente = ({ codigoCliente, setCodigoCliente }) => {

	const classes = useStyles();
	const [seleccionActual, setSeleccionActual] = useState([]);
	const [modoFiltro, setModoFiltro] = useState(0);

	return <Box component={Paper} elevation={modoFiltro === 2 ? 1 : 3} className={`${classes.boxSelector} ${modoFiltro === 2 && classes.boxSelectorDisabled}`} >

		<h3>Código de cliente <ControlModoFiltro modo={modoFiltro} onChange={setModoFiltro} listaModos={MODOS} /></h3>

		<ControlTextoChip
			regexValidacion={/^(PT|pt|Pt|pT)[0-9]{10}$|^[0-9]{1,10}|^[0-9]{8}@hefame$|F\+Online|empleado/}
			regexParticionado={/[\s\r\n\t,-.]+/}
			opciones={['empleado', 'F+Online']}
			valor={seleccionActual}
			onChange={setSeleccionActual}
			label="Códigos de cliente"
		/>

	</Box>


}


export default CodigoCliente;