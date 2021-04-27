import { Avatar, Backdrop, Box, Card, CardContent, Chip, CircularProgress, Container, makeStyles, Typography } from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import FediCommons from "common/FediCommons";
import ContextoAplicacion from "contexto";
import moment from "moment";
import TituloPantalla from "navegacion/TituloPantalla";
import { useContext } from "react";
import ReactJson from "react-json-view";



const useStyles = makeStyles((theme) => ({
	carta: {
		marginBottom: theme.spacing(2),
	},
	permisos: {
		marginTop: theme.spacing(2),
	},
	permiso: {
		margin: theme.spacing(1, 1, 0, 0),
	},
	token: {
		fontFamily: 'Consolas, monospace',
		//fontSize: '0.7rem',
		overflowWrap: "anywhere",
		backgroundColor: theme.palette.grey[200],
		borderRadius: 4,
		padding: theme.spacing(2, 4),
		margin: theme.spacing(2, 0)
	},
	titulo: {
		fontSize: 12,
	},
	valorFecha: {
		paddingLeft: theme.spacing(2)
	},
	valorFechaConMargenInferior: {
		paddingLeft: theme.spacing(2),
		marginBottom: theme.spacing(2)
	}
}));




function CartaDatosUsuario() {

	const classes = useStyles();
	const { getUsuario } = useContext(ContextoAplicacion);

	const usuario = getUsuario();

	if (!usuario) {
		return (
			<Backdrop open >
				<CircularProgress color="inherit" />
			</Backdrop>
		)
	}

	if (usuario.anonimo) {
		return (
		
		<Card className={classes.carta}>
			<CardContent>
				<Typography className={classes.titulo} color="textSecondary" gutterBottom>
					Datos del usuario
        		</Typography>

				<Alert severity="warning">
					<AlertTitle>Sesión de monitorización</AlertTitle>
					Esta sesión se abrió solo para la monitorización de ciertos valores del sistema. 
					Como tal, esta sesión nunca caduca, lo que permite mantener la pantalla activa indeterminadamente para monitorizar el estado del sistema.
				</Alert>
			</CardContent>
		</Card>)
	}

	return (
		<Card className={classes.carta}>
			<CardContent>
				<Typography variant="overline" className={classes.titulo} color="textSecondary" gutterBottom>
					Datos del usuario
        			</Typography>
				<Typography variant="h5" component="h2">
					{usuario.sub}
				</Typography>
				<Typography className={classes.pos} color="textSecondary">
					{usuario.aud}
				</Typography>

				{(usuario.perms && usuario.perms.length > 0) &&
					<Typography variant="body2" component="span" className={classes.permisos}>
						Permisos del usuario: <br /> {
							usuario.perms.map((p, i) =>
								<Chip
									key={i}
									className={classes.permiso}
									size="small"
									label={p.substring(5)}
									variant="outlined"
									color="primary"
									avatar={<Avatar>{p.substring(5, 6)}</Avatar>}
								/>
							)
						}
					</Typography>
				}


			</CardContent>
		</Card>
	)


}


function CartaDatosTokenFedicom3() {

	const classes = useStyles();
	const { getJwt, getUsuario, tiempoRestanteToken } = useContext(ContextoAplicacion);

	const usuario = getUsuario();
	const jwt = getJwt();

	if (!usuario) {
		return (
			<Backdrop open >
				<CircularProgress color="inherit" />
			</Backdrop>
		)
	}

	if (usuario.anonimo) {
		return null;
	}


	let fechaEmision = moment(usuario.iat * 1000)
	let fechaCaducidad = moment(usuario.exp * 1000)
	let tiempoRestante = FediCommons.tiempoParaExpiracionToken(tiempoRestanteToken);


	return (
		<Card className={classes.carta}>
			<CardContent>
				<Typography variant="overline" className={classes.titulo} color="textSecondary" >
					Datos del token
        		</Typography>

				<Box className={classes.token}>
					<code>{jwt}</code>
				</Box>


				<Typography color="textSecondary"  >
					Fecha de emisión:
        		</Typography>

				<Typography variant="subtitle1" gutterBottom className={classes.valorFechaConMargenInferior} >
					{fechaEmision.format('LLLL')}
				</Typography>

				<Typography color="textSecondary" >
					Válido hasta:
        		</Typography>

				<Typography variant="subtitle1" className={classes.valorFecha}  >
					{fechaCaducidad.format('LLLL')}
				</Typography>

				<Typography variant="caption" className={classes.valorFechaConMargenInferior} display="block" >
					{tiempoRestanteToken !== Infinity ? <>La sesión {tiempoRestante}.</> : <><CircularProgress size={13} /> Calculando ...</>}
				</Typography>


				<Typography color="textSecondary">
					Contenido del token:
        		</Typography>

				<Box className={classes.token}>
					<ReactJson src={usuario} displayDataTypes={false} collapsed={true} title="jwt" />
				</Box>





			</CardContent>
		</Card>
	)
}


export default function PantallaUsuario() {


	return (
		<Container fixed maxWidth="xl">
			<TituloPantalla titulo="Datos de la sesión" />

			<CartaDatosUsuario />
			<CartaDatosTokenFedicom3 />
		</Container>
	)


}