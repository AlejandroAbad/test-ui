




const K = {
	USUARIO_ANONIMO: {
		TOKEN: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJBTk9OSU1PIiwiYXVkIjoiQU5PTklNTyIsImV4cCI6OTk5OTk5OTk5OTk5OSwiaWF0IjoxLCJhbm9uaW1vIjp0cnVlfQ.ACk4OoZeHOB-1BZk9ci3t3fOOt-VD2-5qm9iCrEQGvI",
		DATOS: {
			sub: "MONITOR",
			aud: "ANONIMO",
			exp: 9999999999999,
			iat: 1,
			anonimo: true,
			meta: { ok: true, verified: true },
			perms: []
		}
	},
	ALERTA_EXPIRACION_TOKEN: 5*60,
	MARGEN_TTL_TOKEN: 60,
	URL_CONCENTRADOR: 'http://localhost:5000',
	URL_MONITOR: 'http://localhost:5001/v1'

}

export default K;