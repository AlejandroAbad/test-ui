import { AppBar, Box, Container, Dialog, IconButton, makeStyles, Paper, Slide, Tab, Tabs, Toolbar, Typography } from "@material-ui/core";
import { Close } from "@material-ui/icons";
import { forwardRef, useState } from "react";
import FormularioFiltroPedidosAvanzado from "./FormularioFiltroPedidosAvanzado";
import FormularioFiltroPedidosCrudo from "./FormularioFiltroPedidosCrudo";
import FormularioFiltroPedidosEstandard from "./FormularioFiltroPedidosEstandard";



const useStyles = makeStyles((theme) => ({
	appBar: {

	},
	title: {
		marginLeft: theme.spacing(2),
		flex: 1,
	},
	mainContainer: {
		marginTop: theme.spacing(0),
		padding: theme.spacing(1, 4, 8, 4)
	},
	boxSelector: {
		margin: theme.spacing(0, 0),
		padding: theme.spacing(2, 4)
	},
	divisor: {
		margin: theme.spacing(4, 0)
	},

}));


const Transition = forwardRef(function Transition(props, ref) {
	return <Slide direction="down" ref={ref} {...props} />;
});



function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div role="tabpanel" hidden={value !== index} {...other}		>
			{value === index && (
				<Box pt={2}>
					<Typography>{children}</Typography>
				</Box>
			)}
		</div>
	);
}

export default function DialogoFiltroPedidos({ open, onClose }) {

	const [value, setValue] = useState(0);
	const handleChange = (event, newValue) => {
		setValue(newValue);
	};



	const classes = useStyles();


	return (
		<Dialog fullScreen open={open} onClose={onClose} TransitionComponent={Transition} disableBackdropClick disableEscapeKeyDown>
			<AppBar className={classes.appBar} position="sticky">
				<Toolbar>
					<IconButton edge="start" color="inherit" onClick={onClose} aria-label="close">
						<Close />
					</IconButton>
					<Typography variant="h6" className={classes.title}>
						Filtro de pedidos
					</Typography>
				</Toolbar>
			</AppBar>


			<Paper square >
				<Tabs value={value} onChange={handleChange} variant="fullWidth">
					<Tab label="Estándard" />
					<Tab label="Avanzado" />
					<Tab label="Nivel ninja" />
				</Tabs>
			</Paper>


			<Container maxWidth="xl" className={classes.mainContainer}>
				<TabPanel value={value} index={0}><FormularioFiltroPedidosEstandard /></TabPanel>
				<TabPanel value={value} index={1}><FormularioFiltroPedidosAvanzado /></TabPanel>
				<TabPanel value={value} index={2}><FormularioFiltroPedidosCrudo /></TabPanel>
			</Container>
		</Dialog >
	);
}