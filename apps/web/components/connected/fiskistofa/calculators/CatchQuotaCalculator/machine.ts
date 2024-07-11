import { ApolloClient } from '@apollo/client'
import { createMachine, assign } from 'xstate'
import {
  FiskistofaCatchQuotaCategory as CatchQuotaCategory,
  FiskistofaExtendedCatchQuotaCategory as ExtendedCatchQuotaCategory,
  QueryFiskistofaUpdateShipStatusForTimePeriodArgs as QueryUpdateShipStatusForTimePeriodArgs,
  QueryFiskistofaGetShipStatusForTimePeriodArgs as QueryGetShipStatusForTimePeriodArgs,
  FiskistofaQuotaType as QuotaType,
  FiskistofaShip as Ship,
  QueryFiskistofaUpdateShipQuotaStatusForTimePeriodArgs as QueryUpdateShipQuotaStatusForTimePeriodArgs,
  FiskistofaExtendedShipStatusInformationResponse,
  FiskistofaQuotaTypeResponse,
  FiskistofaExtendedShipStatusInformationUpdateResponse,
  FiskistofaQuotaStatusResponse,
} from '@island.is/api/schema'
import { sortAlpha } from '@island.is/shared/utils'

import {
  GET_QUOTA_TYPES_FOR_TIME_PERIOD,
  GET_SHIP_STATUS_FOR_TIME_PERIOD,
  UPDATE_SHIP_QUOTA_STATUS_FOR_TIME_PERIOD,
  UPDATE_SHIP_STATUS_FOR_TIME_PERIOD,
} from '../queries'
import initApollo from '@island.is/web/graphql/client'

type ContextData = {
  shipInformation?: Ship
  catchQuotaCategories?: Array<
    Omit<CatchQuotaCategory | ExtendedCatchQuotaCategory, '__typename'> & {
      timestamp?: number
    }
  >
}

/** Mutates a category list by sorting it an name ascending order */
const orderCategories = (categories?: { id?: number | null }[]) => {
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

interface QuotaData {
  id: number
  totalCatchQuota?: number
  quotaShare?: number
  nextYearQuota?: number
  nextYearFromQuota?: number
  allocatedCatchQuota?: number
}

export interface Context {
  data: ContextData | null
  initialData: ContextData | null
  updatedData: ContextData | null
  quotaData: QuotaData[]
  quotaTypes: QuotaType[]
  selectedQuotaTypes: QuotaType[]
  errorOccured: boolean
  apolloClient: ApolloClient<object> | null
}

type GetDataEvent = {
  type: 'GET_DATA'
  variables: QueryGetShipStatusForTimePeriodArgs
}

type UpdateGeneralDataEvent = {
  type: 'UPDATE_GENERAL_DATA'
  variables: QueryUpdateShipStatusForTimePeriodArgs
}

type UpdateQuotaDataEvent = {
  type: 'UPDATE_QUOTA_DATA'
  variables: QueryUpdateShipQuotaStatusForTimePeriodArgs
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
  | UpdateGeneralDataEvent
  | UpdateQuotaDataEvent
  | AddCategoryEvent
  | RemoveCategoryEvent
  | RemoveAllCategoriesEvent

type State =
  | { value: 'idle'; context: Context }
  | { value: 'getting general data'; context: Context }
  | { value: 'updating general data'; context: Context }
  | { value: 'updating quota data'; context: Context }
  | { value: 'error'; context: Context }

export const machine = createMachine<Context, Event, State>(
  {
    id: 'Catch Quota Calculator',
    context: {
      data: null,
      initialData: null,
      updatedData: null,
      quotaData: [],
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
          UPDATE_GENERAL_DATA: 'updating general data',
          UPDATE_QUOTA_DATA: 'updating quota data',
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
                quotaData: context.quotaData.filter(
                  (qd) => !selectedQuotaTypesIds.includes(qd.id),
                ),
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
                quotaData: context.quotaData.filter(
                  (qd) => qd.id !== event.categoryId,
                ),
              }
            }),
          },
          ADD_CATEGORY: {
            actions: assign((context, event) => {
              const categories = context.data?.catchQuotaCategories

              const quotaData = context.quotaData

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
                codEquivalent: event.category.codEquivalent,
              })

              quotaData.push({
                id: event.category.value,
                totalCatchQuota: event.category.totalCatchQuota,
                quotaShare: 0,
                nextYearQuota: 0,
                nextYearFromQuota: 0,
                allocatedCatchQuota: 0,
              })

              orderCategories(quotaData)
              orderCategories(categories)

              return {
                data: context.data,
                quotaTypes: context.quotaTypes.filter(
                  (qt) => qt.id !== event.category.value,
                ),
                quotaData: quotaData,
                selectedQuotaTypes: context.selectedQuotaTypes.concat({
                  name: event.category.label,
                  id: event.category.value,
                  codEquivalent: event.category.codEquivalent,
                  totalCatchQuota: event.category.totalCatchQuota,
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
      'updating general data': {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore make web strict
        invoke: {
          src: 'updateGeneralData',
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
      'updating quota data': {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore make web strict
        invoke: {
          src: 'updateQuotaData',
          onDone: {
            target: 'idle',
            actions: assign((_context, event) => ({
              ...event.data,
              errorOccured: false,
            })),
          },
          onError: {
            target: 'error',
            actions: assign(() => {
              return { errorOccured: true }
            }),
          },
        },
      },
      error: {
        on: {
          GET_DATA: 'getting data',
          UPDATE_GENERAL_DATA: 'updating general data',
          UPDATE_QUOTA_DATA: 'updating quota data',
        },
      },
    },
  },
  {
    services: {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore make web strict
      getData: async (context: Context, event: GetDataEvent) => {
        const [
          fiskistofaGetShipStatusForTimePeriodResponse,
          fiskistofaGetQuotaTypesForTimePeriodResponse,
        ] = await Promise.all([
          context.apolloClient?.query<{
            fiskistofaGetShipStatusForTimePeriod: FiskistofaExtendedShipStatusInformationResponse
          }>({
            query: GET_SHIP_STATUS_FOR_TIME_PERIOD,
            variables: event.variables,
            fetchPolicy: 'no-cache',
          }),
          context.apolloClient?.query<{
            fiskistofaGetQuotaTypesForTimePeriod: FiskistofaQuotaTypeResponse
          }>({
            query: GET_QUOTA_TYPES_FOR_TIME_PERIOD,
            variables: {
              input: {
                timePeriod: event.variables.input.timePeriod,
              },
            },
          }),
        ])

        const fiskistofaShipStatus =
          fiskistofaGetShipStatusForTimePeriodResponse?.data
            ?.fiskistofaGetShipStatusForTimePeriod.fiskistofaShipStatus

        const fiskistofaQuotaTypes =
          fiskistofaGetQuotaTypesForTimePeriodResponse?.data
            ?.fiskistofaGetQuotaTypesForTimePeriod.fiskistofaQuotaTypes ?? []

        if (fiskistofaShipStatus?.catchQuotaCategories) {
          orderCategories(fiskistofaShipStatus.catchQuotaCategories)
        }

        const categoryIds =
          fiskistofaShipStatus?.catchQuotaCategories?.map((c) => c.id) ?? []

        // Remove all quota types that are already in the category list
        const quotaTypes = fiskistofaQuotaTypes.filter(
          (qt) => !categoryIds.includes(qt.id),
        )
        // Order the types in ascending name order
        quotaTypes.sort(sortAlpha('name'))

        const quotaData = []

        for (const category of fiskistofaShipStatus?.catchQuotaCategories ??
          []) {
          quotaData.push({
            id: category.id,
            totalCatchQuota: category.totalCatchQuota,
            quotaShare: category.quotaShare,
            nextYearQuota: category.nextYearQuota,
            nextYearFromQuota: category.nextYearFromQuota,
            allocatedCatchQuota: category.allocatedCatchQuota,
          })
        }

        return {
          data: fiskistofaShipStatus,
          initialData: fiskistofaShipStatus,
          quotaTypes,
          selectedQuotaTypes: [],
          quotaData,
        }
      },
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore make web strict
      updateGeneralData: async (
        context: Context,
        event: UpdateGeneralDataEvent,
      ) => {
        const fiskistofaUpdateShipStatusForTimePeriodResponse =
          await context.apolloClient?.query<{
            fiskistofaUpdateShipStatusForTimePeriod: FiskistofaExtendedShipStatusInformationUpdateResponse
          }>({
            query: UPDATE_SHIP_STATUS_FOR_TIME_PERIOD,
            variables: event.variables,
            fetchPolicy: 'no-cache',
          })

        const fiskistofaShipStatus =
          fiskistofaUpdateShipStatusForTimePeriodResponse?.data
            ?.fiskistofaUpdateShipStatusForTimePeriod?.fiskistofaShipStatus

        const categories: ContextData['catchQuotaCategories'] = []
        // We want to keep the ordering of the categories the user has added
        for (const category of context.data?.catchQuotaCategories ?? []) {
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
            ...fiskistofaShipStatus,
            catchQuotaCategories: categories,
          },
          updatedData: {
            ...fiskistofaShipStatus,
            catchQuotaCategories: categories,
          },
        }
      },
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore make web strict
      updateQuotaData: async (
        context: Context,
        event: UpdateQuotaDataEvent,
      ) => {
        const fiskistofaUpdateShipQuotaStatusForTimePeriodResponse =
          await context.apolloClient?.query<{
            fiskistofaUpdateShipQuotaStatusForTimePeriod: FiskistofaQuotaStatusResponse
          }>({
            query: UPDATE_SHIP_QUOTA_STATUS_FOR_TIME_PERIOD,
            variables: event.variables,
          })

        const serverQuotaData =
          fiskistofaUpdateShipQuotaStatusForTimePeriodResponse?.data
            ?.fiskistofaUpdateShipQuotaStatusForTimePeriod
            ?.fiskistofaShipQuotaStatus

        const data = {
          ...context.data,
          catchQuotaCategories: context.data?.catchQuotaCategories?.map(
            (category) => {
              if (category.id === serverQuotaData?.id) {
                return {
                  ...category,
                  unused: serverQuotaData?.unused,
                  newStatus: serverQuotaData?.newStatus,
                  quotaShare: serverQuotaData?.quotaShare,
                  totalCatchQuota: serverQuotaData?.totalCatchQuota,
                  nextYearFromQuota: serverQuotaData?.nextYearFromQuota,
                  nextYearQuota: serverQuotaData?.nextYearQuota,
                }
              }
              return category
            },
          ),
        }

        const quotaData = context.quotaData.map((qd) => {
          if (qd.id === serverQuotaData?.id) {
            return {
              id: serverQuotaData.id,
              totalCatchQuota: serverQuotaData.totalCatchQuota,
              quotaShare: serverQuotaData.quotaShare,
              nextYearQuota: serverQuotaData.nextYearQuota,
              nextYearFromQuota: serverQuotaData.nextYearFromQuota,
              allocatedCatchQuota: serverQuotaData.allocatedCatchQuota,
            }
          }
          return qd
        })

        return {
          data,
          quotaData,
        }
      },
    },
  },
)
