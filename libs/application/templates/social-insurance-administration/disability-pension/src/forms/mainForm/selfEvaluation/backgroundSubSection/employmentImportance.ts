import { buildMultiField, buildRadioField } from '@island.is/application/core'
import * as m from '../../../../lib/messages'
import { SectionRouteEnum } from '../../../../types/routes'
import { generateEmploymentImportanceOptions } from '../../../../utils/options'

export const employmentImportanceField = buildMultiField({
  id: SectionRouteEnum.BACKGROUND_INFO_EMPLOYMENT_IMPORTANCE,
  title: m.selfEvaluation.questionFormTitle,
  children: [
    buildRadioField({
      id: `${SectionRouteEnum.BACKGROUND_INFO_EMPLOYMENT_IMPORTANCE}.importance`,
      title: m.questions.employmentImportanceTitle,
      options: generateEmploymentImportanceOptions(m),
    }),
  ],
})
