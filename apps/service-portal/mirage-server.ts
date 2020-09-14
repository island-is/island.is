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
      this.passthrough('http://localhost:4444/api/graphql')

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

      this.get('/api/cases', () => {
        const cases = [
          {
            id: 'ABC-123',
            policeCaseNumber: 'XYZ-456',
            suspectName: 'John Doe',
            suspectNationalId: '123456789',
            created: '2020-07-27T00:00:00.000',
            modified: '2020-07-27T00:00:00.000',
            state: 'Drög',
          },
          {
            id: 'ABC-453',
            policeCaseNumber: 'SDF-456',
            suspectName: 'Mary Doe',
            suspectNationalId: '123456789',
            created: '2020-07-27T00:00:00.000',
            modified: '2020-07-27T00:00:00.000',
            state: 'Gæsluvarðhald virkt',
          },
          {
            id: 'ABC-987',
            policeCaseNumber: 'KFD-486',
            suspectName: 'Alan Smith',
            suspectNationalId: '123456789',
            created: '2020-07-27T00:00:00.000',
            modified: '2020-07-27T00:00:00.000',
            state: 'Krafa staðfest',
          },
        ]

        return new Response(200, {}, cases)
      })
    },
  })
}
