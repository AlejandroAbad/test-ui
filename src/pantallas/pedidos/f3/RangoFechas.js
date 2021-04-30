import { useState } from "react";
import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Grid, InputAdornment, makeStyles, Paper, TextField } from "@material-ui/core"
import { DateRangePicker } from "materialui-daterange-picker";
import es from 'date-fns/locale/es';
import { addDays, startOfWeek, endOfWeek, addWeeks, startOfMonth, endOfMonth, addMonths, format } from 'date-fns';
import { ArrowRight, DateRange } from "@material-ui/icons";




const useStyles = makeStyles((theme) => ({
	boxSelector: {
		margin: theme.spacing(0, 0, 2),
		padding: theme.spacing(1, 4, 4)
	},
	spanBotonInicio: {
		margin: theme.spacing(0, 1, 0, 0)
	},
	spanBotonFin: {
		margin: theme.spacing(0, 0, 0, 1)
	},
	chipFechaConcreta: {
		margin: theme.spacing(0, 2, 0.1)
	}
}));


const generarRangos = () => {

	let date = new Date();


	return [
		{
			label: 'Hoy',
			startDate: date,
			endDate: date,
		},
		{
			label: 'Ayer',
			startDate: addDays(date, -1),
			endDate: addDays(date, -1),
		},
		{
			label: 'Esta semana',
			startDate: startOfWeek(date),
			endDate: endOfWeek(date),
		},
		{
			label: 'Últimos 7 días',
			startDate: addWeeks(date, -1),
			endDate: date,
		},
		{
			label: 'Semana pasada',
			startDate: startOfWeek(addWeeks(date, -1)),
			endDate: endOfWeek(addWeeks(date, -1)),
		},
		{
			label: 'Este mes',
			startDate: startOfMonth(date),
			endDate: endOfMonth(date),
		},
		{
			label: 'Últimos 30 días',
			startDate: addMonths(date, -1),
			endDate: date,
		},
		{
			label: 'Mes pasado',
			startDate: startOfMonth(addMonths(date, -1)),
			endDate: endOfMonth(addMonths(date, -1)),
		},
	];

}


export const RangoFechas = () => {


	const classes = useStyles();
	const [open, setOpen] = useState(false);
	const [dateRange, setDateRange] = useState({ label: 'Hoy', startDate: new Date(), endDate: new Date() });

	const toggle = () => setOpen(!open);

	let botonSeleccion = <Grid container spacing={4}>
		<Grid item xs={12} sm={6}>
			<TextField
				fullWidth
				onClick={toggle}
				label="Desde el"
				value={format(dateRange.startDate, 'DD MMMM YYYY', { locale: es })}
				InputProps={{
					readOnly: true,
					endAdornment: <InputAdornment position="end">
						<DateRange />
					</InputAdornment>
				}}
			/>
		</Grid>
		<Grid item xs={12} sm={6}>
			<TextField
				fullWidth
				onClick={toggle}
				label="Hasta el"
				value={format(dateRange.endDate, 'DD MMMM YYYY', { locale: es })}
				InputProps={{
					readOnly: true,
					endAdornment: <InputAdornment position="end">
						<DateRange />
					</InputAdornment>
				}}

			/>
		</Grid>

	</Grid>


	return <Box component={Paper} elevation={3} className={classes.boxSelector} >

		<h3>Filtrar entre fechas {dateRange.label && <Button
			startIcon={<DateRange />}
			
			color="primary"
			variant="contained"
			className={classes.chipFechaConcreta}
			onClick={toggle}
		>{dateRange.label}</Button>}</h3>
		{botonSeleccion}

		<Dialog
			open={open}
			onClose={() => setOpen(false)}
			fullWidth
			maxWidth="md"
			disableBackdropClick={false}
		>
			<DialogTitle id="alert-dialog-title">Selecciona intervalo</DialogTitle>
			<DialogContent>
				<DateRangePicker
					open
					toggle={() => { }}
					onChange={(range) => setDateRange(range)}
					maxDate={new Date()}
					definedRanges={generarRangos()}
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={() => setOpen(false)} color="primary" autoFocus>OK</Button>
			</DialogActions>
		</Dialog>




	</Box>


}


export default RangoFechas;