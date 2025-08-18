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
          id: 'landlordInfo.uniqueApplicantsError',
          alertType: 'error',
          title: landlordDetails.uniqueApplicantsError,
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
