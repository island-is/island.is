import { Server, Model, Response, hasMany } from 'miragejs'
import actors from './src/mirage-server/fixtures/actors'
import subjects from './src/mirage-server/fixtures/subjects'
import { AuthService } from './src/mirage-server/auth-service'

export function makeServer({ environment = 'development' } = {}) {
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

      this.get('/mock/authenticate', () => {
        const authService = new AuthService(server.db)
        const t = authService.mockToken()
        return new Response(200, {}, t)
      })

      this.get('/user/accounts/:nationalId', async (schema, request) => {
        const authService = new AuthService(server.db)

        const subjects = authService.getSubjectListByNationalId(
          request.params.nationalId,
        )

        return new Response(200, {}, { subjects })
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
