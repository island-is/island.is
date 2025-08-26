import {
  buildSubSection,
  buildMultiField,
  buildTableRepeaterField,
  buildAlertMessageField,
} from '@island.is/application/core'
import {
  applicantTableConfig,
  applicantTableFields,
  hasDuplicateApplicants,
} from '../../../utils/utils'
import { Routes } from '../../../utils/enums'
import { landlordAndTenantDetails, tenantDetails } from '../../../lib/messages'
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
          fields: applicantTableFields,
          table: applicantTableConfig,
        }),
        buildTableRepeaterField({
          id: 'tenantInfo.representativeTable',
          title: landlordAndTenantDetails.representativeTableTitle,
          editField: true,
          marginTop: 6,
          maxRows: 10,
          fields: applicantTableFields,
          table: applicantTableConfig,
        }),
        buildAlertMessageField({
          id: 'tenantInfo.uniqueApplicantsError',
          alertType: 'error',
          title: tenantDetails.uniqueApplicantsError,
          shouldBlockInSetBeforeSubmitCallback: true,
          condition: (answers) => {
            const {
              landlords,
              tenants,
              landlordRepresentatives,
              tenantRepresentatives,
            } = applicationAnswers(answers)

            const allApplicants = [
              ...landlords,
              ...tenants,
              ...landlordRepresentatives,
              ...tenantRepresentatives,
            ]

            return hasDuplicateApplicants(allApplicants)
          },
        }),
      ],
    }),
  ],
})
