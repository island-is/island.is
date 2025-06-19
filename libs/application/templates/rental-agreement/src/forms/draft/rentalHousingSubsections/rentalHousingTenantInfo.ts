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
  hasDuplicateApplicants,
} from '../../../utils/utils'
import { Routes } from '../../../utils/enums'
import { tenantDetails } from '../../../lib/messages'
import { applicationAnswers } from '../../../shared'

export const RentalHousingTenantInfo = buildSubSection({
  id: Routes.TENANTINFORMATION,
  title: tenantDetails.subSectionName,
  children: [
    buildMultiField({
      id: Routes.TENANTINFORMATION,
      title: tenantDetails.pageTitle,
      description: tenantDetails.pageDescription,
      children: [
        buildTableRepeaterField({
          id: 'tenantInfo.table',
          title: tenantDetails.tableTitle,
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
              label: tenantDetails.phoneInputLabel,
              enableCountrySelector: true,
              width: 'half',
            },
            email: {
              component: 'input',
              required: true,
              label: tenantDetails.emailInputLabel,
              type: 'email',
              width: 'half',
            },
            address: {
              component: 'input',
              required: true,
              label: tenantDetails.addressInputLabel,
              maxLength: 100,
            },
          },
          table: {
            format: {
              phone: (value) => value && formatPhoneNumber(value),
              nationalId: (value) => value && formatNationalId(value),
            },
            header: [
              tenantDetails.nameInputLabel,
              tenantDetails.phoneInputLabel,
              tenantDetails.nationalIdHeaderLabel,
              tenantDetails.emailInputLabel,
            ],
            rows: ['name', 'phone', 'nationalId', 'email'],
          },
        }),
        buildTableRepeaterField({
          id: 'tenantInfo.representativeTable',
          title: tenantDetails.representativeTableTitle,
          editField: true,
          marginTop: 6,
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
              label: tenantDetails.phoneInputLabel,
              enableCountrySelector: true,
              width: 'half',
            },
            email: {
              component: 'input',
              required: true,
              label: tenantDetails.emailInputLabel,
              type: 'email',
              width: 'half',
            },
            address: {
              component: 'input',
              required: true,
              label: tenantDetails.addressInputLabel,
              maxLength: 100,
            },
          },
          table: {
            format: {
              phone: (value) => value && formatPhoneNumber(value),
              nationalId: (value) => value && formatNationalId(value),
            },
            header: [
              tenantDetails.nameInputLabel,
              tenantDetails.phoneInputLabel,
              tenantDetails.nationalIdHeaderLabel,
              tenantDetails.emailInputLabel,
            ],
            rows: ['name', 'phone', 'nationalId', 'email'],
          },
        }),
        buildAlertMessageField({
          id: 'tenantInfo.onlyRepresentativeError',
          alertType: 'error',
          title: tenantDetails.tenantOnlyRepresentativeTableError,
          shouldBlockInSetBeforeSubmitCallback: true,
          condition: (answers) => {
            const { tenants, tenantRepresentatives } =
              applicationAnswers(answers)

            return tenantRepresentatives.length > 0 && tenants.length === 0
          },
        }),
        buildAlertMessageField({
          id: 'tenantInfo.tenantSameAsLandlordError',
          alertType: 'warning',
          title: tenantDetails.sameTenantLandlordError,
          condition: (answers) => {
            const { tenants, landlords } = applicationAnswers(answers)

            const landlordsNationalIds =
              landlords?.map(
                (landlord) => landlord.nationalIdWithName.nationalId,
              ) ?? []

            return hasAnyMatchingNationalId(landlordsNationalIds, tenants)
          },
        }),
        buildAlertMessageField({
          id: 'tenantInfo.tenantAlreadyExistsError',
          alertType: 'warning',
          title: tenantDetails.tenantAlreadyExistsError,
          condition: (answers) => {
            const { tenants } = applicationAnswers(answers)

            if (tenants.length === 0 || tenants.length === 1) {
              return false
            }

            return hasDuplicateApplicants(tenants)
          },
        }),
      ],
    }),
  ],
})
