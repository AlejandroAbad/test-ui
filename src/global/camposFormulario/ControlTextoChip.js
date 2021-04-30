import { useCallback, useState } from "react";
import { Chip, TextField, withStyles } from "@material-ui/core"
import { Autocomplete } from "@material-ui/lab";
import { red } from "@material-ui/core/colors";





const ColorChip = withStyles((theme) => ({
	/*
	colorPrimary: {
		color: green[500],
		borderColor: green[500],
	},
	deleteIconOutlinedColorPrimary: {
		color: green[500],
	},*/
	colorSecondary: {
		color: red[500],
		borderColor: red[500],
	},
	deleteIconOutlinedColorSecondary: {
		color: red[400],
		'&:hover': {
			color: red[700],
		}
	}

}))(Chip);



export const ControlTextoChip = ({
	valor,
	onChange,
	regexValidacion,
	regexParticionado,
	caracteresDeEscape,
	label,
	placeholder,
	helperText,
	opciones = [],
	opcionesFijas = false,
	...props }) => {

	if (!caracteresDeEscape) caracteresDeEscape = [' ', 'Enter', 'Tab']
	if (!regexParticionado) regexParticionado = /[\s\r\n\t]+/

	let [open, setOpen] = useState(false);

	const handleKeyDown = useCallback(event => {

		if (!opcionesFijas && caracteresDeEscape.includes(event.key)) {
			event.preventDefault();
			event.stopPropagation();
			let valorInput = event.target?.value?.trim() || '';
			if (valorInput.length > 0) {
				let valoresNuevos = valorInput.split(regexParticionado).map(valor => valor);
				onChange([...valor, ...valoresNuevos]);
			}
		}
	}, [valor, onChange, regexParticionado, caracteresDeEscape, opcionesFijas]);

	const handleBlur = useCallback(event => {

		if (!opcionesFijas) {
			let valorInput = event.target?.value?.trim() || '';
			if (valorInput.length > 0) {
				let valoresNuevos = valorInput.split(regexParticionado).map(valor => valor);
				onChange([...valor, ...valoresNuevos]);
			}
		}
		setOpen(false)

	}, [valor, onChange, regexParticionado, setOpen, opcionesFijas]);




	return <Autocomplete
		open={open}
		onOpen={() => setOpen(true)}
		onClose={() => setOpen(false)}
		disableCloseOnSelect
		filterSelectedOptions
		multiple
		freeSolo={!opcionesFijas}
		defaultValue={null}
		value={valor}
		options={opciones}
		onChange={(event, newValue) => {
			onChange(newValue);
		}}
		renderTags={(value, getTagProps) => {
			return value.map((option, index) => {

				if (opcionesFijas) {
					return <Chip
						color='primary'
						label={option}
						variant="outlined"
						{...getTagProps({ index })}
					/>
				}

				let ok = regexValidacion ? regexValidacion.test(option) : true;
				return <ColorChip
					color={ok ? 'primary' : 'secondary'}
					label={option}
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
					helperText={helperText}
				/>
			);
		}}
		{...props}
	/>


}


export default ControlTextoChip;