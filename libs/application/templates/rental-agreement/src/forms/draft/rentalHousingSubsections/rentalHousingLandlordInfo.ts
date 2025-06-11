import {
  buildSubSection,
  buildMultiField,
  buildTableRepeaterField,
  buildAlertMessageField,
} from '@island.is/application/core'
import {
  formatNationalId,
  formatPhoneNumber,
  hasAnyMatchingNationalId,
  IS_REPRESENTATIVE,
  hasDuplicateApplicants,
} from '../../../utils/utils'
import { Routes } from '../../../utils/enums'
import { landlordDetails } from '../../../lib/messages'
import { applicationAnswers } from '../../../shared'

export const RentalHousingLandlordInfo = buildSubSection({
  id: Routes.LANDLORDINFORMATION,
  title: landlordDetails.subSectionName,
  children: [
    buildMultiField({
      id: Routes.LANDLORDINFORMATION,
      title: landlordDetails.pageTitle,
      description: landlordDetails.pageDescription,
      children: [
        buildTableRepeaterField({
          id: 'landlordInfo.table',
          editField: true,
          marginTop: 1,
          maxRows: 10,
          fields: {
            nationalIdWithName: {
              component: 'nationalIdWithName',
              required: true,
              searchCompanies: true,
            },
            phone: {
              component: 'phone',
              required: true,
              label: landlordDetails.phoneInputLabel,
              enableCountrySelector: true,
              width: 'half',
            },
            email: {
              component: 'input',
              required: true,
              label: landlordDetails.emailInputLabel,
              type: 'email',
              width: 'half',
            },
            address: {
              component: 'input',
              required: true,
              label: landlordDetails.addressInputLabel,
              maxLength: 100,
            },
            isRepresentative: {
              component: 'checkbox',
              large: true,
              options: [
                {
                  label: landlordDetails.representativeLabel,
                  value: IS_REPRESENTATIVE,
                },
              ],
            },
          },
          table: {
            format: {
              phone: (value) => value && formatPhoneNumber(value),
              nationalId: (value) => value && formatNationalId(value),
              isRepresentative: (value) =>
                value?.includes(IS_REPRESENTATIVE) ? '✅' : '',
            },
            header: [
              landlordDetails.nameInputLabel,
              landlordDetails.phoneInputLabel,
              landlordDetails.nationalIdHeaderLabel,
              landlordDetails.emailInputLabel,
              landlordDetails.isRepresentative,
            ],
            rows: ['name', 'phone', 'nationalId', 'email', 'isRepresentative'],
          },
        }),
        buildAlertMessageField({
          id: 'landlordInfo.onlyRepresentativeError',
          alertType: 'error',
          title: landlordDetails.landlordOnlyRepresentativeTableError,
          shouldBlockInSetBeforeSubmitCallback: true,
          condition: (answers) => {
            const { landlords } = applicationAnswers(answers)
            const filterNonRepresentatives =
              landlords?.filter(
                (tenant) =>
                  !tenant.isRepresentative?.includes(IS_REPRESENTATIVE),
              ) ?? []

            return landlords.length > 0 && filterNonRepresentatives.length === 0
          },
        }),
        buildAlertMessageField({
          id: 'landlordInfo.landlordSameAsTenantError',
          alertType: 'warning',
          title: landlordDetails.landlordSameAsTenantError,
          condition: (answers) => {
            const { tenants, landlords } = applicationAnswers(answers)

            const tenantNationalIds =
              tenants?.map((tenant) => tenant.nationalIdWithName.nationalId) ??
              []

            return hasAnyMatchingNationalId(tenantNationalIds, landlords)
          },
        }),
        buildAlertMessageField({
          id: 'landlordInfo.landlordAlreadyExistsError',
          alertType: 'warning',
          title: landlordDetails.landlordAlreadyExistsError,
          condition: (answers) => {
            const { landlords } = applicationAnswers(answers)

            if (landlords.length === 0 || landlords.length === 1) {
              return false
            }

            return hasDuplicateApplicants(landlords)
          },
        }),
      ],
    }),
  ],
})
