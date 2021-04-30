import { useState } from "react";
import { Box, FormControl, Grid, InputLabel, makeStyles, MenuItem, Paper, Select } from "@material-ui/core"
import { ControlTextoChip } from "global/camposFormulario/ControlTextoChip";
import ControlModoFiltro from "global/camposFormulario/ControlModoFiltro";
import { AddCircleOutline, PauseCircleOutline, RemoveCircleOutline } from "@material-ui/icons";



const useStyles = makeStyles((theme) => ({
	boxSelector: {
		margin: theme.spacing(0, 0, 2),
		padding: theme.spacing(1, 4, 4)
	},
	boxSelectorDisabled: {
		backgroundColor: theme.palette.grey[200]
	},
	selectorTipo: {
		minWidth: '180px'
	}

}));

const MODOS = [
	{ texto: 'Incluye', color: 'success', icono: <AddCircleOutline /> },
	{ texto: 'NO incluye', color: 'danger', icono: <RemoveCircleOutline /> },
	{ texto: 'Filtro desactivado', color: 'mutted', icono: <PauseCircleOutline /> }
]

const TIPOS = {
	crc: { label: "CRC", regexValidacion: /^[0-9a-f]{8}$/i },
	numeroPedido: { label: "Pedido Fedicom", regexValidacion: /^[0-9a-f]{24}$/i },
	numeroPedidoSap: { label: "Pedido SAP", regexValidacion: /^[0-9]{10}$/i },
	numeroPedidoOrigen: { label: "Pedido Origen", regexValidacion: /^.+$/ }
}

export const NumeroPedido = () => {

	const classes = useStyles();
	const [seleccionActual, setSeleccionActual] = useState([]);
	const [tipoNumeroPedido, setTipoNumeroPedido] = useState('crc');
	const [modoFiltro, setModoFiltro] = useState(0);




	return <Box component={Paper} elevation={modoFiltro === 2 ? 1 : 3} className={`${classes.boxSelector} ${modoFiltro === 2 && classes.boxSelectorDisabled}`} >

		<h3>Número de pedido<ControlModoFiltro modo={modoFiltro} onChange={setModoFiltro} listaModos={MODOS} /></h3>

		<Grid container spacing={1}>
			<Grid item xs={12} sm={6} md={3} lg={2} xl={4}>
				<FormControl variant="outlined" fullWidth >
					<InputLabel>Tipo de código</InputLabel>
					<Select label="Tipo de código" value={tipoNumeroPedido} onChange={e => setTipoNumeroPedido(e.target.value)} >
						{
							Object.keys(TIPOS).map((k, i) => {
								return <MenuItem value={k} key={i}>{TIPOS[k].label}</MenuItem>
							})
						}
					</Select>
				</FormControl>
			</Grid>
			<Grid item xs={12} md={9} lg={10} xl={12}>
				<ControlTextoChip
					regexValidacion={TIPOS[tipoNumeroPedido].regexValidacion}
					regexParticionado={/[\s\r\n\t,-.]+/}
					valor={seleccionActual}
					onChange={setSeleccionActual}
					label={TIPOS[tipoNumeroPedido].label}
					placeholder=""
				/>
			</Grid>
		</Grid>


	</Box>


}


export default NumeroPedido;