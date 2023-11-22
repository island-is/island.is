import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import { RecyclingFundGraphQLClientApi } from '../../gen/fetch'
import { gql } from '@apollo/client'
import { GraphQLClient } from 'graphql-request'
import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { getSdk } from '../../gen/graphql-request'
import jwt from 'jsonwebtoken'

const graphqlEndpoint = 'http://localhost:3339/app/skilavottord/api/graphql' // Replace with your actual GraphQL endpoint
const tokenEndpoint = 'http://your-token-endpoint' // Replace with your actual token endpoint
const clientId = 'your-client-id'
const clientSecret = 'your-client-secret'
const username = 'your-username'
const password = 'your-password'
const initialScope = 'read'
const additionalScope = 'write'

@Injectable()
export class RecyclingFundClientService {
  // private readonly graphQLClient: GraphQLClient

  constructor(
    private readonly recyclingFundGraphQLClientApi: RecyclingFundGraphQLClientApi,
  ) {
    console.log(
      'recyclingFundGraphQLClientApi-CONST',
      recyclingFundGraphQLClientApi,
    )
    /*this.graphQLClient = new GraphQLClient(
      'http://localhost:3339/app/skilavottord/api/graphql',
      {
        headers: {
          authorization: 'bearer ' + 'BK AUTH',
        },
      }
    )*/
  }

  async performTokenExchange(
    clientId: string,
    clientSecret: string,
    username: string,
    password: string,
    scope: string,
  ) {
    try {
      const response = await fetch(tokenEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          grant_type: 'password',
          client_id: clientId,
          client_secret: clientSecret,
          username,
          password,
          scope,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Token exchange error:', errorData)
        throw new Error('Token exchange error')
      }

      const data = await response.json()
      return data.access_token
    } catch (error) {
      console.error('Token exchange error:', error)
      throw error
    }
  }

  createGraphQLClient(accessToken: string) {
    return new GraphQLClient(graphqlEndpoint, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
  }

  private getRecyclingFundGraphQLClient = (user: User) =>
    this.recyclingFundGraphQLClientApi.withMiddleware(
      new AuthMiddleware(user as Auth),
    )

  private getClientWithAuth(user: User) {
    /* return new GraphQLClient(graphqlEndpoint, {
      fetch: createEnhancedFetch({
        name: 'clients-recycling-fund',
        autoAuth: {
          mode: 'tokenExchange',
          issuer: 'https://identity-server.dev01.devland.is',
          clientId: '@island.is/clients/dev',
          clientSecret: 'AzNw3K0jMkmq3mxF2svt8YvXU',
          scope: ['@urvinnslusjodur.is/skilavottord'],
        },
      }),
      //requestMiddleware,
    }) 
    */
  }

  async getVehicles(user: User): Promise<any> {
    console.log('getVehiclesBB', `Bearer ${user}`)

    const client = new GraphQLClient(graphqlEndpoint, {
      headers: {
        Authorization: `Bearer ${user}`,
      },
    })

    console.log('postCarRecyclingApplication in client service', { user })

    const sdk = getSdk(client)
    const respsonse = await sdk.getVehiclesQuery()

    console.log('postCarRecyclingApplication result', {
      respsonse,
    })

    return respsonse

    return await this.getRecyclingFundGraphQLClient(user).recyclingFundQuery({
      body: { query: '{skilavottordAppSysVehicles{ permno }}' },
      // body: { query: '{skilavottordVehicles{ permno }}' },
    })
  }
}
