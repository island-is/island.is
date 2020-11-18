import { Server } from 'miragejs'

export function makeServer({ environment = 'development' } = {}) {
  const server = new Server({
    routes() {
      this.passthrough('http://localhost:4444/api/graphql')
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
      this.get('/api/endPointVariables', () => [
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
      ])
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
      this.get('/api/SæunnEndpoint', () => [
        { id: '1', name: 'Luke' },
        { id: '2', name: 'Leia' },
        { id: '3', name: 'Anakin' },
      ])
    },
  })
}

export default makeServer
