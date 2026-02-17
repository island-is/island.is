import type { Application } from '@island.is/application/types'
import {
  buildAsyncSelectField,
  buildHiddenInput,
  buildMultiField,
  buildSection,
  getValueViaPath,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { parseQueryParamValue } from '../../utils/parseQueryParamValue'
import {
  getInstanceHasChargeItemCode,
  loadCourseSelectOptions,
  loadDateSelectOptions,
} from '../../utils/loadOptions'
import { COURSE_HAS_CHARGE_ITEM_CODE } from '../../utils/constants'

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
          setOnChange: async (optionValue) => {
            const instanceId = optionValue as string
            const hasChargeItemCode =
              getInstanceHasChargeItemCode(instanceId) ?? true
            return [
              { key: COURSE_HAS_CHARGE_ITEM_CODE, value: hasChargeItemCode },
            ]
          },
        }),
        buildHiddenInput({
          id: COURSE_HAS_CHARGE_ITEM_CODE,
          defaultValue: true,
        }),
      ],
    }),
  ],
})
