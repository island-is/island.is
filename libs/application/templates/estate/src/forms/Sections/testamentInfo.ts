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
import {
  getWillsAndAgreementsDescriptionText,
  getEstateDataFromApplication,
} from '../../lib/utils'
import { Application } from '@island.is/application/types'

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
          largeButtons: true,
          width: 'half',
          defaultValue: (application: Application) => {
            const marriageSettlement =
              getEstateDataFromApplication(application)?.estate
                ?.marriageSettlement

            // Only prefill if API has a value (not null/undefined)
            if (marriageSettlement === true) return YES
            if (marriageSettlement === false) return NO

            // If marriageSettlement is null/undefined, user must answer
            return ''
          },
          options: [
            { value: YES, label: JA },
            { value: NO, label: NEI },
          ],
        }),
        buildRadioField({
          id: 'estate.testament.wills',
          title: m.doesWillExist,
          largeButtons: true,
          width: 'half',
          space: 2,
          defaultValue: (application: Application) => {
            const districtCommissionerHasWill =
              getEstateDataFromApplication(application)?.estate
                ?.districtCommissionerHasWill

            // Only prefill if API has a value (not null/undefined)
            if (districtCommissionerHasWill === true) return YES
            if (districtCommissionerHasWill === false) return NO

            // If districtCommissionerHasWill is null/undefined, user must answer
            return ''
          },
          options: [
            { value: YES, label: JA },
            { value: NO, label: NEI },
          ],
        }),
        buildRadioField({
          id: 'estate.testament.knowledgeOfOtherWills',
          title: m.knowledgeOfOtherWills,
          largeButtons: true,
          width: 'half',
          space: 2,
          defaultValue: (application: Application) => {
            const knowledgeOfOtherWills =
              getEstateDataFromApplication(application)?.estate
                ?.knowledgeOfOtherWills

            // Only prefill if API has a value (not null/undefined)
            if (knowledgeOfOtherWills === 'Yes') return YES
            if (knowledgeOfOtherWills === 'No') return NO

            // If knowledgeOfOtherWills is null/undefined, user must answer
            return ''
          },
          options: [
            { value: YES, label: JA },
            { value: NO, label: NEI },
          ],
        }),
        buildRadioField({
          id: 'estate.testament.dividedEstate',
          title: m.doesPermissionToPostponeExist,
          largeButtons: true,
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
          marginBottom: 2,
        }),
        buildTextField({
          id: 'estate.testament.additionalInfo',
          title: m.additionalInfo,
          placeholder: m.additionalInfoPlaceholder,
          variant: 'textarea',
          rows: 5,
        }),
      ],
    }),
  ],
})
