import { Server, Model, Response, hasMany } from 'miragejs'
import actors from './src/mirage-server/fixtures/actors'
import subjects from './src/mirage-server/fixtures/subjects'
import { JwtToken, JwtUtils } from './src/mirage-server/models/jwt-model'
import { Actor } from './src/mirage-server/models/actor'
import { AuthService } from './src/mirage-server/auth-service'
import { Subject } from './src/mirage-server/models/subject'

export function makeServer({ environment = 'development' } = {}) {
  const JWT_SECRET = '098765432345678987654'

  const server = new Server({
    models: {
      actor: Model.extend({
        account: hasMany(),
      }),
      account: Model,
    },
    fixtures: {
      actors: actors,
      subjects: subjects,
    },
    seeds(server) {
      server.loadFixtures('actors', 'subjects')
    },
    routes() {
      this.passthrough(
        'https://siidentityserverweb20200805020732.azurewebsites.net/**',
      )
      this.post('/user/token', async (schema, request) => {
        const authService = new AuthService(server.db)
        const body = JSON.parse(request.requestBody)
        const actorNationalId = body.actorNationalId
        const subjectNationalId = body.subjectNationalId
        const actor: Actor = authService.getActorByNationalId(actorNationalId)
        if (!actor) return new Response(403)
        const subject = authService.getSubjectByNationalId(subjectNationalId)

        const jwt = new JwtToken(actor, subject)
        const token = await jwt.signJwt(JWT_SECRET)

        return new Response(200, {}, { token })
      })

      this.get('/user/accounts', async (schema, request) => {
        const authService = new AuthService(server.db)
        const token = request.requestHeaders.authorization
        const isValid = await JwtUtils.isValidJwt(token, JWT_SECRET)

        if (!isValid) return new Response(403)

        const parsedToken: JwtToken = await JwtUtils.parseJwt(token)
        const subjects = authService.getSubjectListByNationalId(
          parsedToken.actor.nationalId,
        )

        return new Response(200, {}, { subjects })
      })

      this.get('/user/tokenexchange/:nationalId', async (schema, request) => {
        const authService = new AuthService(server.db)
        const token = request.requestHeaders.authorization
        const isValid = await JwtUtils.isValidJwt(token, JWT_SECRET)
        if (!isValid) return new Response(403)

        const parsedToken: JwtToken = await JwtUtils.parseJwt(token)
        const actor: Actor = authService.getActorByNationalId(
          parsedToken.actor.nationalId,
        )
        const subject: Subject = authService.getSubjectForActor(actor)

        if (!subject) {
          return new Response(403)
        }

        const jwt = new JwtToken(actor, subject)
        const newToken = await jwt.signJwt(JWT_SECRET)

        return new Response(200, {}, { newToken })
      })

      this.get('/documents', async (schema, request) => {
        return new Response(200, {}, [
          {
            id: 1,
            name: 'Greiðsluseðill (Bifr.gjöld) - Ríkissjóðsinnheimtur',
          },
          { id: 2, name: 'Greiðsluseðill (Laun) - Ríkissjóðsinnheimtur' },
        ])
      })
    },
  })
}
