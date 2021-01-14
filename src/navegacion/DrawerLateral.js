import { Avatar, Box, Chip, Collapse, Icon, IconButton, List, ListItem, ListItemIcon, ListItemText, ListSubheader, makeStyles, SwipeableDrawer } from "@material-ui/core";
import { Assessment, Business, CallSplit, Input, ChevronLeft, Dashboard, ExpandLess, ExpandMore, Filter2, Looks3, MoveToInbox, NearMe, Speed, Storage, Security, Translate, FindInPage } from "@material-ui/icons";
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


function BotonMenu({ texto, icono, link, onClick, subMenu, esTitulo, cerrarDrawer }) {

	const [menuAbierto, setMenuAbierto] = useState(false);
	const cambiaEstadoMenu = useCallback(() => {
		if (!subMenu) return;
		setMenuAbierto(!menuAbierto);
	}, [subMenu, menuAbierto, setMenuAbierto])

	if (esTitulo) {
		return <ListSubheader disableSticky>{texto}</ListSubheader>
	}

	let propiedades = {};
	if (link && !subMenu) {
		propiedades.component = Link;
		propiedades.to = link;
	}

	let elementoMenu = null;
	if (subMenu) {
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
				{subMenu.map((m, i) => <BotonMenu key={i} cerrarDrawer={cerrarDrawer} {...m} />)}
			</Box>
		</Collapse>

	} else {
		if (onClick) {
			propiedades.onClick = () => {
				onClick()
				cerrarDrawer();
			}
		} else {
			propiedades.onClick = () => {
				cerrarDrawer();
			}
		}
		
	}

	return (
		<Box >
			<ListItem button {...propiedades} >
				<ListItemIcon key={`drawer-boton-${texto}`} style={{ minWidth: 0, paddingRight: '0.7em' }}>
					<Icon component={icono} fontSize="small" />
				</ListItemIcon>
				<ListItemText primary={texto} />
				{subMenu && (menuAbierto ? <ExpandLess /> : <ExpandMore />)}
			</ListItem>
			{ elementoMenu}
		</Box>
	)
}


const BOTONES = [


	{ texto: "Dashboard", icono: Dashboard, link: '/' },


	{ texto: "Pedidos", esTitulo: true },
	{
		texto: "Transmisiones", icono: MoveToInbox, subMenu: [
			{ texto: "Proyman / Fedicom 2", icono: Filter2, link: '/' },
			{ texto: "Fedicom 3", icono: Looks3, link: '/' },
		]
	},
	{
		texto: "Informes", icono: Assessment, subMenu: [
			{ texto: "Pedidos por almacén", icono: Business, link: '/' },
			{ texto: "Pedidos por servidor SAP", icono: Storage, link: '/' },
		]
	},


	{ texto: "Fedicom3", esTitulo: true },
	{ texto: "Base de datos", icono: Storage, link: '/' },
	{ texto: "Procesos", icono: Speed, link: '/' },
	{
		texto: "Balanceo de carga", icono: CallSplit, subMenu: [
			{ texto: "Entrada pedidos", icono: Input, link: '/' },
			{ texto: "Servidores SAP", icono: Storage, link: '/' },
		]
	},


	{ texto: "Herramientas", esTitulo: true },

	{
		texto: "Simuladores Fedicom3", icono: NearMe, subMenu: [
			{ texto: "Pedidos", icono: NearMe, link: '/' },
			{ texto: "Devoluciones", icono: NearMe, link: '/' },
			{ texto: "Logística", icono: NearMe, link: '/' },
			{ texto: "Consultas", icono: FindInPage, link: '/' },
			{ texto: "Test de stress", icono: Security, link: '/' },
		]
	},
	{ texto: "Visor de tramas Fedicom2", icono: Translate, link: '/utilidades/visorTramasFedicom2' },


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
		classes={{ paper: classes.drawerPaper, }} 

	>
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
					<Avatar className={classes.avatar} color="primary">{usuario.sub.substring(0, 1)}</Avatar>
				}
			</Box>
			<Box display="flex" justifyContent="center">
				<Chip label={usuario.sub} className={classes.chipNombreUsuario} />
			</Box>
		</div>

		<List >
			{
				BOTONES.map((boton, i) => <BotonMenu key={i} cerrarDrawer={onClose} {...boton}  />)
			}
		</List>

	</SwipeableDrawer>

}