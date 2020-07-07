import * as jwt from 'webcrypto-jwt'

export class JwtUtils {
	static async signJwt(user: string, secret: string): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			jwt.signJWT({user}, secret, 'HS256',  function (err, token) {
				if(err) reject(err)
				resolve(token)
			})
		})
	}

	static async isValidJwt(token: string, secret: string): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			jwt.verifyJWT(token, secret, 'HS256',  function (err, isValid) {
				if(err) reject(err)
				resolve(isValid)
			})
		})
	}

	static async parseJwt(token: string) {
		return await jwt.parseJWT(token)
	}
}