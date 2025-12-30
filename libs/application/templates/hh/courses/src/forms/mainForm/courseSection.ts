import format from 'date-fns/format'
import parseISO from 'date-fns/parseISO'
import is from 'date-fns/locale/is'
import type {
  Query,
  QueryGetCourseByIdArgs,
  QueryGetCourseSelectOptionsArgs,
} from '@island.is/api/schema'
import type { Application } from '@island.is/application/types'
import {
  buildAsyncSelectField,
  buildMultiField,
  buildSection,
  getValueViaPath,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import {
  GET_COURSE_BY_ID_QUERY,
  GET_COURSE_SELECT_OPTIONS_QUERY,
} from '../../graphql'
import { parseQueryParamValue } from '../../utils/parseQueryParamValue'

const QUERY_PARAM_KEY = 'initialQuery'

export const courseSection = buildSection({
  id: 'courseSection',
  title: m.course.sectionTitle,
  children: [
    buildMultiField({
      id: 'courseSectionMultiField',
      title: m.course.sectionTitle,
      children: [
        buildAsyncSelectField({
          id: 'courseSelect',
          title: m.course.courseSelectTitle,
          required: true,
          clearOnChange: ['dateSelect'],
          defaultValue: (application: Application) => {
            const value = getValueViaPath<string>(
              application.answers,
              QUERY_PARAM_KEY,
              '',
            )
            return parseQueryParamValue(value)?.courseId
          },
          loadOptions: async ({ apolloClient }) => {
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
          },
        }),
        buildAsyncSelectField({
          id: 'dateSelect',
          title: m.course.dateSelectTitle,
          required: true,
          isSearchable: false,
          updateOnSelect: ['courseSelect'],
          defaultValue: (application: Application) => {
            const value = getValueViaPath<string>(
              application.answers,
              QUERY_PARAM_KEY,
              '',
            )
            return parseQueryParamValue(value)?.courseInstanceId
          },
          loadOptions: async ({ apolloClient, selectedValues }) => {
            const courseId = selectedValues?.[0]
            if (!courseId) return []

            const { data } = await apolloClient.query<
              Query,
              QueryGetCourseByIdArgs
            >({
              query: GET_COURSE_BY_ID_QUERY,
              variables: {
                input: {
                  id: courseId,
                  lang: 'is',
                },
              },
            })
            if (!data?.getCourseById) return []

            return data.getCourseById.instances.map((instance) => {
              const formattedDate = format(
                parseISO(instance.startDate),
                'd. MMMM yyyy',
                {
                  locale: is,
                },
              )

              const startDateTimeDuration = instance.startDateTimeDuration
                ?.startTime
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
          },
        }),
      ],
    }),
  ],
})
