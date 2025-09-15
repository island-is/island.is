import {
  YesOrNoEnum,
  buildMultiField,
  buildRadioField,
  buildTextField,
  buildTitleField,
  getValueViaPath,
} from '@island.is/application/core'
import * as m from '../../../../lib/messages'
import { SectionRouteEnum } from '../../../../types'
import { yesOrNoOptions } from '../../../../utils'

export const rehabilitationOrTherapyField = buildMultiField({
  id: SectionRouteEnum.BACKGROUND_INFO_REHABILITATION_OR_THERAPY,
  title: m.selfEvaluation.questionFormTitle,
  children: [
    buildRadioField({
      id: `${SectionRouteEnum.BACKGROUND_INFO_REHABILITATION_OR_THERAPY}.rehabilitationOrTherapy`,
      title:
        m.questions.rehabilitationOrTherapyTitle,
      options: yesOrNoOptions,
      required: true,
      width: 'half',
    }),
    buildTitleField({
      title:
        m.questions
          .rehabilitationOrTherapyDescription,
      titleVariant: 'h5',
      marginTop: 2,
      marginBottom: 0,
      condition: (formValue) => {
        const rehabOrTherapy = getValueViaPath<YesOrNoEnum>(
          formValue,
          `${SectionRouteEnum.BACKGROUND_INFO_REHABILITATION_OR_THERAPY}.rehabilitationOrTherapy`,
        )
        return rehabOrTherapy === YesOrNoEnum.YES
      },
    }),
    buildTextField({
      id: `${SectionRouteEnum.BACKGROUND_INFO_REHABILITATION_OR_THERAPY}.rehabilitationDescription`,
      condition: (formValue) => {
        const rehabOrTherapy = getValueViaPath<YesOrNoEnum>(
          formValue,
          `${SectionRouteEnum.BACKGROUND_INFO_REHABILITATION_OR_THERAPY}.rehabilitationOrTherapy`,
        )
        return rehabOrTherapy === YesOrNoEnum.YES
      },
      variant: 'textarea',
    }),
    buildTitleField({
      title:
        m.questions.rehabilitationOrTherapyResults,
      titleVariant: 'h5',
      marginTop: 2,
      marginBottom: 0,
      condition: (formValue) => {
        const rehabOrTherapy = getValueViaPath<YesOrNoEnum>(
          formValue,
          `${SectionRouteEnum.BACKGROUND_INFO_REHABILITATION_OR_THERAPY}.rehabilitationOrTherapy`,
        )
        return rehabOrTherapy === YesOrNoEnum.YES
      },
    }),
    buildTextField({
      id: `${SectionRouteEnum.BACKGROUND_INFO_REHABILITATION_OR_THERAPY}.rehabilitationResults`,
      condition: (formValue) => {
        const rehabOrTherapy = getValueViaPath<YesOrNoEnum>(
          formValue,
          `${SectionRouteEnum.BACKGROUND_INFO_REHABILITATION_OR_THERAPY}.rehabilitationOrTherapy`,
        )
        return rehabOrTherapy === YesOrNoEnum.YES
      },
      variant: 'textarea',
    }),
  ],
})
