import { Card, AppBar, Paper, Container, Dialog, IconButton, makeStyles, Slide, Toolbar, Typography, Button, CardContent, CardActions, Divider, Box, LinearProgress, Collapse, List, ListItem, ListItemIcon, ListItemText, Slider, Fade } from "@material-ui/core";
import { Close, BugReport, Check, FlightTakeoff, HourglassEmpty, Pause, PlayArrow, Stop, Whatshot } from "@material-ui/icons";
import TituloPantalla from "navegacion/TituloPantalla";
import { forwardRef, useCallback, useState } from "react";

import imgCobete from './cobete.webp';
import imgCobeteParado from './cobeteParado.png';
import imgCobeteFinalizada from './misionFinalizada.png';
import imgCobeteAbortada from './misionAbortada.png';
import { useApiCall } from "hooks/useApiCall";

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
	divisor: {
		margin: theme.spacing(4, 0)
	},
	barraProgreso: {
		margin: theme.spacing(0, 0, 2, 0)
	},
	botonAbortar: {
		marginLeft: theme.spacing(4)
	},

}));


const Transition = forwardRef(function Transition(props, ref) {
	return <Slide direction="right" ref={ref} {...props} />;
});


const convertirTramaAFedicom3 = function(trama2) {
	return {
		estado: 'EN COLA',
		trama3: {
			authReq: {
				username: trama2.usuario,
				domain: trama2.transfer ? 'transfer_laboratorio' : 'FEDICOM'
			},
			codigoCliente: trama2.codCli,
			numeroPedidoOrigen: trama2.crc,
			codigoAlmacenServicio: trama2.almacen,
			tipoPedido: trama2.tipoPed,
			lineas: trama2.lineas.map( linea2 => {
				return {
					codigoArticulo: linea2.codArti,
					cantidad: linea2.cantidad,
					valeEstupefaciente: linea2.valeEstupefaciente ?? undefined,
					descuentoPorcentaje: linea2.descuentoLinea ?? undefined
				}
			})
		} 

	}
}

export default function DialogoEnvio({ open, onClose, destino, tramas, tramasSeleccionadas }) {

	const [misionActiva, setMisionActiva] = useState(false);
	const [misionFinalizada, setMisionFinalizada] = useState(false);
	const [misionPausada, setMisionPausada] = useState(false);
	const [misionAbortada, setMisionAbortada] = useState(false);

	const [vuelosSimultaneos, setVuelosSimultaneos] = useState(5);
	const [retrasoEntreVuelos, setRetrasoEntreVuelos] = useState(0.5);


	const { post: lanzarPedido } = useApiCall('https://fedicom3-dev.hefame.es')



	const enviarTramas = useCallback(() => {
		setMisionActiva(true);

		
		let tramasPendientes = tramasSeleccionadas.map(indiceDeTrama => convertirTramaAFedicom3(tramas[indiceDeTrama]) );

		console.log(tramasPendientes)

		lanzarPedido('/pedidos', )

		setTimeout(() => {
			setMisionActiva(false);
			setMisionFinalizada(true);
		}, 5000)

	}, [setMisionActiva, setMisionFinalizada, tramasSeleccionadas, lanzarPedido, tramas]) 

	const cerrarDialogo = useCallback(() => {
		setMisionActiva(false);
		setMisionFinalizada(false);
		setMisionPausada(false);
		setMisionAbortada(false);
		onClose();
	}, [setMisionActiva, setMisionFinalizada, onClose])

	const classes = useStyles();
	const laEse = tramasSeleccionadas.length === 1 ? '' : 's';

	return (
		<Dialog fullScreen open={open} onClose={onClose} TransitionComponent={Transition} disableBackdropClick disableEscapeKeyDown>
			<AppBar className={classes.appBar}>
				<Toolbar>
					<Fade in={!misionActiva && !misionFinalizada}>
						<IconButton edge="start" color="inherit" onClick={onClose} aria-label="close">
							<Close />
						</IconButton>
					</Fade>
					<Typography variant="h6" className={classes.title}>
						Envío de tramas a <b>{destino && destino.toUpperCase()}</b>
					</Typography>
				</Toolbar>
			</AppBar>
			<Container maxWidth="lg" fixed className={classes.mainContainer} component={Paper} elevation={3}>

				<TituloPantalla>
					Envío de tramas a Fedicom3 - {destino && destino.toUpperCase()}
				</TituloPantalla>

				<Collapse in={!misionActiva && !misionFinalizada}>
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
							<Button size="small" variant="outlined" color="secondary" onClick={enviarTramas}>
								Sí, estoy TO loco
        				</Button>
							<Divider orientation="vertical" />
							<Button size="small" variant="outlined" color="primary" onClick={onClose}>
								NO, NI DE COÑA
        				</Button>
						</CardActions>
					</Card>
				</Collapse>

				<Collapse in={misionActiva && !misionFinalizada}>
					<Box>
						<Box display="flex" justifyContent="center" my={-10}>
							<img src={misionPausada ? imgCobeteParado : imgCobete} alt="cobete" className={classes.cobete} />
						</Box>

						<Box display="flex" flexDirection="row-reverse">
							<Button variant="outlined"
								color="secondary"
								className={classes.botonAbortar}
								startIcon={<Stop />}
								disabled={misionAbortada}
								onClick={() => setMisionAbortada(true)}>{misionAbortada ? "Abortando misión ..." : "Abortar misión"}
							</Button>
							<Fade in={!misionAbortada}>
								<Button variant="outlined"
									color={misionPausada ? "primary" : "default"}
									className={classes.botonAbortar}
									startIcon={misionPausada ? <PlayArrow /> : <Pause />} onClick={() => setMisionPausada(!misionPausada)}>
									{misionPausada ? "Reanudar" : "Pausar"}
								</Button>
							</Fade>
						</Box>

						<Box display="flex" alignContent="center">
							<Typography variant="h6" component="p" gutterBottom>
								{!misionAbortada ? (!misionPausada ? 'Lanzando cobetes' : 'Misión en pausa') : 'Abortando misión'}
							</Typography>
						</Box>

						<LinearProgress
							color={!misionAbortada ? "primary" : "secondary"}
							variant={!misionAbortada ? (misionPausada ? "determinate" : "buffer") : "query"}
							value={misionPausada ? 0 : 30}
							valueBuffer={misionPausada ? 0 : 32}
							className={classes.barraProgreso}
						/>

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
								No permitir mas de <b>{vuelosSimultaneos}</b> vuelos simultaneos
      							</Typography>
							<Typography variant="caption" gutterBottom>
								Es posible que tu navegador pete si seleccionas un valor alto.
      							</Typography>
							<Slider

								value={vuelosSimultaneos}
								onChange={(e, v) => setVuelosSimultaneos(v)}
								valueLabelDisplay="auto"
								step={1}
								marks
								min={1}
								max={20}

							/>
							<Typography gutterBottom>
								Esperar <b>{retrasoEntreVuelos} segundos</b> entre vuelos
      							</Typography>
							<Slider
								value={retrasoEntreVuelos}
								onChange={(e, v) => setRetrasoEntreVuelos(v)}
								valueLabelDisplay="auto"
								step={0.1}
								min={0.1}
								max={10}
							/>
						</Box>
					</Box>
				</Collapse>

				<Collapse in={misionFinalizada}>
					<Box>

						<Box display="flex" justifyContent="center" >
							<Typography variant="h4" component="p" gutterBottom>
								{!misionAbortada ? '¡¡ Misión finalizada !!' : 'Misión abortada'}
							</Typography>
						</Box>

						<Box display="flex" justifyContent="center" >
							<img src={misionAbortada ? imgCobeteAbortada : imgCobeteFinalizada} alt="cobete" />
						</Box>

						<List component="nav">
							<ListItem >
								<ListItemIcon>
									<HourglassEmpty />
								</ListItemIcon>
								<ListItemText primary="22650 cobetes han quedado pendientes de lanzamiento." />
							</ListItem>
							<ListItem >
								<ListItemIcon>
									<Check />
								</ListItemIcon>
								<ListItemText primary="2750 cobetes han llegado con éxito a su destino." />
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
						<Button onClick={cerrarDialogo}>
							CERRAR
						</Button>
					</Box>
				</Collapse>

			</Container>
		</Dialog>
	);
}