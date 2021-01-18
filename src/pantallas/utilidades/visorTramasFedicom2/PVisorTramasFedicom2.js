import { Box, Button, Checkbox, Collapse, Container, FormControlLabel, ListItem, ListItemText, makeStyles, TextField } from "@material-ui/core";
import useWindowSize from "hooks/useWindowSize";
import TituloPantalla from "navegacion/TituloPantalla";
import { useCallback, useRef, useState } from "react";
import { Virtuoso } from 'react-virtuoso';
import { useWorker } from "@koale/useworker";
import { CloudUpload, Delete } from "@material-ui/icons";
import CircularProgressWithLabel from "common/CircularProgressWithLabel";
import workerAnalizaTramas from "workers/workerAnalisisTramasFedicom2";
import CajaTramaFedicom2 from "./CajaTramaFedicom2";
import useArray from "hooks/useArray";


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
		borderBottom: '1px solid rgb(0,0,0,0.1)',
		paddingBottom: '1.5em',
		paddingLeft: '3.3em'
	},
	botonReiniciar: {
		marginLeft: theme.spacing(4)
	}
}));

const renderizaTrama = (index, trama, onSeleccionCambia) => {

	return (
		<CajaTramaFedicom2 trama={trama} indice={index} onSeleccionCambia={onSeleccionCambia} />
	);
}

export default function PantallaVisorTramasFedicom2() {

	const classes = useStyles();
	const refTrama = useRef(null);
	const refFileReader = useRef();

	const windowSize = useWindowSize();
	const [analizarTramas] = useWorker(workerAnalizaTramas);

	const [estadoCarga, setEstadoCarga] = useState({ cargando: false, progreso: 0, texto: '' });

	const [tramas, setTramas] = useState([]);
	const [tramasSeleccionadas, {push: pushElementoSeleccionado, remove: eliminaElementoSeleccionado}] = useArray([]);

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



	const onSeleccionCambia = useCallback((indice, seleccionado) => {
		
		if (seleccionado === true)
			pushElementoSeleccionado(indice);
		else {
			eliminaElementoSeleccionado(indice);
		}

	}, [pushElementoSeleccionado, eliminaElementoSeleccionado])

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
				<ListItem dense className={classes.cabeceraTabla} >
					<ListItemText>
						<Box display="flex">
							<Box pr={2} mr={2} style={{ borderRight: '1px solid rgb(0,0,0,0.1)' }}>
								<FormControlLabel
									control={<Checkbox indeterminate color="primary" />}
									label="Seleccionar todos"
								/>

							</Box>
							<Box flexGrow={1} >
								{JSON.stringify(tramasSeleccionadas)}
								<Button color="secondary" variant="contained" className={classes.botonReiniciar} startIcon={<Delete />} onClick={() => setTramas([])}>
									Reiniciar
								</Button>
							</Box>
							<Box pl={2} ml={2} style={{ borderLeft: '1px solid rgb(0,0,0,0.1)' }} >
								<Button color="secondary" variant="contained" className={classes.botonReiniciar} startIcon={<Delete />} onClick={() => setTramas([])}>
									Reiniciar
								</Button>
							</Box>
						</Box>
					</ListItemText>
				</ListItem>
				<Box mt={4}>
					<Virtuoso
						style={{ height: Math.max(400, windowSize.height - 300) + 'px' }}
						data={tramas}
						itemContent={(index, item) => renderizaTrama(index, item, onSeleccionCambia)}
						overscan={{ main: 20, reverse: 20 }} />
				</Box>
			</Container>
		</Collapse>
	</>


	)

}