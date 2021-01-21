import { useCallback } from "react";
import useArray from "./useArray";


export default function useSeleccion(seleccionInicial) {
	const [seleccion, { push, remove, empty, set }] = useArray(seleccionInicial || []);
	const onSeleccionCambia = useCallback((indice, seleccionado) => {
		if (seleccionado === true)
			push(indice);
		else {
			remove(indice);
		}

	}, [push, remove]);

	return [seleccion, {
		cambiarElemento: onSeleccionCambia, 
		limpiarSeleccion: empty, 
		setSeleccion: set
	} ]
}