import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import ContextoAplicacion from 'contexto';
import { Divider, ListItemIcon } from '@material-ui/core';


import AccountBoxRoundedIcon from '@material-ui/icons/AccountBoxRounded';
import InfoRoundedIcon from '@material-ui/icons/InfoRounded';
import ExitToAppRoundedIcon from '@material-ui/icons/ExitToAppRounded';

const useStyles = makeStyles((theme) => ({
	menuButton: {
		marginRight: theme.spacing(2),
	},
	title: {
		flexGrow: 1,
	},
	appBar: {
		transition: theme.transitions.create(['margin', 'width'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
	}
}));

export default function MenuSuperior({ onMenuClicked, ...props }) {

	const classes = useStyles();
	const { jwt, setJwt } = useContext(ContextoAplicacion);


	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);


	const abrirMenuUsuario = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const cerrarMenuUsuario = () => {
		setAnchorEl(null);
	};


	async function ejecutarLogout() {
		cerrarMenuUsuario();
		setJwt(null, null);
	}

	return (
		<AppBar position="fixed" className={classes.appBar} {...props}  >
			<Toolbar>
				{jwt && (
					<IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={onMenuClicked}>
						<MenuIcon />
					</IconButton>
				)}


				<Typography variant="h6" className={classes.title}>
					Big Brother <small>is watching you</small>
				</Typography>



				{jwt && (
					<div>
						<IconButton
							aria-label="cuenta del usuario"
							aria-controls="menu-appbar"
							aria-haspopup="true"
							onClick={abrirMenuUsuario}
							color="inherit"
						>
							<AccountCircle />
						</IconButton>


						<Menu
							id="menu-appbar"
							anchorEl={anchorEl}
							anchorOrigin={{
								vertical: 'top',
								horizontal: 'right',
							}}
							keepMounted
							transformOrigin={{
								vertical: 'top',
								horizontal: 'right',
							}}
							open={open}
							onClose={cerrarMenuUsuario}
						>

							<MenuItem component={Link} to='/usuario' onClick={cerrarMenuUsuario} >
								<ListItemIcon>
									<AccountBoxRoundedIcon fontSize="small" />
								</ListItemIcon>
								Información de usuario
							</MenuItem>
							<MenuItem onClick={cerrarMenuUsuario} >
								<ListItemIcon>
									<InfoRoundedIcon fontSize="small" />
								</ListItemIcon>
								Acerca de ...</MenuItem>
							<Divider />
							<MenuItem onClick={ejecutarLogout}>
								<ListItemIcon>
									<ExitToAppRoundedIcon fontSize="small" />
								</ListItemIcon>
								Cerrar sesión
							</MenuItem>
						</Menu>
					</div>
				)}
			</Toolbar>
		</AppBar>
	);
}
