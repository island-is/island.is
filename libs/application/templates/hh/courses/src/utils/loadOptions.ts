import format from 'date-fns/format'
import parseISO from 'date-fns/parseISO'
import is from 'date-fns/locale/is'
import type {
  Query,
  QueryGetCourseByIdArgs,
  QueryGetCourseSelectOptionsArgs,
} from '@island.is/api/schema'
import type { AsyncSelectContext } from '@island.is/application/types'
import { sortAlpha } from '@island.is/shared/utils'
import {
  GET_COURSE_BY_ID_QUERY,
  GET_COURSE_SELECT_OPTIONS_QUERY,
  GET_HEALTHCENTERS_QUERY,
} from '../graphql'

export const loadCourseSelectOptions = async ({
  apolloClient,
}: AsyncSelectContext) => {
  const { data } = await apolloClient.query<
    Query,
    QueryGetCourseSelectOptionsArgs
  >({
    query: GET_COURSE_SELECT_OPTIONS_QUERY,
    variables: {
      input: {
        lang: 'is',
        organizationSlug: 'hh',
      },
    },
  })
  return data.getCourseSelectOptions.items.map((item) => ({
    value: item.id,
    label: item.title,
  }))
}

export const loadDateSelectOptions = async ({
  apolloClient,
  selectedValues,
}: AsyncSelectContext) => {
  const courseId = selectedValues?.[0]
  if (!courseId) return []

  const { data } = await apolloClient.query<Query, QueryGetCourseByIdArgs>({
    query: GET_COURSE_BY_ID_QUERY,
    variables: {
      input: {
        id: courseId,
        lang: 'is',
      },
    },
  })
  if (!data?.getCourseById?.course) return []

  return data.getCourseById.course.instances.map((instance) => {
    const formattedDate = format(parseISO(instance.startDate), 'd. MMMM yyyy', {
      locale: is,
    })

    const startDateTimeDuration = instance.startDateTimeDuration?.startTime
      ? `${instance.startDateTimeDuration.startTime}${
          instance.startDateTimeDuration.endTime
            ? ` - ${instance.startDateTimeDuration.endTime}`
            : ''
        }`
      : ''

    return {
      value: instance.id,
      label: `${formattedDate} ${startDateTimeDuration}`,
    }
  })
}

export const loadHealthCenterSelectOptions = async ({
  apolloClient,
}: AsyncSelectContext) => {
  const response = await apolloClient.query<Query>({
    query: GET_HEALTHCENTERS_QUERY,
  })

  const centers =
    response?.data?.rightsPortalPaginatedHealthCenters?.data
      ?.filter((item) => item.id && item.name)
      ?.map((item) => {
        const name = item.name as string
        return {
          value: name,
          label: name,
        }
      }) ?? []

  centers.sort(sortAlpha('label'))

  return centers
}
