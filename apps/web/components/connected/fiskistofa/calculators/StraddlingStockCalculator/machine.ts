import { ApolloClient } from '@apollo/client'
import {
  FiskistofaCatchQuotaCategory as CatchQuotaCategory,
  QueryFiskistofaUpdateShipStatusForCalendarYearArgs as QueryUpdateShipStatusForCalendarYearArgs,
  QueryFiskistofaGetShipStatusForCalendarYearArgs as QueryGetShipStatusForCalendarYearArgs,
  FiskistofaQuotaType as QuotaType,
  FiskistofaShip as Ship,
  FiskistofaShipStatusInformationResponse,
  FiskistofaQuotaTypeResponse,
} from '@island.is/api/schema'
import { sortAlpha } from '@island.is/shared/utils'
import initApollo from '@island.is/web/graphql/client'
import { createMachine, assign } from 'xstate'
import {
  GET_QUOTA_TYPES_FOR_CALENDAR_YEAR,
  GET_SHIP_STATUS_FOR_CALENDAR_YEAR,
  UPDATE_SHIP_STATUS_FOR_CALENDAR_YEAR,
} from '../queries'

type ContextData = {
  shipInformation?: Ship
  catchQuotaCategories?: Array<CatchQuotaCategory & { timestamp?: number }>
}

/** Mutates a category list by sorting it an name ascending order */
const orderCategories = (categories: ContextData['catchQuotaCategories']) => {
  if (!categories) return

  // Ascending order by id
  categories.sort((a, b) => (a.id as number) - (b.id as number))

  // Place the cod value category at the front if it exists
  const codValueIndex = categories.findIndex((c) => c.id === 0)
  if (codValueIndex > 0) {
    const [codValue] = categories.splice(codValueIndex, 1)
    categories.unshift(codValue)
  }
}

export interface Context {
  data: ContextData | null
  initialData: ContextData | null
  updatedData: ContextData | null
  quotaTypes: QuotaType[]
  selectedQuotaTypes: QuotaType[]
  errorOccured: boolean
  apolloClient: ApolloClient<object> | null
}

type GetDataEvent = {
  type: 'GET_DATA'
  variables: QueryGetShipStatusForCalendarYearArgs
}

type UpdateDataEvent = {
  type: 'UPDATE_DATA'
  variables: QueryUpdateShipStatusForCalendarYearArgs
}

type AddCategoryEvent = {
  type: 'ADD_CATEGORY'
  category: {
    label: string
    value: number
    codEquivalent: number
    totalCatchQuota: number
  }
}

type RemoveCategoryEvent = {
  type: 'REMOVE_CATEGORY'
  categoryId: number
}

type RemoveAllCategoriesEvent = {
  type: 'REMOVE_ALL_CATEGORIES'
}

export type Event =
  | GetDataEvent
  | UpdateDataEvent
  | AddCategoryEvent
  | RemoveCategoryEvent
  | RemoveAllCategoriesEvent

type State =
  | { value: 'idle'; context: Context }
  | { value: 'getting data'; context: Context }
  | { value: 'updating data'; context: Context }
  | { value: 'error'; context: Context }

export const machine = createMachine<Context, Event, State>(
  {
    id: 'Straddling Stock Calculator',
    context: {
      data: null,
      initialData: null,
      updatedData: null,
      quotaTypes: [],
      selectedQuotaTypes: [],
      errorOccured: false,
      apolloClient: initApollo({}),
    },
    initial: 'idle',
    states: {
      idle: {
        on: {
          GET_DATA: 'getting data',
          UPDATE_DATA: 'updating data',
          REMOVE_ALL_CATEGORIES: {
            actions: assign((context) => {
              const selectedQuotaTypesIds = context.selectedQuotaTypes.map(
                (qt) => qt.id,
              )
              const categories =
                context.data?.catchQuotaCategories?.filter(
                  (c) => !selectedQuotaTypesIds.includes(c.id as number),
                ) ?? []
              return {
                selectedQuotaTypes: [],
                quotaTypes: context.quotaTypes
                  .concat(context.selectedQuotaTypes)
                  .sort(sortAlpha('name')),
                data: { ...context.data, catchQuotaCategories: categories },
              }
            }),
          },
          REMOVE_CATEGORY: {
            actions: assign((context, event) => {
              const quotaTypes = [...context.quotaTypes]

              const category = context.selectedQuotaTypes.find(
                (qt) => qt.id === event.categoryId,
              )

              // Move the selected quota type category back into the quota type array
              if (
                category &&
                !quotaTypes.map((qt) => qt.id).includes(category.id)
              ) {
                quotaTypes.push(category)
                quotaTypes.sort(sortAlpha('name'))
              }

              return {
                data: {
                  ...context.data,
                  catchQuotaCategories:
                    context.data?.catchQuotaCategories?.filter(
                      (c) => c.id !== event.categoryId,
                    ) ?? [],
                },
                quotaTypes,
                selectedQuotaTypes: context.selectedQuotaTypes.filter(
                  (qt) => qt.id !== event.categoryId,
                ),
              }
            }),
          },
          ADD_CATEGORY: {
            actions: assign((context, event) => {
              const categories = context.data?.catchQuotaCategories

              categories?.push({
                name: event.category.label,
                id: event.category.value,
                allocation: 0,
                betweenShips: 0,
                betweenYears: 0,
                catch: 0,
                catchQuota: 0,
                displacement: 0,
                excessCatch: 0,
                newStatus: 0,
                nextYear: 0,
                specialAlloction: 0,
                status: 0,
                unused: 0,
                timestamp: Date.now(), // Also store a timestamp for when the category got added by the user
              })

              orderCategories(categories)

              return {
                data: context.data,
                quotaTypes: context.quotaTypes.filter(
                  (qt) => qt.id !== event.category.value,
                ),
                selectedQuotaTypes: context.selectedQuotaTypes.concat({
                  name: event.category.label,
                  id: event.category.value,
                  totalCatchQuota: event.category?.totalCatchQuota,
                  codEquivalent: event.category?.codEquivalent,
                }),
              }
            }),
          },
        },
      },
      'getting data': {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore make web strict
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
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore make web strict
        invoke: {
          src: 'updateData',
          onDone: {
            target: 'idle',
            actions: assign((_context, event) => ({
              ...event.data,
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
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore make web strict
      getData: async (context: Context, event: GetDataEvent) => {
        let fiskistofaGetShipStatusForCalendarYearResponse = null

        try {
          fiskistofaGetShipStatusForCalendarYearResponse =
            await context.apolloClient?.query<{
              fiskistofaGetShipStatusForCalendarYear: FiskistofaShipStatusInformationResponse
            }>({
              query: GET_SHIP_STATUS_FOR_CALENDAR_YEAR,
              variables: event.variables,
              fetchPolicy: 'no-cache',
            })
        } catch (err) {
          // In case of an error we still want the user to be able to add categories and calculate values
          fiskistofaGetShipStatusForCalendarYearResponse = {
            data: {
              fiskistofaGetShipStatusForCalendarYear: {
                fiskistofaShipStatus: { catchQuotaCategories: [] },
              },
            },
          }
        }

        const fiskistofaGetQuotaTypesForCalendarYearResponse =
          await context.apolloClient?.query<{
            fiskistofaGetQuotaTypesForCalendarYear: FiskistofaQuotaTypeResponse
          }>({
            query: GET_QUOTA_TYPES_FOR_CALENDAR_YEAR,
            variables: {
              input: {
                year: event.variables.input.year,
              },
            },
          })

        const fiskistofaShipStatus =
          fiskistofaGetShipStatusForCalendarYearResponse?.data
            ?.fiskistofaGetShipStatusForCalendarYear?.fiskistofaShipStatus

        if (fiskistofaShipStatus?.catchQuotaCategories) {
          orderCategories(fiskistofaShipStatus.catchQuotaCategories)
        }

        const categoryIds =
          fiskistofaShipStatus?.catchQuotaCategories?.map(
            (c) => c.id as number,
          ) ?? []

        // Remove all quota types that are already in the category list
        const quotaTypes =
          fiskistofaGetQuotaTypesForCalendarYearResponse?.data?.fiskistofaGetQuotaTypesForCalendarYear.fiskistofaQuotaTypes?.filter(
            (qt) => !categoryIds.includes(qt.id),
          ) ?? []
        // Order the types in ascending name order
        quotaTypes.sort(sortAlpha('name'))

        return {
          data: fiskistofaShipStatus,
          initialData: fiskistofaShipStatus,
          quotaTypes,
          selectedQuotaTypes: [],
        }
      },
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore make web strict
      updateData: async (context: Context, event: UpdateDataEvent) => {
        const fiskistofaUpdateShipStatusForCalendarYearResponse =
          await context?.apolloClient?.query<{
            fiskistofaUpdateShipStatusForCalendarYear: FiskistofaShipStatusInformationResponse
          }>({
            query: UPDATE_SHIP_STATUS_FOR_CALENDAR_YEAR,
            variables: event.variables,
            fetchPolicy: 'no-cache',
          })

        const fiskistofaShipStatus =
          fiskistofaUpdateShipStatusForCalendarYearResponse?.data
            ?.fiskistofaUpdateShipStatusForCalendarYear.fiskistofaShipStatus

        const categories: ContextData['catchQuotaCategories'] = []

        // We want to keep the ordering of the categories the user has added
        for (const category of context?.data?.catchQuotaCategories ?? []) {
          const categoryFromServer =
            fiskistofaShipStatus?.catchQuotaCategories?.find(
              (c) => c.id === category.id,
            )
          if (categoryFromServer) {
            categories.push({
              ...category,
              ...categoryFromServer,
              timestamp: category.timestamp,
            })
          } else {
            categories.push(category)
          }
        }

        orderCategories(categories)

        return {
          data: {
            ...context.data,
            catchQuotaCategories: categories,
          },
          updatedData: {
            ...fiskistofaShipStatus,
            catchQuotaCategories: categories,
          },
        }
      },
    },
  },
)
