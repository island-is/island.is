import { Server, Model, Response, hasMany, Factory } from "miragejs"

export function makeServer({ environment = "development" } = {}) {
	const JWT_SECRET = '098765432345678987654'
	
	let server = new Server({
		models: {
			actor: Model.extend({
				account: hasMany(),
			}),
			account: Model
		}
	}
}