import {
  buildDescriptionField,
  buildSection,
  buildMultiField,
  buildRadioField,
  buildTextField,
  getValueViaPath,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { JA, YES, NEI, NO, EstateTypes } from '../../lib/constants'
import { getWillsAndAgreementsDescriptionText } from '../../lib/utils'

export const testamentInfo = buildSection({
  id: 'testamentInfo',
  title: m.willsAndAgreements,
  children: [
    buildMultiField({
      id: 'testamentInfo',
      title: m.willsAndAgreements,
      description: (application) =>
        getWillsAndAgreementsDescriptionText(application),
      children: [
        buildRadioField({
          id: 'estate.testament.agreement',
          title: m.doesAgreementExist,
          largeButtons: false,
          width: 'half',
          options: [
            { value: YES, label: JA },
            { value: NO, label: NEI },
          ],
        }),
        buildRadioField({
          id: 'estate.testament.wills',
          title: m.doesWillExist,
          largeButtons: false,
          width: 'half',
          space: 2,
          options: [
            { value: YES, label: JA },
            { value: NO, label: NEI },
          ],
        }),
        buildRadioField({
          id: 'estate.testament.dividedEstate',
          title: m.doesPermissionToPostponeExist,
          largeButtons: false,
          width: 'half',
          space: 2,
          options: [
            { value: YES, label: JA },
            { value: NO, label: NEI },
          ],
          condition: (answers) =>
            getValueViaPath<string>(answers, 'estate.testament.wills') ===
              YES &&
            getValueViaPath<string>(answers, 'selectedEstate') ===
              EstateTypes.permitForUndividedEstate,
        }),
        buildDescriptionField({
          id: 'spaceTestamentInfo',
          title: '',
          marginBottom: 2,
        }),
        buildTextField({
          id: 'estate.testament.additionalInfo',
          title: m.additionalInfo,
          placeholder: m.additionalInfoPlaceholder,
          variant: 'textarea',
          rows: 7,
        }),
      ],
    }),
  ],
})
