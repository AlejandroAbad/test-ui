import { Card, AppBar, Paper, Container, Dialog, IconButton, makeStyles, Slide, Toolbar, Typography, Button, CardActionArea, CardContent, CardActions, Divider, Box, LinearProgress, Collapse, List, ListItem, ListItemIcon, ListItemText, Slider } from "@material-ui/core";
import { CloseIcon } from "@material-ui/data-grid";
import { AirplanemodeActive, BugReport, Check, Flight, FlightTakeoff, HourglassEmpty, Whatshot } from "@material-ui/icons";
import TituloPantalla from "navegacion/TituloPantalla";
import { forwardRef } from "react";
import cobete from './cobete.webp';

const useStyles = makeStyles((theme) => ({
	appBar: {
		position: 'relative',
	},
	title: {
		marginLeft: theme.spacing(2),
		flex: 1,
	},
	mainContainer: {
		marginTop: theme.spacing(4),
		padding: theme.spacing(4, 4, 8, 4)
	},
	cardConfirmacion: {
		margin: theme.spacing(0, 30),
		padding: theme.spacing(2, 4)
	},
	cobete: {
		transform: 'rotate(90deg)'
	},
	expand: {
		transform: 'rotate(0deg)',
		marginLeft: 'auto',
		transition: theme.transitions.create('transform', {
			duration: theme.transitions.duration.shortest,
		}),
	},
	divisor: {
		margin: theme.spacing(4, 0)
	}

}));


const Transition = forwardRef(function Transition(props, ref) {
	return <Slide direction="right" ref={ref} {...props} />;
});


export default function DialogoEnvio({ open, onClose, destino, tramas, tramasSeleccionadas }) {

	const classes = useStyles();
	const laEse = tramasSeleccionadas.length === 1 ? '' : 's';

	return (
		<Dialog fullScreen open={open} onClose={onClose} TransitionComponent={Transition}>
			<AppBar className={classes.appBar}>
				<Toolbar>
					<IconButton edge="start" color="inherit" onClick={onClose} aria-label="close">
						<CloseIcon />
					</IconButton>
					<Typography variant="h6" className={classes.title}>
						Envío de tramas a <b>{destino && destino.toUpperCase()}</b>
					</Typography>
				</Toolbar>
			</AppBar>
			<Container maxWidth="lg" fixed className={classes.mainContainer} component={Paper} elevation={3}>

				<TituloPantalla>
					Envío de tramas a Fedicom3 - {destino && destino.toUpperCase()}
				</TituloPantalla>

				<Collapse in={true}>
					<Card elevation={3} className={classes.cardConfirmacion} >

						<CardContent>
							<Typography variant="h5" color="primary" gutterBottom >
								¡¡ Atención !!
          					</Typography>
							<Typography variant="subtitle1" component="p" gutterBottom>
								Se va a proceder al envío de
								<Typography variant="subtitle1" component="span" color="secondary"> <b>{tramasSeleccionadas.length} trama{laEse}</b> </Typography>
								al concentrador Fedicom 3
								<Typography variant="subtitle1" component="span" color="secondary"> <b>{destino && destino.toUpperCase()}</b></Typography>
								.
							</Typography>
							<Typography variant="subtitle2" component="p">
								¿Te has vuelto loco?
          					</Typography>
						</CardContent>

						<CardActions>
							<Button size="small" variant="outlined" color="secondary">
								Sí, estoy TO loco
        				</Button>
							<Divider vertical />
							<Button size="small" variant="outlined" color="primary" onClick={onClose}>
								NO, NI DE COÑA
        				</Button>
						</CardActions>
					</Card>
				</Collapse>


				<Box>

					<Box display="flex" justifyContent="center" my={-10}>
						<img src={cobete} alt="cobete" className={classes.cobete} />
					</Box>
					<Typography variant="h6" component="p" gutterBottom>Progreso del envío</Typography>

					<LinearProgress color="secondary" variant="buffer" value={30} valueBuffer={31} />


					<List component="nav">
						<ListItem >
							<ListItemIcon>
								<Check />
							</ListItemIcon>
							<ListItemText primary="2750 cobetes han llegado con éxito a su destino." />
						</ListItem>
						<ListItem >
							<ListItemIcon>
								<HourglassEmpty />
							</ListItemIcon>
							<ListItemText primary="22650 cobetes pendientes de lanzar." />
						</ListItem>
						<ListItem >
							<ListItemIcon>
								<FlightTakeoff />
							</ListItemIcon>
							<ListItemText primary="3 cobetes están de camino." />
						</ListItem>
						<ListItem >
							<ListItemIcon>
								<BugReport />
							</ListItemIcon>
							<ListItemText primary="9 cobetes no se han enviado por ser defectuosos." />
						</ListItem>
						<ListItem >
							<ListItemIcon>
								<Whatshot />
							</ListItemIcon>
							<ListItemText primary="9 cobetes se han estrellado." />
						</ListItem>
					</List>


					<Divider className={classes.divisor} />
					<Box mt={2}>
						<Typography variant="h6" component="p" gutterBottom>Opciones</Typography>

						<Typography >
							No permitir mas de <b>5</b> vuelos simultaneos
      					</Typography>
						<Typography variant="caption" gutterBottom>
							Es posible que tu navegador se pete si seleccionas un valor alto.
      					</Typography>
						<Slider
							defaultValue={30}
							valueLabelDisplay="auto"
							step={1}
							marks
							min={1}
							max={20}

						/>
						<Typography gutterBottom>
							Esperar <b>0.4 segundos</b> entre vuelos
      					</Typography>
						<Slider
							defaultValue={0.5}
							valueLabelDisplay="auto"
							step={0.1}
							min={0.1}
							max={10}
						/>
					</Box>


				</Box>


			</Container>
		</Dialog>
	);
}