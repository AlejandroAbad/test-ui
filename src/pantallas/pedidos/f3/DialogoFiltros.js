import { AppBar, Container, Dialog, Grid, GridList, GridListTile, IconButton, makeStyles, Slide, Toolbar, Typography } from "@material-ui/core";
import { Close } from "@material-ui/icons";
import { forwardRef } from "react";
import CodigoCliente from "./CodigosCliente";
import NumeroPedido from "./NumeroPedido";
import RangoFechas, { useRangoFechas } from "./RangoFechas";



const useStyles = makeStyles((theme) => ({
	appBar: {
		position: 'relative',
	},
	title: {
		marginLeft: theme.spacing(2),
		flex: 1,
	},
	mainContainer: {
		marginTop: theme.spacing(0),
		padding: theme.spacing(4, 4, 8, 4)
	},
	boxSelector: {
		margin: theme.spacing(0, 0),
		padding: theme.spacing(2, 4)
	},
	divisor: {
		margin: theme.spacing(4, 0)
	},

}));


const Transition = forwardRef(function Transition(props, ref) {
	return <Slide direction="bottom" ref={ref} {...props} />;
});

export default function DialogoFiltroPedidos({ open, onClose }) {


	const classes = useStyles();


	return (
		<Dialog fullScreen open={open} onClose={onClose} TransitionComponent={Transition} disableBackdropClick disableEscapeKeyDown>
			<AppBar className={classes.appBar}>
				<Toolbar>

					<IconButton edge="start" color="inherit" onClick={onClose} aria-label="close">
						<Close />
					</IconButton>
					<Typography variant="h6" className={classes.title}>
						Filtro de pedidos
					</Typography>
				</Toolbar>
			</AppBar>

			<Container maxWidth="xl" className={classes.mainContainer}>

				<Grid container spacing={3} alignItems="flex-start">

					<Grid item xs={12} md={6}>
						<RangoFechas />
					</Grid>
					<Grid item xs={12} md={6}>
						<CodigoCliente />
					</Grid>

					<Grid item xs={12} md={6}>
						<NumeroPedido />
					</Grid>


				</Grid>




			</Container>
		</Dialog>
	);
}