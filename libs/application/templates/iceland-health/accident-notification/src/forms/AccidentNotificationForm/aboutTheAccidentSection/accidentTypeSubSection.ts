import { buildRadioField, buildSubSection } from '@island.is/application/core'
import { accidentType } from '../../../lib/messages'
import { getAccidentTypeOptions } from '../../../utils/getOptions'

export const accidentTypeSubSection = buildSubSection({
  id: 'accidentType.section',
  title: accidentType.general.subsectionTitle,
  children: [
    buildRadioField({
      id: 'accidentType.radioButton',
      width: 'half',
      title: accidentType.general.heading,
      description: accidentType.general.description,
      options: (formValue) => getAccidentTypeOptions(formValue.answers),
    }),
  ],
})
