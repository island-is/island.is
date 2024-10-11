import {
  buildMultiField,
  buildRadioField,
  buildSubSection,
} from '@island.is/application/core'
import { accidentType } from '../../../lib/messages'
import { isStudiesAccident } from '../../../utils'
import { StudiesAccidentTypeEnum } from '../../../types'

export const studiesAccidentSubSection = buildSubSection({
  id: 'studiesAccident.subSection',
  title: accidentType.workAccidentType.subSectionTitle,
  condition: (formValue) => isStudiesAccident(formValue),
  children: [
    buildMultiField({
      id: 'studiesAccident.section',
      title: accidentType.studiesAccidentType.heading,
      description: accidentType.studiesAccidentType.description,
      children: [
        buildRadioField({
          id: 'studiesAccident.type',
          title: '',
          options: [
            {
              value: StudiesAccidentTypeEnum.INTERNSHIP,
              label: accidentType.studiesAccidentType.internship,
            },
            {
              value: StudiesAccidentTypeEnum.APPRENTICESHIP,
              label: accidentType.studiesAccidentType.apprenticeship,
            },
            {
              value: StudiesAccidentTypeEnum.VOCATIONALEDUCATION,
              label: accidentType.studiesAccidentType.vocationalEducation,
            },
          ],
        }),
      ],
    }),
  ],
})
