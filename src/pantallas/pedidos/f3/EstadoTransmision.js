import { useCallback, useState } from "react";
import { Box, Button, Grid, makeStyles, Paper, Typography } from "@material-ui/core"
// import { ControlTextoChip } from "global/camposFormulario/ControlTextoChip";
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
	{ texto: 'coincide con', color: 'success', icono: <AddCircleOutline /> },
	{ texto: 'NO coincide con', color: 'danger', icono: <RemoveCircleOutline /> },
	{ texto: 'Filtro desactivado', color: 'mutted', icono: <PauseCircleOutline /> }
]


const BotonEstado = ({ estados, seleccionActual, setSeleccionActual, children }) => {

	const estaSeleccionado = useCallback(() => {
		let aparecenTodos = true;
		estados.forEach(estado => {
			aparecenTodos &= seleccionActual.includes(estado);
		})
		return aparecenTodos;
	}, [estados, seleccionActual])

	let [seleccionado, setSeleccionado] = useState(estaSeleccionado());

	const cambiarSeleccion = () => {
		if (seleccionado) {
			setSeleccionActual(seleccionActual.filter(estado => !estados.includes(estado)))
		} else {
			setSeleccionActual([...seleccionActual, ...estados])
		}

		setSeleccionado(!seleccionado);
	}

	return <Grid item>
		<Button variant={seleccionado ? "contained" : "outlined"} color={seleccionado ? "primary" : "default"} onClick={cambiarSeleccion} 	>
			{children}
		</Button >
	</Grid>
}

export const EstadoTransmision = () => {

	const classes = useStyles();
	const [seleccionActual, setSeleccionActual] = useState([]);
	const [modoFiltro, setModoFiltro] = useState(0);

	let propiedadesBotones = { seleccionActual, setSeleccionActual };

	return <Box component={Paper} elevation={modoFiltro === 2 ? 1 : 3} className={`${classes.boxSelector} ${modoFiltro === 2 && classes.boxSelectorDisabled}`} >

		<h3>Estado del pedido <ControlModoFiltro modo={modoFiltro} onChange={setModoFiltro} listaModos={MODOS} /></h3>

		<Grid container spacing={1} justify="space-start" alignItems="center">
			<Grid item><Typography variant="overline">Pedidos que estan en</Typography></Grid>
			<BotonEstado estados={[1010, 1020, 1030]} {...propiedadesBotones} >Chequeo disponibilidad</BotonEstado>
			<BotonEstado estados={[8010]} {...propiedadesBotones}>Grabando pedido</BotonEstado>
			<BotonEstado estados={[9900]} {...propiedadesBotones}>Completados</BotonEstado>
		</Grid>



		<Grid container spacing={1} justify="space-start" alignItems="center">
			<Grid item><Typography variant="overline">Pedidos que han sido rechazados</Typography></Grid>
			<BotonEstado estados={[3010, 3011, 3020]} {...propiedadesBotones}>POR ERROR DEL CLIENTE</BotonEstado >
			<BotonEstado estados={[3120]} {...propiedadesBotones}>POR SAP</BotonEstado >
		</Grid>

		<Grid container spacing={1} justify="space-start" alignItems="center">
			<Grid item><Typography variant="overline">Pedidos en error</Typography></Grid>
			<BotonEstado estados={[3110]} {...propiedadesBotones}>SAP NO DISPONIBLE</BotonEstado >
			<BotonEstado estados={[8100, 9140]} {...propiedadesBotones}>ERROR BAPI</BotonEstado >
		</Grid>

	</Box>


}


export default EstadoTransmision;