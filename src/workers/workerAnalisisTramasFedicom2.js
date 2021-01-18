




export default function workerAnalizaTramas(contenidoFichero) {




	function aLogin(data, dataRef) {
		let idx = 3;
		dataRef.version = data.substring(idx, idx += 1);
		dataRef.fecha = data.substring(idx, idx += 8).trim();
		dataRef.hora = data.substring(idx, idx += 6).trim();
		dataRef.usuario = data.substring(idx, idx += 16).trim();
		dataRef.clave = data.substring(idx, idx + 8).trim();
		dataRef.transfer = dataRef.usuario.startsWith("TR") || dataRef.usuario.startsWith("TG") || dataRef.usuario.startsWith("TP");
	}
	function a1010(data, dataRef) {
		let idx = 4;
		dataRef.codCli = data.substring(idx, idx += 16).trim();
		dataRef.numPedCli = data.substring(idx, idx += 10).trim();
		dataRef.tipoPed = data.substring(idx, idx += 6).trim();
		dataRef.condi = data.substring(idx, idx += 6).trim();

		dataRef.cargoCoop = data.substring(idx, idx += 1).trim();
		dataRef.aplazaCargo = data.substring(idx, idx += 3).trim();
		dataRef.aplazaPago = data.substring(idx, idx += 3).trim();
		dataRef.descuentoAdicional = data.substring(idx, idx += 4).trim();
		dataRef.empresaFactura = data.substring(idx, idx += 3).trim();
		dataRef.almacen = data.substring(idx, idx += 4).trim();
		dataRef.fechaEnvio = data.substring(idx, idx += 8).trim();
		dataRef.diaEnvio = data.substring(idx, idx + 2).trim();
		dataRef.lineas = [];
	}
	function a1020(trama, dataRef) {
		let idx = 4;
		let posicion = {
			id: dataRef.lineas.length,
			codArti: trama.substring(idx, idx += 13).trim(),
			cantidad: parseInt(trama.substring(idx, idx + 4))
		}
		if (dataRef.version === 2)
			posicion.texto = trama.substring(idx, idx + 50).trim();

		dataRef.lineas.push(posicion);
	}
	function a1030(trama, dataRef) {
		let idx = 4;
		let posicion = {
			id: dataRef.lineas.length,
			codArti: trama.substring(idx, idx += 13).trim(),
			cantidad: parseInt(trama.substring(idx, idx + 4)),
			bonificacion: parseInt(trama.substring(idx, idx += 4)),
			descuentoLinea: parseInt(trama.substring(idx, idx += 4)) / 100,
			texto: trama.substring(idx, idx + 50).trim()
		}

		dataRef.lineas.push(posicion);
	}
	function a1040(trama, dataRef) {
		let idx = 4;
		let posicion = {
			id: dataRef.lineas.length,
			codArti: trama.substring(idx, idx += 13).trim(),
			cantidad: parseInt(trama.substring(idx, idx + 4)),
			descuentoLinea: parseInt(trama.substring(idx, idx += 4)) / 100,
			valeEstupefaciente: trama.substring(idx, idx += 25).trim(),
			texto: trama.substring(idx, idx + 50).trim()
		}

		dataRef.lineas.push(posicion);
	}
	function a2015(trama, dataRef) {
		let idx = 4;
		let falta = {
			codArti: trama.substring(idx, idx += 13).trim(),
			cantidad: parseInt(trama.substring(idx, idx += 4)),
			cantidadFalta: parseInt(trama.substring(idx, idx += 4)),
			bonificacion: parseInt(trama.substring(idx, idx += 4)),
			bonificacionFalta: parseInt(trama.substring(idx, idx += 4)),
			codigoIncidencia: trama.substring(idx, idx += 2).trim(),
			articuloSustituyente: trama.substring(idx, idx + 13).trim()
		}

		dataRef.faltas.push(falta);
	}


	function tramaDeFarmacia(linea) {
		let id = linea.substring(0, linea.indexOf(' '));

		let transmision = linea.substring(linea.indexOf(': ') + 2);

		let tramas = transmision.split(/\.\./);
		let infoTransmision = {}

		tramas.forEach(trama => {
			let tipoTrama = trama.substring(0, 4);

			switch (tipoTrama) {
				case '0101':
				case '0102':
					aLogin(trama, infoTransmision);
					break;
				case '1010':
					a1010(trama, infoTransmision);
					break;
				case '1020':
					a1020(trama, infoTransmision);
					break;
				case '1030':
					a1030(trama, infoTransmision);
					break;
				case '1040':
					a1040(trama, infoTransmision);
					break;
				default:
			}
		})


		return [id, infoTransmision];
	}
	function tramaASap(linea) {
		let id = linea.substring(0, linea.indexOf(' '));
		let transmision = linea.substring(linea.indexOf(': ') + 2);

		let tramas = transmision.split(/\.\./);
		let tramaCrc = tramas[1];
		let crc = tramaCrc.substring(8, 16);

		return [id, crc];
	}
	function tramaAFarmacia(linea) {
		let id = linea.substring(0, linea.indexOf(' '));
		let transmision = linea.substring(linea.indexOf(': ') + 2);

		let tramas = transmision.split(/\.\./);
		let infoTransmision = { faltas: [] }

		tramas.forEach(trama => {
			let tipoTrama = trama.substring(0, 4);

			switch (tipoTrama) {
				case '2015':
					a2015(trama, infoTransmision);
					break;
				default:
			}
		})




		return [id, infoTransmision.faltas];
	}


	let arrayLineas = contenidoFichero.split(/\n+/);
	let tramasAnalizadas = {};

	arrayLineas.forEach((linea, i) => {

		if (linea.includes('Recibido:')) {
			let [id, datos] = tramaDeFarmacia(linea);
			tramasAnalizadas[id] = datos;
		} else if (linea.includes('Pedido formateado:')) {
			let [id, crc] = tramaASap(linea);
			tramasAnalizadas[id].crc = crc;
		} else if (linea.includes('Incidencias enviadas:')) {
			let [id, faltas] = tramaAFarmacia(linea);
			let lineas = tramasAnalizadas[id]?.lineas || [];

			faltas.forEach(falta => {

				let numeroPosicion = lineas.findIndex(l => l.codArti.substring(6) === falta.codArti.substring(6));

				if (numeroPosicion === -1) {
					lineas.push(falta);
				} else {
					if (falta.bonificacionFalta === 0) {
						delete falta.bonificacionFalta;
						delete falta.bonificacion;
					}

					if (falta.articuloSustituyente === falta.codArti) {
						delete falta.articuloSustituyente;
					}

					lineas[numeroPosicion] = { ...falta, ...lineas[numeroPosicion] }
				}

			})


		}



	});

	return Object.values(tramasAnalizadas);
}




