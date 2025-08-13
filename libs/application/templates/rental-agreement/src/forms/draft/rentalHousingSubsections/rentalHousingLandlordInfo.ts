import {
  buildSubSection,
  buildMultiField,
  buildTableRepeaterField,
  buildAlertMessageField,
} from '@island.is/application/core'
import {
  applicantTableConfig,
  applicantTableFields,
  hasAnyMatchingNationalId,
  hasDuplicateApplicants,
} from '../../../utils/utils'
import { Routes } from '../../../utils/enums'
import {
  landlordAndTenantDetails,
  landlordDetails,
} from '../../../lib/messages'
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
          title: landlordDetails.tableTitle,
          editField: true,
          marginTop: 1,
          maxRows: 10,
          fields: applicantTableFields,
          table: applicantTableConfig,
        }),
        buildTableRepeaterField({
          id: 'landlordInfo.representativeTable',
          title: landlordAndTenantDetails.representativeTableTitle,
          editField: true,
          marginTop: 6,
          maxRows: 10,
          fields: applicantTableFields,
          table: applicantTableConfig,
        }),
        buildAlertMessageField({
          id: 'landlordInfo.onlyRepresentativeError',
          alertType: 'error',
          title: landlordDetails.landlordOnlyRepresentativeTableError,
          shouldBlockInSetBeforeSubmitCallback: true,
          condition: (answers) => {
            const { landlords, landlordRepresentatives } =
              applicationAnswers(answers)

            return landlordRepresentatives.length > 0 && landlords.length === 0
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
