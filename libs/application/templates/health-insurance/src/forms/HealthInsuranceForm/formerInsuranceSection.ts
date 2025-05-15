import {
  buildAlertMessageField,
  buildDescriptionField,
  buildDividerField,
  buildFileUploadField,
  buildMultiField,
  buildRadioField,
  buildSection,
  buildSelectField,
  buildTextField,
} from '@island.is/application/core'
import { m } from '../../lib/messages/messages'
import { FormValue } from '@island.is/application/types'
import {
  requireConfirmationOfResidency,
  requireWaitingPeriod,
} from '../../healthInsuranceUtils'
import { FILE_SIZE_LIMIT } from '../../utils/constants'
import { countryOptions, getYesNoOptions } from '../../utils/options'
import {
  formerInsuranceCondition,
  getFormerCountryAndCitizenship,
} from '../../utils/getFormerCountryAndCitizenship'

export const formerInsuranceSection = buildSection({
  id: 'formerInsuranceSection',
  title: m.formerInsuranceSection,
  children: [
    buildMultiField({
      id: 'formerInsurance',
      title: m.formerInsuranceTitle,
      children: [
        buildRadioField({
          id: 'formerInsurance.registration',
          description: m.formerInsuranceRegistration,
          largeButtons: true,
          required: true,
          options: getYesNoOptions({ no: m.formerInsuranceNoOption }),
        }),
        buildSelectField({
          id: 'formerInsurance.country',
          title: m.formerInsuranceCountry,
          description: m.formerInsuranceDetails,
          placeholder: m.formerInsuranceCountryPlaceholder,
          required: true,
          backgroundColor: 'blue',
          options: countryOptions,
        }),
        buildTextField({
          id: 'formerInsurance.personalId',
          title: m.formerPersonalId,
          width: 'half',
          backgroundColor: 'blue',
          required: true,
        }),
        buildTextField({
          id: 'formerInsurance.institution',
          title: m.formerInsuranceInstitution,
          width: 'half',
          backgroundColor: 'blue',
          required: true,
        }),
        buildAlertMessageField({
          id: 'waitingPeriodInfo',
          title: m.waitingPeriodTitle,
          message: m.waitingPeriodDescription,
          alertType: 'error',
          condition: (answers: FormValue) => {
            const { formerCountry, citizenship } =
              getFormerCountryAndCitizenship(answers)
            return (
              !!formerCountry &&
              requireWaitingPeriod(formerCountry, citizenship)
            )
          },
        }),
        buildFileUploadField({
          id: 'formerInsurance.confirmationOfResidencyDocument',
          maxSize: FILE_SIZE_LIMIT,
          introduction: m.confirmationOfResidencyFileUpload,
          uploadHeader: m.fileUploadHeader,
          uploadDescription: m.fileUploadDescription,
          uploadButtonLabel: m.fileUploadButton,
          condition: (answers: FormValue) => {
            const { formerCountry } = getFormerCountryAndCitizenship(answers)
            return requireConfirmationOfResidency(formerCountry)
          },
        }),
        buildDividerField({
          marginTop: 5,
          useDividerLine: false,
        }),
        buildDescriptionField({
          id: 'formerInsurance.entitlementDescription',
          description: m.formerInsuranceEntitlement,
          tooltip: m.formerInsuranceEntitlementTooltip,
          condition: (answers: FormValue) => formerInsuranceCondition(answers),
        }),
        buildRadioField({
          id: 'formerInsurance.entitlement',
          width: 'half',
          largeButtons: true,
          options: getYesNoOptions({}),
          condition: (answers: FormValue) => formerInsuranceCondition(answers),
        }),
        buildTextField({
          id: 'formerInsurance.entitlementReason',
          title: m.formerInsuranceAdditionalInformation,
          placeholder: m.formerInsuranceAdditionalInformationPlaceholder,
          variant: 'textarea',
          rows: 4,
          backgroundColor: 'blue',
          condition: (answers: FormValue) => formerInsuranceCondition(answers),
        }),
      ],
    }),
  ],
})
