import * as Types from '@island.is/api/schema'

import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'
const defaultOptions = {} as const
export type FlightLegsQueryVariables = Types.Exact<{
  input: Types.AirDiscountSchemeFlightLegsInput
}>

export type FlightLegsQuery = {
  __typename?: 'Query'
  airDiscountSchemeFlightLegs: Array<{
    __typename?: 'AirDiscountSchemeFlightLeg'
    id: string
    travel: string
    airline: string
    cooperation?: string | null
    originalPrice: number
    discountPrice: number
    financialState: string
    flight: {
      __typename?: 'AirDiscountSchemeFlight'
      id: string
      bookingDate: string
      userInfo: {
        __typename?: 'AirDiscountSchemeUserInfo'
        age: number
        gender: string
        postalCode: number
      }
    }
  }>
}

export type ConfirmInvoiceMutationVariables = Types.Exact<{
  input: Types.AirDiscountSchemeConfirmInvoiceInput
}>

export type ConfirmInvoiceMutation = {
  __typename?: 'Mutation'
  confirmAirDiscountSchemeInvoice: Array<{
    __typename?: 'AirDiscountSchemeFlightLeg'
    id: string
    financialState: string
  }>
}

export const FlightLegsDocument = gql`
  query FlightLegs($input: AirDiscountSchemeFlightLegsInput!) {
    airDiscountSchemeFlightLegs(input: $input) {
      id
      travel
      airline
      cooperation
      originalPrice
      discountPrice
      financialState
      flight {
        id
        bookingDate
        userInfo {
          age
          gender
          postalCode
        }
      }
    }
  }
`

/**
 * __useFlightLegsQuery__
 *
 * To run a query within a React component, call `useFlightLegsQuery` and pass it any options that fit your needs.
 * When your component renders, `useFlightLegsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFlightLegsQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useFlightLegsQuery(
  baseOptions: Apollo.QueryHookOptions<
    FlightLegsQuery,
    FlightLegsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<FlightLegsQuery, FlightLegsQueryVariables>(
    FlightLegsDocument,
    options,
  )
}
export function useFlightLegsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    FlightLegsQuery,
    FlightLegsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<FlightLegsQuery, FlightLegsQueryVariables>(
    FlightLegsDocument,
    options,
  )
}
export type FlightLegsQueryHookResult = ReturnType<typeof useFlightLegsQuery>
export type FlightLegsLazyQueryHookResult = ReturnType<
  typeof useFlightLegsLazyQuery
>
export type FlightLegsQueryResult = Apollo.QueryResult<
  FlightLegsQuery,
  FlightLegsQueryVariables
>
export const ConfirmInvoiceDocument = gql`
  mutation ConfirmInvoice($input: AirDiscountSchemeConfirmInvoiceInput!) {
    confirmAirDiscountSchemeInvoice(input: $input) {
      id
      financialState
    }
  }
`
export type ConfirmInvoiceMutationFn = Apollo.MutationFunction<
  ConfirmInvoiceMutation,
  ConfirmInvoiceMutationVariables
>

/**
 * __useConfirmInvoiceMutation__
 *
 * To run a mutation, you first call `useConfirmInvoiceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useConfirmInvoiceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [confirmInvoiceMutation, { data, loading, error }] = useConfirmInvoiceMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useConfirmInvoiceMutation(
  baseOptions?: Apollo.MutationHookOptions<
    ConfirmInvoiceMutation,
    ConfirmInvoiceMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
    ConfirmInvoiceMutation,
    ConfirmInvoiceMutationVariables
  >(ConfirmInvoiceDocument, options)
}
export type ConfirmInvoiceMutationHookResult = ReturnType<
  typeof useConfirmInvoiceMutation
>
export type ConfirmInvoiceMutationResult = Apollo.MutationResult<ConfirmInvoiceMutation>
export type ConfirmInvoiceMutationOptions = Apollo.BaseMutationOptions<
  ConfirmInvoiceMutation,
  ConfirmInvoiceMutationVariables
>
