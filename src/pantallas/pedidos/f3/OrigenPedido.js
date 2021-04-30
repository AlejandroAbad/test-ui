import { useState } from "react";
import { Box, Grid, makeStyles, Paper } from "@material-ui/core"
import { ControlTextoChip } from "global/camposFormulario/ControlTextoChip";
import ControlModoFiltro from "global/camposFormulario/ControlModoFiltro";
import { AddCircleOutline, PauseCircleOutline, RemoveCircleOutline } from "@material-ui/icons";



const useStyles = makeStyles((theme) => ({
	grupoSeleccion: {
		margin: theme.spacing(1, 0, 0, 0)
	},
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
	{ texto: 'no aplicar', color: 'mutted', icono: <PauseCircleOutline /> }
]



export const OrigenPedido = () => {

	const classes = useStyles();
	const [seleccionIps, setSeleccionIps] = useState([]);
	const [modoFiltroIps, setModoFiltroIps] = useState(0);

	const [seleccionProgramas, setSeleccionProgramas] = useState([]);
	const [modoFiltroProgramas, setModoFiltroProgramas] = useState(0);




	return <Box component={Paper} elevation={3} className={classes.boxSelector} >

		<h3>Origen de la transmisión</h3>


		<Grid container direction="row" justify="flex-start" alignItems="center">
			<Grid item xs={4} sm={2}>
				<strong>IP Origen</strong>
			</Grid>
			<Grid item xs={8} md={2}>
				<ControlModoFiltro modo={modoFiltroIps} onChange={setModoFiltroIps} listaModos={MODOS} />
			</Grid>
			<Grid item xs={12} md={8}>
				<ControlTextoChip
					regexValidacion={/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/}
					regexParticionado={/[\s\r\n\t]+/}
					valor={seleccionIps}
					onChange={setSeleccionIps}
					label="IPs de origen"
					placeholder="Introduzca direcciones IP"
				/>
			</Grid>
		</Grid>

		<Grid container direction="row" justify="flex-start" alignItems="center" className={classes.grupoSeleccion}>
			<Grid item xs={4} sm={2}>
				<strong>Programa de farmacia</strong>
			</Grid>
			<Grid item xs={8} md={2}>
				<ControlModoFiltro modo={modoFiltroProgramas} onChange={setModoFiltroProgramas} listaModos={MODOS} />
			</Grid>
			<Grid item xs={12} md={8}>
				<ControlTextoChip
					opcionesFijas
					opciones={['Farmatic', 'Unycopwin', 'Nixfarma', 'F+Online', 'And so on...']}
					valor={seleccionProgramas}
					onChange={setSeleccionProgramas}
					label="Programa de farmacia"
				/>
			</Grid>
		</Grid>
		
	</Box>


}


export default OrigenPedido;