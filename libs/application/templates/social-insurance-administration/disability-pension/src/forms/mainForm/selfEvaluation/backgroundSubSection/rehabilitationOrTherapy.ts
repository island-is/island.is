import {
  YesOrNoEnum,
  buildMultiField,
  buildRadioField,
  buildTextField,
  buildTitleField,
} from '@island.is/application/core'
import * as m from '../../../../lib/messages'
import { SectionRouteEnum } from '../../../../types/routes'
import { getApplicationAnswers, yesOrNoOptions } from '../../../../utils'

export const rehabilitationOrTherapyField = buildMultiField({
  id: SectionRouteEnum.BACKGROUND_INFO_REHABILITATION_OR_THERAPY,
  title: m.selfEvaluation.questionFormTitle,
  children: [
    buildRadioField({
      id: `${SectionRouteEnum.BACKGROUND_INFO_REHABILITATION_OR_THERAPY}.rehabilitationOrTherapy`,
      title: m.questions.rehabilitationOrTherapyTitle,
      options: yesOrNoOptions,
      required: true,
      width: 'half',
    }),
    buildTitleField({
      title: m.questions.rehabilitationOrTherapyDescription,
      titleVariant: 'h5',
      marginTop: 2,
      marginBottom: 0,
      condition: (formValue) => {
        const { hasHadRehabilitationOrTherapy } =
          getApplicationAnswers(formValue)
        return hasHadRehabilitationOrTherapy === YesOrNoEnum.YES
      },
    }),
    buildTextField({
      id: `${SectionRouteEnum.BACKGROUND_INFO_REHABILITATION_OR_THERAPY}.rehabilitationDescription`,
      condition: (formValue) => {
        const { hasHadRehabilitationOrTherapy } =
          getApplicationAnswers(formValue)
        return hasHadRehabilitationOrTherapy === YesOrNoEnum.YES
      },
      variant: 'textarea',
      rows: 6,
    }),
    buildTitleField({
      title: m.questions.rehabilitationOrTherapyResults,
      titleVariant: 'h5',
      marginTop: 2,
      marginBottom: 0,
      condition: (formValue) => {
        const { hasHadRehabilitationOrTherapy } =
          getApplicationAnswers(formValue)
        return hasHadRehabilitationOrTherapy === YesOrNoEnum.YES
      },
    }),
    buildTextField({
      id: `${SectionRouteEnum.BACKGROUND_INFO_REHABILITATION_OR_THERAPY}.rehabilitationResults`,
      condition: (formValue) => {
        const { hasHadRehabilitationOrTherapy } =
          getApplicationAnswers(formValue)
        return hasHadRehabilitationOrTherapy === YesOrNoEnum.YES
      },
      rows: 6,
      variant: 'textarea',
    }),
  ],
})
