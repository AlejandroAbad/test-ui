import { Button, makeStyles, withStyles } from "@material-ui/core";
import { useCallback } from "react";
import { blueGrey, green, red, yellow } from "@material-ui/core/colors/"

const useStyles = makeStyles((theme) => ({
	elBoton: {
		margin: theme.spacing(0, 0, 0.1, 2),
	},
	primary: {
		color: theme.palette.primary.main
	},
	secondary: {
		color: theme.palette.secondary.main
	},
	info: {
		color: blueGrey[500]
	},
	success: {
		color: green[500]
	},
	warning: {
		color: yellow[500]
	},
	danger: {
		color: red[500]
	}
}));

/*
const ColorButton = withStyles((theme) => ({
	root: {
		margin: theme.spacing(0, 0, 0.1, 2),
		color: theme.palette.getContrastText(purple[500]),
		backgroundColor: purple[500],
		'&:hover': {
			backgroundColor: purple[700],
		},
	},
}))(Button)*/

const ControlModoFiltro = ({ listaModos, modo, onChange }) => {

	const classes = useStyles();

	const avanzaModo = useCallback(() => {
		let indiceActual = modo + 1;
		indiceActual %= listaModos.length;
		onChange(indiceActual);
	}, [listaModos, modo, onChange])


	if (listaModos.length === 0) {
		console.error('La lista de modos no puede estar vacía!!');
		return null;
	}

	let modoSeleccionado = listaModos[modo];

	return <Button
		size="small"
		disableElevation
		className={`${classes.elBoton} ${classes[modoSeleccionado.color]}`}
		startIcon={modoSeleccionado.icono}
		onClick={avanzaModo}
	>
		{modoSeleccionado.texto}
	</Button>

}

export default ControlModoFiltro;