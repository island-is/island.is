import { gql } from '@apollo/client'

export const GET_HELLO_WORLD_GREETING = gql`
  query GetHelloWorldGreeting($input: HelloWorldInput!) {
    helloWorld(input: $input) {
      message
    }
  }
`
