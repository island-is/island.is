import addDays from 'date-fns/addDays'
import { ApolloClient, NormalizedCacheObject } from '@apollo/client'

import {
  ContentLanguage,
  Event as EventModel,
  GetNamespaceQuery,
  QueryGetNamespaceArgs,
} from '../graphql/schema'
import { GET_NAMESPACE_QUERY } from '../screens/queries'

export const getHasEventOccurred = (
  event: Pick<EventModel, 'startDate' | 'endDate'>,
) => {
  if (!event.endDate && !event.startDate) return true
  const dateString = event.endDate ? event.endDate : event.startDate
  return addDays(new Date(dateString), 1) < new Date()
}

export const isEventFromOrganization = (
  event: Pick<EventModel, 'organization'>,
  organizationSlug?: string | null,
) =>
  Boolean(event.organization?.slug) &&
  Boolean(organizationSlug) &&
  event.organization?.slug === organizationSlug

export const fetchEventNamespace = (
  apolloClient: ApolloClient<NormalizedCacheObject>,
  locale: string,
): Promise<Record<string, string>> =>
  apolloClient
    .query<GetNamespaceQuery, QueryGetNamespaceArgs>({
      query: GET_NAMESPACE_QUERY,
      variables: {
        input: {
          lang: locale as ContentLanguage,
          namespace: 'OrganizationPages',
        },
      },
    })
    // map data here to reduce data processing in component
    .then((variables) =>
      variables?.data?.getNamespace?.fields
        ? JSON.parse(variables.data.getNamespace.fields)
        : {},
    )
