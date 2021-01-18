import React, { useContext, useRef, useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Box, Collapse, IconButton } from '@material-ui/core';

import ContextoAplicacion from 'contexto';
import BarraProgresoSuperior from '../navegacion/BarraProgresoSuperior';
import { useApiCall } from 'hooks/useApiCall';
import FediCommons from 'common/FediCommons';
import { Alert, AlertTitle } from '@material-ui/lab';
import CloseIcon from '@material-ui/icons/Close';
import K from 'K';


const useStyles = makeStyles((theme) => ({
	paper: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main,
	},
	avatarAnonimo: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.grey.main,
	},

	cajaSuperior: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		[theme.breakpoints.up('md')]: {
			marginTop: theme.spacing(4)
		}
	},
	cajaInferior: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		marginTop: theme.spacing(2),
		paddingTop: theme.spacing(1),
		borderTopStyle: 'dashed',
		borderTop: 2,
		borderTopColor: theme.palette.grey[300],
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
	mensajeError: {
		width: '100%'
	}
}));


const LoginTextField = function ({ ...props }) {
	return <TextField
		variant="outlined"
		margin="normal"
		required
		fullWidth
		autoFocus
		{...props} />
}



export default function PantallaLogin() {

	const classes = useStyles();
	const { setJwt } = useContext(ContextoAplicacion);
	const refUsuario = useRef();
	const refPasword = useRef();
	const { resultado, post: solicitarToken } = useApiCall('https://fedicom3-dev.hefame.es')
	const [mostarError, setMostrarError] = useState(false);


	async function solicitarAutenticacion() {

		let authBody = {
			user: refUsuario.current?.value,
			password: refPasword.current?.value,
			domain: "HEFAME",
			debug: true
		}

		setMostrarError(false);
		solicitarToken('/authenticate', authBody, (error, datos) => {
			if (error) {
				setMostrarError(true);
			}
			else {
				setJwt(datos.auth_token, datos.data);
			}
		});

	}


	async function inyectarTokenMonitorización() {
		setMostrarError(false);
		setJwt(K.USUARIO_ANONIMO.TOKEN, K.USUARIO_ANONIMO.DATOS);
	}

	let alertaError = <Collapse in={mostarError} className={classes.mensajeError}>
		<Alert severity="error" className={classes.mensajeError}
			action={<IconButton aria-label="close" color="inherit" size="small" onClick={() => { setMostrarError(false); }}>
				<CloseIcon fontSize="inherit" />
			</IconButton>
			}
		>
			<AlertTitle>Error</AlertTitle>
			{FediCommons.convertirErrorLlamadaFedicom(resultado.error)}
		</Alert>
	</Collapse>


	return (
		<Container component="main" maxWidth="xs">
			<BarraProgresoSuperior cargando={resultado.cargando} />
			<CssBaseline />
			<Box className={classes.cajaSuperior}>
				<Avatar className={classes.avatar}>
					<LockOutlinedIcon />
				</Avatar>
				<Typography component="h1" variant="h5">
					Identifíquese
        		</Typography>



				<LoginTextField id="usuario" label="Usuario" name="usuario" autoComplete="user" inputRef={refUsuario} disabled={resultado.cargando} />
				<LoginTextField name="password" label="Contraseña" type="password" id="password" autoComplete="current-password" inputRef={refPasword} disabled={resultado.cargando} />

				{alertaError}

				<Button
					type="submit"
					fullWidth
					variant="contained"
					color="primary"
					className={classes.submit}
					onClick={solicitarAutenticacion}
					disabled={resultado.cargando}
				>
					Acceder
        		</Button>
			</Box>

			<Box className={classes.cajaInferior} >

				<Button
					type="submit"
					fullWidth
					variant="outlined"
					className={classes.submit}
					onClick={inyectarTokenMonitorización}
					disabled={resultado.cargando}
				>
					Acceso de monitorización
        			</Button>


			</Box>
		</Container>
	);
}