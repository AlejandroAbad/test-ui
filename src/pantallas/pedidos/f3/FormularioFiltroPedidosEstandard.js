import { Grid } from "@material-ui/core";
import CodigoCliente from "./CodigosCliente";
import DatosPedido from "./DatosPedido";
import EstadoTransmision from "./EstadoTransmision";
import NumeroPedido from "./NumeroPedido";
import { OrigenPedido } from "./OrigenPedido";
import RangoFechas from "./RangoFechas";




export default function FormularioFiltroPedidosEstandard() {


	return <Grid container spacing={2} alignItems="flex-start">
		<Grid item xs={12} xl={6}>
			<Grid item xs={12}>
				<RangoFechas />
			</Grid>
			<Grid item xs={12}>
				<CodigoCliente />
			</Grid>
			<Grid item xs={12}>
				<NumeroPedido />
			</Grid>
			<Grid item xs={12}>
				<EstadoTransmision />
			</Grid>
		</Grid>

		<Grid item xs={12} xl={6}>
			<Grid item xs={12}>
				<OrigenPedido />
			</Grid>
			<Grid item xs={12}>
				<DatosPedido />
			</Grid>
		</Grid>



	</Grid>

}