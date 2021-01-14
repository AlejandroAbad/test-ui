import { Avatar, Box, Chip, Collapse, Icon, IconButton, List, ListItem, ListItemIcon, ListItemText, ListSubheader, makeStyles, SwipeableDrawer } from "@material-ui/core";
import { AccountBoxRounded, ChevronLeft, ExpandLess, ExpandMore, } from "@material-ui/icons";
import ContextoAplicacion from "contexto";
import { useCallback, useContext, useState } from "react";
import { Link } from "react-router-dom";
import VisibilityRoundedIcon from '@material-ui/icons/VisibilityRounded';

const drawerWidth = 340;

const useStyles = makeStyles((theme) => ({
	drawer: {
		width: drawerWidth,
		flexShrink: 0,
	},
	drawerPaper: {
		width: drawerWidth,
	},
	drawerHeader: {
		display: 'flex',
		alignItems: 'center',
		padding: theme.spacing(0, 1),
		// necessary for content to be below app bar
		...theme.mixins.toolbar,
		justifyContent: 'flex-end',
		backgroundColor: theme.palette.primary.light,
		color: theme.palette.getContrastText(theme.palette.primary.light),
	},
	drawerTitulo: {
		padding: theme.spacing(1.2, 0, 8),
		backgroundColor: theme.palette.primary.light,
		color: theme.palette.getContrastText(theme.palette.primary.light)
	},
	avatar: {
		width: theme.spacing(12),
		height: theme.spacing(12),
		margin: theme.spacing(0, 'auto'),
		fontSize: '2rem',
		color: theme.palette.primary.contrastText,
		backgroundColor: theme.palette.primary.dark,
	},
	chipNombreUsuario: {
		margin: theme.spacing(1, 'auto', 0),
		backgroundColor: theme.palette.background.paper,
		color: theme.palette.getContrastText(theme.palette.background.paper),
		fontWeight: theme.typography.fontWeightBold
	}

}));


function BotonMenu({ texto, icono, link, onClick, menu, esTitulo }) {

	const [menuAbierto, setMenuAbierto] = useState(false);
	const cambiaEstadoMenu = useCallback(() => {
		if (!menu) return;
		setMenuAbierto(!menuAbierto);
	}, [menu, menuAbierto, setMenuAbierto])

	if (esTitulo) {
		return <ListSubheader disableSticky>{texto}</ListSubheader>
	}

	let propiedades = {};
	if (link && !menu) {
		propiedades.component = Link;
		propiedades.to = link;
	}

	let elementoMenu = null;
	if (menu) {
		if (onClick) {
			propiedades.onClick = () => {
				cambiaEstadoMenu();
				onClick();
			}
		}
		else {
			propiedades.onClick = cambiaEstadoMenu;
		}

		elementoMenu = <Collapse in={menuAbierto} timeout="auto" unmountOnExit>
			<Box paddingLeft={3}>
				{menu.map((m, i) => <BotonMenu key={i} {...m} />)}
			</Box>
		</Collapse>

	} else {
		if (onClick)
			propiedades.onClick = onClick;
	}

	return (
		<Box >
			<ListItem button {...propiedades} >
				<ListItemIcon key={`drawer-boton-${texto}`} style={{ minWidth: 0, paddingRight: '0.7em' }}>
					<Icon component={icono} fontSize="small" />
				</ListItemIcon>
				<ListItemText primary={texto} />
				{menu && (menuAbierto ? <ExpandLess /> : <ExpandMore />)}
			</ListItem>
			{ elementoMenu}
		</Box>
	)
}


const BOTONES = [


	{ texto: "Dashboard", icono: AccountBoxRounded, link: '/' },


	{ texto: "Pedidos", esTitulo: true },
	{
		texto: "Búsqueda", icono: AccountBoxRounded, menu: [
			{ texto: "Proyman / Fedicom 2", icono: AccountBoxRounded, link: '/' },
			{ texto: "Fedicom 3", icono: AccountBoxRounded, link: '/' },
		]
	},
	{
		texto: "Informes", icono: AccountBoxRounded, menu: [
			{ texto: "Pedidos por almacén", icono: AccountBoxRounded, link: '/' },
			{ texto: "Pedidos por servidor SAP", icono: AccountBoxRounded, link: '/' },
		]
	},


	{ texto: "Fedicom3", esTitulo: true },
	{ texto: "Base de datos", icono: AccountBoxRounded, link: '/' },
	{ texto: "Procesos", icono: AccountBoxRounded, link: '/' },
	{
		texto: "Balanceo de carga", icono: AccountBoxRounded, menu: [
			{ texto: "Entrada pedidos", icono: AccountBoxRounded, link: '/' },
			{ texto: "Servidores SAP", icono: AccountBoxRounded, link: '/' },
		]
	},


	{ texto: "Herramientas", esTitulo: true },

	{
		texto: "Simuladores", icono: AccountBoxRounded, menu: [
			{ texto: "Pedidos", icono: AccountBoxRounded, link: '/' },
			{ texto: "Devoluciones", icono: AccountBoxRounded, link: '/' },
			{ texto: "Logística", icono: AccountBoxRounded, link: '/' },
			{ texto: "Consultas", icono: AccountBoxRounded, link: '/' },
			{ texto: "Test de stress", icono: AccountBoxRounded, link: '/' },
		]
	},
	{ texto: "Visor de tramas Fedicom2", icono: AccountBoxRounded, link: '/' },


]


export default function DrawerLateral({ open, onClose, onOpen }) {

	const { usuario } = useContext(ContextoAplicacion);
	const classes = useStyles();

	if (!usuario) return null;

	return <SwipeableDrawer
		className={classes.drawer}
		anchor="left"
		open={open}
		onClose={onClose}
		onOpen={onOpen}
		classes={{ paper: classes.drawerPaper, }} >
		<div className={classes.drawerHeader}>
			<IconButton onClick={onClose}>
				<ChevronLeft />
			</IconButton>
		</div>

		<div className={classes.drawerTitulo}>
			<Box display="flex" justifyContent="center" width="100%">
				{usuario.anonimo ?
					<Avatar className={classes.avatar} color="primary"><VisibilityRoundedIcon fontSize="large" /></Avatar>
					:
					<Avatar className={classes.avatar} color="primary">
						{usuario.sub.substring(0, 1)}
					</Avatar>
				}
			</Box>
			<Box display="flex" justifyContent="center">
				<Chip label={usuario.sub} className={classes.chipNombreUsuario} />
			</Box>
		</div>

		<List>
			{
				BOTONES.map((boton, i) => <BotonMenu key={i} {...boton} />)
			}
		</List>

	</SwipeableDrawer>

}