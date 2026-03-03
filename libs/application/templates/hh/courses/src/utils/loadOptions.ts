import format from 'date-fns/format'
import parseISO from 'date-fns/parseISO'
import is from 'date-fns/locale/is'
import type {
  Query,
  QueryGetCourseByIdArgs,
  QueryGetCourseSelectOptionsArgs,
} from '@island.is/api/schema'
import { storageFactory } from '@island.is/shared/utils'
import {
  InstitutionContentfulIds,
  type AsyncSelectContext,
} from '@island.is/application/types'
import {
  GET_COURSE_BY_ID_QUERY,
  GET_COURSE_SELECT_OPTIONS_QUERY,
} from '../graphql'

const cache = storageFactory(() => sessionStorage)

const createCacheKey = (instanceId: string): string =>
  `hhCourseInstanceChargeItemCode:${instanceId}`

/**
 * Checks if the course instance has a charge item code.
 * @param instanceId - The id of the course instance.
 * @returns true if the course instance has a charge item code or if we're unsure, false otherwise.
 */
export const doesCourseInstanceHaveChargeItemCode = (
  instanceId: string | undefined | null,
): boolean => {
  if (!instanceId) return true
  const cachedValue = cache.getItem(createCacheKey(instanceId))
  if (cachedValue === 'true') return true
  if (cachedValue === 'false') return false
  return true
}

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
        organizationId:
          InstitutionContentfulIds.HEILSUGAESLA_HOFUDBORDARSVAEDISINS,
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

  for (const instance of data.getCourseById.course.instances)
    cache.setItem(
      createCacheKey(instance.id),
      String(Boolean(instance.chargeItemCode)),
    )

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
