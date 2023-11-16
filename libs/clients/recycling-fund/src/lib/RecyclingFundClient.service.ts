import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import { RecyclingFundGraphQLClientApi } from '../../gen/fetch'
import { gql } from '@apollo/client'
import { GraphQLClient } from 'graphql-request'

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

  async getVehicles(user: User): Promise<any> {
    console.log(
      'recyclingFundGraphQLClientApi',
      this.recyclingFundGraphQLClientApi,
    )
    console.log('USER', user)

    // Perform token exchange to obtain an access token with initial scope
    /*  const initialAccessToken = await this.performTokenExchange(
      clientId,
      clientSecret,
      username,
      password,
      initialScope,
    )

    // Create a GraphQL client with the obtained access token
    const initialGraphQLClient = this.createGraphQLClient(initialAccessToken)
*/
    const graphQLClient = new GraphQLClient(
      'http://localhost:3339/app/skilavottord/api/graphql',
      {
        headers: {
          authorization: user.authorization,
        },
      },
    )

    const query = gql`
      {
        skilavottordAppSysVehicles {
          permno
        }
      }
    `

    /*const results = await graphQLClient.request(query)
    console.log('results', results)
    return results
*/
    // Make a request to the GraphQL endpoint
    //const resp = await graphQLClient.request(query)

    // console.log('getVehicles22 -resp ', resp)

    // Make a request to the GraphQL endpoint with the GraphQL client and initial scope
    //const initialResult = await initialGraphQLClient.request(query)
    //console.log('Initial GraphQL response:', initialResult)

    //return initialResult

    /* const response = await fetch(
      'http://localhost:3339/app/skilavottord/api/graphql',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(SkilavottordRecyclingPartnerVehiclesQuery),
      },
    )

    console.log('rRRRRRResponse', response.text())

    const result = await response.json()

    console.log('DONE!!!!', result)

    return result.data
*/
    /* try {
      return await this.graphQLClient.request(SkilavottordRecyclingPartnerVehiclesQuery, undefined);
    } catch (error) {
      console.error('GraphQL request error:', error);
      throw error;
    }
  */
    return await this.getRecyclingFundGraphQLClient(user).recyclingFundQuery({
      body: { query: '{skilavottordAppSysVehicles{ permno }}' },
      // body: { query: '{skilavottordVehicles{ permno }}' },
    })
  }
}
