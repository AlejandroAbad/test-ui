import { useState } from "react";
import { Box, FormControl, InputLabel, makeStyles, MenuItem, Paper, Select } from "@material-ui/core"
import { ControlTextoChip } from "global/camposFormulario/ControlTextoChip";
import ControlModoFiltro from "global/camposFormulario/ControlModoFiltro";
import { ArrowRight, RemoveCircleOutline } from "@material-ui/icons";



const useStyles = makeStyles((theme) => ({
	selectorTipo: {
		margin: theme.spacing(0,1,0,0),
		minWidth: 120,
	},
	boxSelector: {
		margin: theme.spacing(0, 0, 2),
		padding: theme.spacing(2, 4, 4)
	}
}));

const MODOS = [
	{ texto: 'Incluye', color: 'success', icono: <ArrowRight/>},
	{ texto: 'NO incluye', color: 'danger', icono: <RemoveCircleOutline/>}
]

const TIPOS = {
	crc: {regexValidacion: /^[0-9a-f]{8}$/i },
	numeroPedido: { regexValidacion: /^[0-9a-f]{24}$/i },
	numeroPedidoSap: { regexValidacion: /^[0-9]{10}$/i },
	numeroPedidoOrigen: { regexValidacion: /^.+$/ }
}

export const NumeroPedido = ({ }) => {

	const classes = useStyles();
	const [seleccionActual, setSeleccionActual] = useState([]);
	const [tipoNumeroPedido, setTipoNumeroPedido] = useState([]);
	const [modoFiltro, setModoFiltro] = useState(0);




	return <Box component={Paper} elevation={3} className={classes.boxSelector} >

		<h3>Número de pedido<ControlModoFiltro modo={modoFiltro} onChange={setModoFiltro} listaModos={MODOS} /></h3>



		<FormControl variant="outlined" className={classes.selectorTipo}>
			<InputLabel >Tipo</InputLabel>
			<Select
				value={tipoNumeroPedido}
				onChange={e => setTipoNumeroPedido(e.target.value)}
				label="Tipo"
			>
				<MenuItem value='crc'>CRC</MenuItem>
				<MenuItem value='numeroPedido'>Número de pedido Fedicom</MenuItem>
				<MenuItem value='numeroPedidoSap'>Número de pedido SAP</MenuItem>
				<MenuItem value='numeroPedidoOrigen'>Número de pedido en origen</MenuItem>
				
			</Select>
		</FormControl>



		<ControlTextoChip
			regexValidacion={TIPOS[tipoNumeroPedido].regexValidacion}
			regexParticionado={/[\s\r\n\t,-.]+/}
			valor={seleccionActual}
			onChange={setSeleccionActual}
			label="Números de pedido o CRC"
			placeholder=""
		/>
		

	</Box>


}


export default NumeroPedido;