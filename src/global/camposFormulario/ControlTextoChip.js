import { useCallback } from "react";
import { Chip, makeStyles, TextField } from "@material-ui/core"
import { Autocomplete } from "@material-ui/lab";


const useStyles = makeStyles((theme) => ({
	contenedor: {
		margin: theme.spacing(0, 0),
		padding: theme.spacing(0, 0)
	}
}));



export const ControlTextoChip = ({ valor, onChange, regexValidacion, regexParticionado, caracteresDeEscape, label, placeholder, opciones=[], ...props }) => {

	const classes = useStyles();
	if (!caracteresDeEscape) caracteresDeEscape = [' ', 'Enter', 'Tab']
	if (!regexParticionado) regexParticionado = /[\s\r\n\t,-.]+/

	const handleKeyDown = useCallback(event => {

		if (caracteresDeEscape.includes(event.key)) {
			event.preventDefault();
			event.stopPropagation();
			let valorInput = event.target?.value?.trim() || '';
			if (valorInput.length > 0) {
				let valoresNuevos = valorInput.split(regexParticionado).map(valor => valor);
				onChange([...valor, ...valoresNuevos]);
			}
		}
	}, [valor, onChange, regexParticionado, caracteresDeEscape]);

	const handleBlur = useCallback(event => {

		let valorInput = event.target?.value?.trim() || '';
		if (valorInput.length > 0) {
			let valoresNuevos = valorInput.split(regexParticionado).map(valor => valor);
			onChange([...valor, ...valoresNuevos]);
		}

	}, [valor, onChange, regexParticionado]);




	return <Autocomplete
		
		filterSelectedOptions
		multiple
		freeSolo
		defaultValue={[]}
		value={valor}
		options={opciones}
		onChange={(event, newValue) => {
			onChange(newValue);
		}}
		renderTags={(value, getTagProps) => {
			return value.map((option, index) => {
				let ok = regexValidacion ? regexValidacion.test(option) : true;
				return <Chip
					color={ok ? 'primary' : 'secondary'}
					label={option}
					size="small"
					variant="outlined"
					{...getTagProps({ index })}
				/>
			})
		}}
		renderInput={(params) => {
			params.inputProps.onKeyDown = handleKeyDown;
			params.inputProps.onBlur = handleBlur;
			return (
				<TextField
					{...params}
					variant="outlined"
					label={label}
					placeholder={placeholder}
					fullWidth
				/>
			);
		}}
		{...props}
	/>


}


export default ControlTextoChip;