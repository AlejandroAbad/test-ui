import { Accordion, AccordionDetails, AccordionSummary, Box, Checkbox, Grid, ListItem, ListItemText, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@material-ui/core";
import { ExpandMore } from "@material-ui/icons";
import { useCallback, useEffect, useState } from "react";

const DESCRIPION_INCIDENCIAS = {
	"01": "No hay Existencias",
	"02": "No sirven",
	"03": "No trabajado",
	"04": "Desconocido",
	"05": "Estupefaciente",
	"06": "Por encargo",
	"07": "Próximo a dar de baja",
	"08": "Pasado a otro almacén",
	"09": "Nueva especialidad",
	"10": "Baja temporal",
	"11": "Baja",
	"12": "Cursado encargo",
	"13": "Suministro limitado",
	"14": "Retirado por sanidad",
	"15": "Estupefaciente sin vale",
	"16": "No es estupefaciente",
	"17": "Estupefacinete en línea incorrecta (no 1040)",
	"18": "Lote incorrecto",
	"19": "Fecha de caducidad incorrecta",
	"20": "El abono solicitado no corresponde con el albarán",
	"21": "Entrega total demorada",
	"22": "Entrega parcial demorada"
}
/*
const MOTIVO_ABONO = {
	"01": "Caducidad del producto",
	"02": "Retirado por alerta farmaceutica",
	"03": "Falta genero",
	"04": "Mal estado",
	"05": "Mal servido",
	"06": "No interesa",
	"07": "Mal anotado",
	"08": "Error de precio",
	"09": "Defecto de calidad",
	"10": "Otros"
}
*/


function Caja({ titulo, children, ...props }) {
	return <Grid item {...props}>
		<Typography variant="overline" component="span" style={{ paddingRight: '1em' }}>
			{titulo}
		</Typography>
		<Typography variant="body1" component="span"  >
			<b>{children}</b>
		</Typography>
	</Grid>
}



function getCantidades(linea) {

	let pedido = linea.cantidad;
	let faltas = '';

	if (linea.cantidadFalta)
		faltas = linea.cantidadFalta;

	if (linea.bonificacion) {
		pedido += '+' + linea.bonificacion;

		if (linea.cantidadFalta || linea.bonificacionFalta) {
			faltas = (linea.cantidadFalta || 0) + '+' + (linea.bonificacion || 0);
		}
	}

	if (faltas)
		return <>{pedido}, en falta {faltas}</>
	else
		return <>{pedido}</>



}


export default function CajaTramaFedicom2({ trama, indice, onSeleccionCambia, classes }) {

	useEffect(() => {
		setSeleccionada(trama.seleccionada ?? false)
	}, [trama]);

	let fecha = <>{trama.fecha.substring(6, 8)}/{ trama.fecha.substring(4, 6)}/{ trama.fecha.substring(0, 4)}&nbsp;{ trama.hora.substring(0, 2)}:{ trama.hora.substring(2, 4)}:{ trama.hora.substring(4, 6)} </>

	const [seleccionada, setSeleccionada] = useState(trama.seleccionada || false);
	const [expandido, setExpandido] = useState(trama.expandido || false);


	const invertirSeleccion = useCallback(() => {
		trama.seleccionada = !trama.seleccionada;
		setSeleccionada(trama.seleccionada);
		onSeleccionCambia(indice, trama.seleccionada);
	}, [trama, indice, onSeleccionCambia, setSeleccionada]);

	const invertirExpansion = useCallback(() => {
		trama.expandido = !trama.expandido;
		setExpandido(trama.expandido);
	}, [trama, setExpandido]);


	return <ListItem dense key={indice} className={seleccionada ? classes.contenedorTramaSeleccionada : classes.contenedorTrama} component={Paper} elevation={0} variant="outlined" square >
		<ListItemText >
			<Box display="flex">
				<Box pr={2}>
					<Checkbox color="primary"
						checked={seleccionada}
						onChange={invertirSeleccion}
					/>
				</Box>
				<Box flexGrow={1}>
					<Grid container spacing={0}>
						<Caja titulo="CRC" xs={4}>
							{trama.crc}
						</Caja>
						<Caja titulo="Cliente" xs={4}>
							{trama.codCli}
						</Caja>
						<Caja titulo="Fecha" xs={4}>
							{fecha}
						</Caja>
						<Caja titulo="Tipo de pedido" xs={4}>
							{trama.tipoPed || '-'}
						</Caja>
						<Caja titulo="Usuario" xs={4}>
							{trama.usuario}
						</Caja>
						<Caja titulo="Número pedido cliente" xs={4}>
							{trama.numPedCli}
						</Caja>
						<Grid item xs={12}>

							<Accordion 
								TransitionProps={{ unmountOnExit: true }} 
								square 
								elevation={1} 
								variant="outlined" 
								expanded={expandido} 
								onChange={invertirExpansion}
								className={seleccionada ? classes.acordeonTramaSeleccionada : ''}
							>
								<AccordionSummary expandIcon={<ExpandMore />} 							>
									<Caja titulo="Posiciones" xs={4}>
										{trama.lineas?.length || 'Sin'} línea{trama.lineas?.length !== 1 && 's'}
									</Caja>
								</AccordionSummary>
								<AccordionDetails>
									<TableContainer >
										<Table size="small" aria-label="a dense table">
											<TableHead>
												<TableRow>
													<TableCell component="th"><b>Artículo</b></TableCell>
													<TableCell component="th"><b>Cantidades</b></TableCell>
													<TableCell component="th"><b>Incidencia</b></TableCell>
													<TableCell component="th"><b>Estupefaciente</b></TableCell>
													<TableCell component="th"><b>Sustituyente</b></TableCell>
												</TableRow>
											</TableHead>
											<TableBody>
												{trama.lineas?.length && trama.lineas.map((row, i) => (
													<TableRow key={i}>
														<TableCell component="th" scope="row">{row.codArti}</TableCell>
														<TableCell>{getCantidades(row)}</TableCell>
														<TableCell>{row.codigoIncidencia} - {DESCRIPION_INCIDENCIAS[row.codigoIncidencia]}</TableCell>
														<TableCell>{row.valeEstupefaciente}</TableCell>
														<TableCell>{row.articuloSustituyente}</TableCell>
													</TableRow>
												))}
											</TableBody>
										</Table>
									</TableContainer>
								</AccordionDetails>
							</Accordion>




						</Grid>
					</Grid>
				</Box>

			</Box>


		</ListItemText>
	</ListItem>;


}