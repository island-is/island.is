import { Server } from 'miragejs'

export function makeServer() {
  let url = ''
  if (process.env.NODE_ENV === 'production') {
    url = 'https://umsoknir.dev01.devland.is/api/graphql'
  } else {
    url = 'http://localhost:4444/api/graphql'
  }

  new Server({
    routes() {
      this.passthrough(url)
      this.get('/api/keys', () => [
        {
          id: '1',
          name: 'Client ID',
          value: '5016d8d5cb6ce0758107b9969ea3c201',
        },
        {
          id: '2',
          name: 'Secret key',
          value: '5016d8d5cb6ce0758107b9969ea3c201',
        },
      ])
      this.post('/api/endPointVariables', (schema, request) => {
        // const attrs = JSON.parse(request.requestBody)
        // console.log(attrs)
        const data = [
          {
            id: '1',
            name: 'Audience',
            value: '5016d8d5cb6ce0758107b9969ea3c201',
          },
          {
            id: '2',
            name: 'Scope',
            value: '5016d8d5cb6ce0758107b9969ea3c201',
          },
        ]
        return data
      })
      this.get(
        '/api/testMyEndpoint',
        () => [
          {
            id: '1',
            isValid: true,
            message: 'Skjal fannst fyrir skráða kennitölu',
          },
          {
            id: '2',
            isValid: false,
            message: 'Ekki tókst að sækja skjal til skjalaveitu',
          },
        ],
        {
          timing: 2000,
        },
      )
      this.get('/api/prodKeys', () => [
        {
          id: '1',
          name: 'Client ID',
          value: '5016d8d5cb6ce0758107b9969ea3c201',
        },
        {
          id: '2',
          name: 'Secret key',
          value: '5016d8d5cb6ce0758107b9969ea3c201',
        },
      ])
    },
  })
}
export default makeServer
