import { Server, Model, Response, hasMany, Factory } from "miragejs"
import { JwtUtils } from './src/mirage-server/jwt-utils'

export function makeServer({ environment = "development" } = {}) {
	const JWT_SECRET = '098765432345678987654'
	
	let server = new Server({
		models: {
			actor: Model
		},
		seeds(server) {
			server.create('actor', {
				nationalId: '2606862759',
				scope: [
					'@Island.is/health',
					'@Island.is/health/perscriptions.edit',
					'@Island.is/health/vaccines.view'
				],
				accountType: 'person',
				name: 'Ólafur Björn Magnússon',
				actor: '2606862759',
				subject: '2606862759'
			} as any)
		},
		routes() {
			this.post("/user/token", async (schema, request) => {
				let nationalId = JSON.parse(request.requestBody)

				const user = schema.db.actors.findBy(x => x.nationalId === nationalId)
				if(!user) return new Response(403)
				const token = await JwtUtils.signJwt(user, JWT_SECRET)

				return new Response(200, {}, {token})
			})
		}
	})
}