import { Box, Button, CircularProgress, Container, ListItem, ListItemText, makeStyles, TextField, Typography } from "@material-ui/core";
import useWindowSize from "hooks/useWindowSize";
import TituloPantalla from "navegacion/TituloPantalla";
import { useCallback, useRef, useState } from "react";
import { Virtuoso } from 'react-virtuoso';

const useStyles = makeStyles((theme) => ({
	input: {
		display: 'none'
	}
}));



const renderizaTrama = (index, item) => {

	return (
		<ListItem button key={index}>
			<ListItemText primary={item} />
		</ListItem>
	);
}


export default function PantallaVisorTramasFedicom2() {

	// const classes = useStyles();
	const refTrama = useRef();
	const windowSize = useWindowSize();

	const [analizandoTramas, setCargandoFichero] = useState(false);
	const [porcentajeCarga, setPorcentajeCarga] = useState(0);
	const [tramas, setTramas] = useState([]);


	const analizaTramas = useCallback(() => {
		let arrayTramas = refTrama.current.value.split(/\n+/);
		setTramas(arrayTramas);
	}, [setTramas]);


	return (<>
		<Container fixed maxWidth="xl">
			<TituloPantalla titulo="Visor de tramas Fedicom2" />


			<TextField
				id="input-trama"
				label="Tramas Fedicom2"
				placeholder="Pegue aquí las tramas Fedicom2 tal y como salen en el `srvtcp.log`"
				multiline
				fullWidth
				inputRef={refTrama}
				variant="outlined"
				rows={10}
				disabled={analizandoTramas}
			/>

			<Box display="flex" mt={2} flexDirection="row">
				<Button variant="contained" color="primary" component="span" disabled={analizandoTramas} onClick={analizaTramas}>
					Traducir
					</Button>
				{analizandoTramas && (<Box  >
					<Box position="relative" display="inline-flex">
						<CircularProgress variant="determinate" value={Math.round(porcentajeCarga)} />
						{porcentajeCarga > 0 && (
							<Box top={0} left={0} bottom={0} right={0} position="absolute" display="flex" alignItems="center" justifyContent="center"						>
								<Typography variant="caption" component="div" color="textSecondary">
									{`${Math.round(porcentajeCarga)}%`}
								</Typography>
							</Box>
						)}
					</Box>
				</Box>
				)}
			</Box>

			<Box mt={4}>
			<Virtuoso style={{ height: (windowSize.height - 500) + 'px' }} data={tramas} itemContent={renderizaTrama} />
			</Box>

		</Container>
	</>


	)

}