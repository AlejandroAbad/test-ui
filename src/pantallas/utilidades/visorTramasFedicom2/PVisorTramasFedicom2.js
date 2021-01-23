import { Box, Button, ButtonGroup, Checkbox, Collapse, Container, Divider, Fade, FormControlLabel,  ListItem, ListItemText, makeStyles, TextField,  Typography } from "@material-ui/core";
import useWindowSize from "hooks/useWindowSize";
import TituloPantalla from "navegacion/TituloPantalla";
import { useCallback, useRef, useState } from "react";
import { Virtuoso } from 'react-virtuoso';
import { useWorker } from "@koale/useworker";
import { CloudUpload, DeleteForever, RotateLeft, Send } from "@material-ui/icons";
import CircularProgressWithLabel from "common/CircularProgressWithLabel";
import workerAnalizaTramas from "workers/workerAnalisisTramasFedicom2";
import CajaTramaFedicom2 from "./CajaTramaFedicom2";
import useSeleccion from "hooks/useSeleccion";
import DialogoEnvio from "./DialogoEnvio";


const LABEL_CARGANDO_FICHERO = 'Cargando fichero ...';
const LABEL_ANALIZANDO_TRAMAS = 'Analizando tramas ... esto te va a doler mas a tí que a mí ...';




const useStyles = makeStyles((theme) => ({
	input: {
		display: 'none'
	},
	containerFull: {
		margin: 0,
		padding: 0
	},
	cabeceraTabla: {
		paddingBottom: '1.5em',
		paddingLeft: '3.3em'
	},
	botonReiniciar: {
		marginLeft: theme.spacing(4)
	},
	virtuoso: {
		borderTop: '1px solid rgb(0,0,0,0.1)'
	},
	cabeceraTrama: {
		paddingTop: theme.spacing(2),
		paddingBottom: theme.spacing(2),
		border: 'none',
		paddingLeft: theme.spacing(3.5)
	},
	contenedorTrama: {
		paddingTop: theme.spacing(4),
		paddingBottom: theme.spacing(6),
		borderTop: 'none'
	},
	grupoBotonMenu: {
		paddingLeft: theme.spacing(0.8)
	},
	botonMenu: {
		padding: theme.spacing(0.8, 2)
	},
	textoMenu: {
		display: 'inline-block',
		margin: theme.spacing(0, 0, 0, 2)

	}

}));

const renderizaTrama = (index, trama, onSeleccionCambia, classes) => {

	return (
		<CajaTramaFedicom2 trama={trama} indice={index} onSeleccionCambia={onSeleccionCambia} classes={classes} />
	);
}


const CabeceraTramas = ({ seleccion, totalTramas, classes, cambiarTodaLaSeleccion, onDescartarTramas, onEliminarTramasSeleccionadas, onEnviarTramasSeleccionadas }) => {

	const cambiarSeleccion = useCallback(() => {
		console.log(seleccion.length, totalTramas)
		cambiarTodaLaSeleccion(seleccion.length !== totalTramas);
	}, [cambiarTodaLaSeleccion, seleccion, totalTramas])

	let intermediate = seleccion.length > 0 && seleccion.length !== totalTramas;
	let checked = seleccion.length > 0;

	let laEse = seleccion.length === 1 ? '' : 's';



	return (
		<ListItem dense className={classes.cabeceraTrama} >
			<ListItemText>
				<Box display="flex" >
					<Box  >
						<FormControlLabel
							control={<Checkbox
								checked={checked}
								onClick={cambiarSeleccion}
								indeterminate={intermediate}
								color="primary"
							/>}
							label={`${seleccion.length} seleccionada${laEse}`}
						/>

					</Box>

					<Fade in={checked}>
						<Divider orientation="vertical" flexItem />
					</Fade>

					<Box flexGrow={1} mx={2} display="flex" alignItems="center" >
						<Fade in={checked}>
							<Box display="flex" alignItems="center">
								<ButtonGroup className={classes.grupoBotonMenu} variant="outlined" color="default" aria-label="text primary button group" disableElevation>
									<Button className={classes.botonMenu} startIcon={<DeleteForever />} disableElevation onClick={onEliminarTramasSeleccionadas}>
										Eliminar de la lista
									</Button>
								</ButtonGroup>

								<Typography variant="button" className={classes.textoMenu}>
									Enviar pedido{laEse} a:
								</Typography>
								<ButtonGroup className={classes.grupoBotonMenu} variant="outlined" color="default" aria-label="text primary button group" disableElevation>

									<Button className={classes.botonMenu} startIcon={<Send />} disableElevation onClick={() => onEnviarTramasSeleccionadas('test')}>test</Button>
									<Button className={classes.botonMenu} color="secondary" startIcon={<Send />} disableElevation onClick={() => onEnviarTramasSeleccionadas('produccion')}>produccion</Button>
								</ButtonGroup>
							</Box>
						</Fade>
					</Box>



					<Divider orientation="vertical" flexItem />
					<Box  >
						<Button color="default" variant="contained" className={classes.botonReiniciar} startIcon={<RotateLeft />} onClick={onDescartarTramas} disableElevation>
							Reiniciar tramas
						</Button>
					</Box>
				</Box>
			</ListItemText >
		</ListItem >
	)
}




export default function PantallaVisorTramasFedicom2() {

	const classes = useStyles();
	const refTrama = useRef(null);
	const virtuoso = useRef(null);

	const refFileReader = useRef();
	const windowSize = useWindowSize();
	const [analizarTramas] = useWorker(workerAnalizaTramas);
	const [estadoCarga, setEstadoCarga] = useState({ cargando: false, progreso: 0, texto: '' });
	const [tramas, setTramas] = useState([]);

	const [dialogoReenvioAbierto, setDialogoReenvioAbierto] = useState(false);
	const [destinoReenvio, setDestinoReenvio] = useState(false);


	const [tramasSeleccionadas, {
		cambiarElemento: cambiarSeleccionDeTrama,
		setSeleccion: setTramasSeleccionadas
	}] = useSeleccion([]);


	const analizaTramas = useCallback(async (valorTramas) => {
		try {
			setEstadoCarga({ cargando: true, progreso: -1, texto: LABEL_ANALIZANDO_TRAMAS });
			const tramasAnalizadas = await analizarTramas(valorTramas);

			setTramas(tramasAnalizadas);
			setEstadoCarga({ cargando: false, progreso: -1, texto: '' });
		} catch (e) {
			console.error("ERROR ANALIZANDO TRAMAS")
			console.error(e);
			setEstadoCarga({ cargando: false, progreso: -1, texto: '' });
		}
	}, [analizarTramas, setTramas]);

	const cargarFichero = useCallback((event) => {

		let fichero = event.target.files[0];

		refFileReader.current = new FileReader();
		refFileReader.current.onloadstart = () => {
			setEstadoCarga({ cargando: true, progreso: 0, texto: LABEL_CARGANDO_FICHERO });
		}
		refFileReader.current.onloadend = () => {
			setTimeout(() => {
				analizaTramas(refFileReader.current.result)
			}, 1000);
		}
		refFileReader.current.onprogress = (data) => {
			if (data.lengthComputable) {
				let progress = parseInt(((data.loaded / data.total) * 100), 10);
				if (progress !== estadoCarga.progreso) {
					setEstadoCarga({ cargando: true, progreso: progress, texto: data.label || LABEL_CARGANDO_FICHERO });
				}
			}
		}

		refFileReader.current.readAsText(fichero);
		event.target.value = null;
	}, [setEstadoCarga, analizaTramas, estadoCarga.progreso])

	const cambiarTodaLaSeleccion = useCallback((valor) => {

		let nuevasTramasSeleccionadas = [];

		let tramasNuevas = tramas.map((t, i) => {
			if (valor) nuevasTramasSeleccionadas.push(i);
			return { ...t, seleccionada: valor };
		})

		setTramasSeleccionadas(nuevasTramasSeleccionadas);
		setTramas(tramasNuevas);

	}, [tramas, setTramas, setTramasSeleccionadas])

	const eliminarTramasSeleccionadas = useCallback(() => {

		// Un atajo por si están seleccionadas todas las tramas
		if (tramas.length === tramasSeleccionadas.length) {
			setTramasSeleccionadas([]);
			setTramas([]);
			return
		}

		let tramasNuevas = tramas.filter((t, i) => !tramasSeleccionadas.includes(i));
		setTramasSeleccionadas([]);
		setTramas(tramasNuevas);

	}, [tramas, tramasSeleccionadas, setTramas, setTramasSeleccionadas])

	const abrirDialogoReenvio = useCallback( (destino) => {
		setDestinoReenvio(destino);
		setDialogoReenvioAbierto(true);
	}, [setDestinoReenvio, setDialogoReenvioAbierto])

	return (<>
		<Container maxWidth={false}>
			<TituloPantalla>
				Visor de tramas Fedicom2
			</TituloPantalla>
		</Container>

		<Collapse in={tramas.length === 0} >
			<Container maxWidth={false}>
				<TextField
					id="input-trama"
					label="Tramas Fedicom2"
					placeholder="Pegue aquí las tramas Fedicom2 tal y como salen en el `srvtcp.log`.&#10;Para analizar tramas de mas de 1Mb, usa el botón de subir fichero."
					multiline
					fullWidth
					inputRef={refTrama}
					variant="outlined"
					rows={10}
					disabled={estadoCarga.cargando}
					inputProps={{ maxLength: 1024 * 1024 }}
				/>

				<Box display="flex" mt={2} flexDirection="row">
					<Box>
						<Button variant="contained" color="primary" component="span" disabled={estadoCarga.cargando} onClick={() => analizaTramas(refTrama.current.value)}>
							Analizar texto
				</Button>
					</Box>

					<Box ml={2}>
						<input accept=".log,.txt,.tmp" className={classes.input} id="contained-button-file" multiple type="file" onChange={cargarFichero} />
						<label htmlFor="contained-button-file">
							<Button variant="contained" color="default" component="span" startIcon={<CloudUpload />} disabled={estadoCarga.cargando}>
								Subir fichero
        				</Button>
						</label>
					</Box>

					{estadoCarga.cargando && (<Box ml={2}>
						<CircularProgressWithLabel value={estadoCarga.progreso} size={34} text={estadoCarga.texto} ml={2} />
					</Box>
					)}
				</Box>
			</Container>
		</Collapse>

		<Collapse in={tramas.length !== 0} >
			<Container maxWidth={false} className={classes.containerFull}>
				<CabeceraTramas
					seleccion={tramasSeleccionadas}
					classes={classes}
					onDescartarTramas={() => setTramas([])}
					cambiarTodaLaSeleccion={cambiarTodaLaSeleccion}
					totalTramas={tramas.length}
					onEliminarTramasSeleccionadas={eliminarTramasSeleccionadas}
					onEnviarTramasSeleccionadas={abrirDialogoReenvio}
				/>
				<Box >
					<Virtuoso
						ref={virtuoso}
						className={classes.virtuoso}
						style={{ height: Math.max(400, windowSize.height - 260) + 'px' }}
						data={tramas}
						itemContent={(index, item) => renderizaTrama(index, item, cambiarSeleccionDeTrama, classes)}
						overscan={20} />
				</Box>
			</Container>
		</Collapse>

		<DialogoEnvio 
			open={dialogoReenvioAbierto} 
			onClose={() => setDialogoReenvioAbierto(false)}
			destino={destinoReenvio}
			tramas={tramas}
			tramasSeleccionadas={tramasSeleccionadas}
		/>
	
	</>


	)

}