import { makeStyles, Typography } from "@material-ui/core";


const useStyles = makeStyles((theme) => ({
	titulo: {
		width: '100%',
		borderBottom: 'solid 1px ' + theme.palette.grey[300],
		paddingBottom: theme.spacing(2),
		marginBottom: theme.spacing(4),
		letterSpacing: 0,
		fontSize: '1.7rem',
		fontWeight: theme.typography.fontWeightBold

	}
}));


export default function TituloPantalla({titulo}) {

	const classes = useStyles();

	return <Typography compoment="div" className={classes.titulo} >
		{titulo}
	</Typography>

}