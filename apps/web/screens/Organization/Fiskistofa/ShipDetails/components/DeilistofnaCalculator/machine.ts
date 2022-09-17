import { ApolloClient } from '@apollo/client'
import initApollo from '@island.is/web/graphql/client'
import {
  MutationUpdateShipStatusForCalendarYearArgs,
  QueryGetShipStatusForCalendarYearArgs,
  QuotaType,
  ShipStatusInformation,
} from '@island.is/web/graphql/schema'
import { createMachine, assign } from 'xstate'
import { GET_QUOTA_TYPES_FOR_CALENDAR_YEAR } from '../QuotaTypeSelect/queries'
import {
  GET_SHIP_STATUS_FOR_CALENDAR_YEAR,
  UPDATE_SHIP_STATUS_FOR_CALENDAR_YEAR,
} from './queries'

interface Context {
  data: ShipStatusInformation | null
  quotaTypes: QuotaType[]
  errorOccured: boolean
  apolloClient: ApolloClient<object> | null
}

type Event =
  | { type: 'GET_DATA'; variables: QueryGetShipStatusForCalendarYearArgs }
  | {
      type: 'UPDATE_DATA'
      variables: MutationUpdateShipStatusForCalendarYearArgs
    }

type State =
  | { value: 'idle'; context: Context }
  | { value: 'getting data'; context: Context }
  | { value: 'updating data'; context: Context }
  | { value: 'error'; context: Context }

export const machine = createMachine<Context, Event, State>(
  {
    id: 'Deilistofna Calculator',
    context: {
      data: null,
      quotaTypes: [],
      errorOccured: false,
      apolloClient: initApollo({}),
    },
    initial: 'idle',
    states: {
      idle: {
        on: {
          GET_DATA: 'getting data',
          UPDATE_DATA: 'updating data',
        },
      },
      'getting data': {
        invoke: {
          src: 'getData',
          onDone: {
            actions: assign((_context, event) => ({
              ...event.data,
              errorOccured: false,
            })),
            target: 'idle',
          },
          onError: {
            actions: assign(() => ({ errorOccured: true })),
            target: 'error',
          },
        },
      },
      'updating data': {
        invoke: {
          src: 'updateData',
          onDone: {
            target: 'idle',
            actions: assign((_context, event) => ({
              data: event.data,
              errorOccured: false,
            })),
          },
          onError: {
            target: 'error',
            actions: assign(() => ({ errorOccured: true })),
          },
        },
      },
      error: {
        on: {
          GET_DATA: 'getting data',
          UPDATE_DATA: 'updating data',
        },
      },
    },
  },
  {
    services: {
      getData: async (context, event) => {
        const [
          {
            data: { getShipStatusForCalendarYear },
          },
          {
            data: { getQuotaTypesForCalendarYear },
          },
        ] = await Promise.all([
          context.apolloClient.query<{
            getShipStatusForCalendarYear: ShipStatusInformation
          }>({
            query: GET_SHIP_STATUS_FOR_CALENDAR_YEAR,
            variables: event.variables,
            fetchPolicy: 'no-cache',
          }),
          context.apolloClient.query<{
            getQuotaTypesForCalendarYear: QuotaType[]
          }>({
            query: GET_QUOTA_TYPES_FOR_CALENDAR_YEAR,
            variables: {
              input: {
                year: event.variables.input.year,
              },
            },
          }),
        ])
        return {
          data: getShipStatusForCalendarYear,
          quotaTypes: getQuotaTypesForCalendarYear,
        }
      },
      updateData: async (context, event) => {
        const {
          data: { updateShipStatusForCalendarYear },
        } = await context.apolloClient.query<{
          updateShipStatusForCalendarYear: ShipStatusInformation
        }>({
          query: UPDATE_SHIP_STATUS_FOR_CALENDAR_YEAR,
          variables: event.variables,
          fetchPolicy: 'no-cache',
        })
        return updateShipStatusForCalendarYear
      },
    },
  },
)
