import { Grid, TextField } from "@material-ui/core";
import CodigoCliente from "./CodigosCliente";
import RangoFechas from "./RangoFechas";




export default function FormularioFiltroPedidosCrudo() {

	return <Grid container spacing={2} alignItems="flex-start">
		<Grid item xs={12} xl={6}>
			
			<TextField
				id="outlined-multiline-static"
				label="Multiline"
				multiline
				rows={4}
				defaultValue="{type: 10}"
				variant="outlined"
			/>
			
		</Grid>


	</Grid>

}