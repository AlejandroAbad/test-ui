import { Avatar, Backdrop, Card, CardContent, Chip, CircularProgress, Container, makeStyles, Typography } from "@material-ui/core";
import ContextoAplicacion from "contexto";
import { useContext } from "react";


const useStyles = makeStyles((theme) => ({
	carta: {
		marginBottom: theme.spacing(2),
	},
	permisos: {
		marginTop: theme.spacing(2),
	},
	permiso: {
		margin: theme.spacing(1, 1, 0, 0),
	}
}));


export default function PantallaUsuario() {

	const classes = useStyles();
	const { usuario } = useContext(ContextoAplicacion);

	if (!usuario) {
		return (
			<Backdrop open >
				<CircularProgress color="inherit" />
			</Backdrop>
		)
	}

	return (
		<Container fixed maxWidth="xl">

			<Card className={classes.carta}>
				<CardContent>
					<Typography className={classes.title} color="textSecondary" gutterBottom>
						Datos de usuario:
        			</Typography>
					<Typography variant="h5" component="h2">
						{usuario.sub}
					</Typography>
					<Typography className={classes.pos} color="textSecondary">
						{usuario.aud}
					</Typography>

					{usuario.anonimo && (
						<Typography variant="body2" component="p">
							Este usuario solo permite consultar datos del estado del servicio.
						</Typography>
					)}

					{(usuario.perms && usuario.perms.length > 0) &&
						<Typography variant="body2" component="p" className={classes.permisos}>
							Permisos del usuario: <br /> {
								usuario.perms.map((p, i) =>
									<Chip 
										key={i} 
										className={classes.permiso} 
										size="small" 
										label={p.substring(5)}
										variant="outlined"
										color="primary"
										avatar={<Avatar>{p.substring(5,6)}</Avatar>}
									/>
								)
							}
						</Typography>
					}


				</CardContent>
			</Card>


		</Container>
	)


}