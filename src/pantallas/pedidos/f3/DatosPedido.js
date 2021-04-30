import { useCallback, useState } from "react";
import { Box, Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, makeStyles, Paper, Typography } from "@material-ui/core"
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
	},
	formControl: {
		margin: theme.spacing(1, 0, 0, 4)
	},
	labelFlags: {
		margin: theme.spacing(3, 0, 0, 0)
	},
	captionFlag: {
		margin: theme.spacing(0, 0, 0, 2)
	}

}));

const MODOS = [
	{ texto: 'Incluye', color: 'success', icono: <AddCircleOutline /> },
	{ texto: 'NO incluye', color: 'danger', icono: <RemoveCircleOutline /> },
	{ texto: 'no aplicar', color: 'mutted', icono: <PauseCircleOutline /> }
]


const FLAGS = [
	/*{ name: 'transfer', label: 'Transfers', textos: ['Mostrar solo pedidos transfer', 'No mostrar pedidos transfer', ''] },*/
	{ name: 'estupe', label: 'Estupefacientes', textos: ['Mostrar solo pedidos con estupefacientes', 'No mostrar pedidos con estupefacientes', ''] },
	{ name: 'nofaltas', label: 'Incidencias', textos: ['Mostrar solo pedidos en los que no se le devolvieron faltas a la farmacia', 'Mostrar solo pedidos en los que se le devolvieron faltas a la farmacia', ''] },
	{ name: 'cliBloq', label: 'Bloqueo pedidos', textos: ['Mostrar solo pedidos rechazados por bloqueo de pedidos', 'Mostrar solo pedidos que NO han sido rechazados por bloqueo de pedidos', ''] },
]

const FormControlLabelFlag = ({ flag }) => {

	let classes = useStyles();
	let [estado, setEstado] = useState(2);
	let cambiaEstado = useCallback(() => {
		setEstado((estado + 1) % 3);
	}, [setEstado, estado]);

	let color = 'initial';
	switch (estado) {
		case 0: color = 'primary'; break;
		case 1: color = 'secondary'; break;
		default: color = 'initial'; break;
	}


	let label = <>
		<Typography variant="button" color={color}>{flag.label}</Typography >
		<Typography variant="caption" className={classes.captionFlag}>{flag.textos[estado]}</Typography >
	</>

	return <FormControlLabel
		control={<Checkbox
			checked={estado !== 2}
			indeterminate={estado === 1}
			onChange={cambiaEstado}
			name={flag.name}
			color={color}
		/>}
		label={label}
	/>
}


export const DatosPedido = () => {

	const classes = useStyles();
	const [seleccionAlmacen, setSeleccionAlmacen] = useState([]);
	const [modoFiltroAlmacen, setModoFiltroAlmacen] = useState(0);

	const [seleccionTipo, setSeleccionTipo] = useState([]);
	const [modoFiltroTipo, setModoFiltroTipo] = useState(0);




	return <Box component={Paper} elevation={3} className={classes.boxSelector} >

		<h3>Datos del pedido</h3>

		<Grid container direction="row" justify="flex-start" alignItems="center">
			<Grid item xs={4} sm={2}>
				<strong>Almacén</strong>
			</Grid>
			<Grid item xs={8} md={2}>
				<ControlModoFiltro modo={modoFiltroAlmacen} onChange={setModoFiltroAlmacen} listaModos={MODOS} />
			</Grid>
			<Grid item xs={12} md={8}>
				<ControlTextoChip
					opcionesFijas
					opciones={['RG01 - Santomera', 'RG03 - Cartagena', 'RG04 - Getafe', 'RG15 - Barcelona', 'And so on...']}
					valor={seleccionAlmacen}
					onChange={setSeleccionAlmacen}
					label="Almacén"
				/>
			</Grid>
		</Grid>

		<Grid container direction="row" justify="flex-start" alignItems="center" className={classes.grupoSeleccion}>
			<Grid item xs={4} sm={2}>
				<strong>Tipo de pedido</strong>
			</Grid>
			<Grid item xs={8} md={2}>
				<ControlModoFiltro modo={modoFiltroTipo} onChange={setModoFiltroTipo} listaModos={MODOS} />
			</Grid>
			<Grid item xs={12} md={8}>
				<ControlTextoChip
					regexValidacion={/^[0-9]+$/}
					regexParticionado={/[\s\r\n\t]+/}
					valor={seleccionTipo}
					onChange={setSeleccionTipo}
					label="Tipo de pedido"
				/>
			</Grid>
		</Grid>

		<Typography variant="body2" display="block" className={classes.labelFlags}><strong>Características del pedido</strong></Typography>

		<FormControl component="fieldset" className={classes.formControl}>
			<FormGroup>
				{FLAGS.map((flag, i) => <FormControlLabelFlag key={i} flag={flag} />)}
			</FormGroup>
		</FormControl>

	</Box>

}


export default DatosPedido;