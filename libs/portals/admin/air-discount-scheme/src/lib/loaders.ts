import { WrappedLoaderFn } from '@island.is/portals/core'
import {
  FlightLegsDocument,
  FlightLegsQuery,
  FlightLegsQueryVariables,
} from '../screens/Overview/Overview.generated'
import { FlightLegsFilters } from '../screens/Overview/types'

export const prepareFlightLegsQuery = (): {
  filters: FlightLegsFilters
  input: FlightLegsQueryVariables['input']
} => {
  const TODAY = new Date()
  const filters = {
    nationalId: '',
    state: [],
    period: {
      from: new Date(TODAY.getFullYear(), TODAY.getMonth(), 1, 0, 0, 0, 0),
      to: new Date(
        TODAY.getFullYear(),
        TODAY.getMonth(),
        TODAY.getDate(),
        23,
        59,
        59,
        999,
      ),
    },
  }

  return {
    filters,
    input: {
      ...filters,
      age: {
        from: -1,
        to: 1000,
      },
      isExplicit: false,
    },
  }
}

export const overviewLoader: WrappedLoaderFn =
  ({ client }) =>
  async () => {
    const { input } = prepareFlightLegsQuery()

    const flightLegs = await client.query<FlightLegsQuery>({
      fetchPolicy: 'network-only',
      query: FlightLegsDocument,
      variables: {
        input,
      },
    })

    if (flightLegs.error) {
      throw flightLegs.error
    }

    return flightLegs.data
  }
