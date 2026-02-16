import type { Application } from '@island.is/application/types'
import {
  buildAsyncSelectField,
  buildCustomField,
  buildMultiField,
  buildSection,
  getValueViaPath,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { parseQueryParamValue } from '../../utils/parseQueryParamValue'
import {
  loadCourseSelectOptions,
  loadDateSelectOptions,
} from '../../utils/loadOptions'

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
          loadOptions: loadCourseSelectOptions,
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
          loadOptions: loadDateSelectOptions,
        }),
        buildCustomField({
          id: 'chargeItemCodeWatcher',
          component: 'ChargeItemCodeWatcher',
          doesNotRequireAnswer: true,
        }),
      ],
    }),
  ],
})
