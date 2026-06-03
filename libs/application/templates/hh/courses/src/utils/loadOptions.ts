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
import {
  COURSE_LIST_PAGE_ID_FOR_PROFESSIONALS,
  isCourseForProfessionals,
} from './isCourseForProfessionals'
import { getValueViaPath } from '@island.is/application/core'
import { parseQueryParamValue } from './parseQueryParamValue'

const cache = storageFactory(() => localStorage)

const creatChargeItemCodeCacheKey = (instanceId: string): string =>
  `hhCourseInstanceChargeItemCode:${instanceId}`

const createCourseListPageIdCacheKey = (courseId: string): string =>
  `hhCourseListPageId:${courseId}`

/**
 * Checks if the course instance has a charge item code.
 * @param instanceId - The id of the course instance.
 * @returns true if the course instance has a charge item code or if we're unsure, false otherwise.
 */
export const doesCourseInstanceHaveChargeItemCode = (
  instanceId: string | undefined | null,
): boolean => {
  if (!instanceId) return true
  const cachedValue = cache.getItem(creatChargeItemCodeCacheKey(instanceId))
  if (cachedValue === 'true') return true
  if (cachedValue === 'false') return false
  return true
}

export const loadCourseSelectOptions = async ({
  apolloClient,
  application,
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

  const initialQuery = parseQueryParamValue(
    getValueViaPath<string>(application.answers, 'initialQuery', ''),
  )

  const queryItem = data.getCourseSelectOptions.items.find(
    (item) => item.id === initialQuery?.courseId,
  )

  return data.getCourseSelectOptions.items
    .filter((item) => {
      if (queryItem?.courseListPageId)
        return item.courseListPageId === queryItem?.courseListPageId
      return isCourseForProfessionals(application.answers)
        ? item.courseListPageId === COURSE_LIST_PAGE_ID_FOR_PROFESSIONALS
        : item.courseListPageId !== COURSE_LIST_PAGE_ID_FOR_PROFESSIONALS
    })
    .map((item) => ({
      value: item.id,
      label: item.title,
    }))
}

export const getCachedCourseListPageId = (
  courseId: string | undefined | null,
): string | null => {
  if (!courseId) return null
  return cache.getItem(createCourseListPageIdCacheKey(courseId)) ?? null
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

  if (data.getCourseById.course.courseListPageId) {
    cache.setItem(
      createCourseListPageIdCacheKey(courseId),
      data.getCourseById.course.courseListPageId,
    )
  }

  for (const instance of data.getCourseById.course.instances)
    cache.setItem(
      creatChargeItemCodeCacheKey(instance.id),
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
      label: `${formattedDate} ${startDateTimeDuration} ${
        instance.displayedTitle ? `- ${instance.displayedTitle}` : ''
      }`,
    }
  })
}
