import {
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildTableRepeaterField,
  getValueViaPath,
} from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import * as m from '../../lib/messages'
import { getHouseholdMembersForTable } from '../../utils/rentalAgreementUtils'
import { isFileUploaded, isHouseholdMemberUnder18 } from '../../utils/utils'

export const householdMembersSection = buildSection({
  id: 'householdMembersSection',
  title: m.draftMessages.householdMembersSection.title,
  condition: (answers: FormValue) =>
    !!getValueViaPath<string>(answers, 'rentalAgreement.answer'),
  children: [
    buildMultiField({
      id: 'householdMembersMultiField',
      title: m.draftMessages.householdMembersSection.multiFieldTitle,
      description:
        m.draftMessages.householdMembersSection.multiFieldDescription,
      children: [
        buildDescriptionField({
          id: 'householdMembersDescription',
          description: m.draftMessages.householdMembersSection.description,
          marginBottom: 2,
        }),
        buildDescriptionField({
          id: 'householdMembersDescription2',
          description: m.draftMessages.householdMembersSection.description2,
          marginBottom: 2,
        }),
        buildDescriptionField({
          id: 'householdMembersDescription3',
          description: m.draftMessages.householdMembersSection.description3,
          marginBottom: 2,
        }),
        buildDescriptionField({
          id: 'householdMembersDescription4',
          description: m.draftMessages.householdMembersSection.description4,
          marginBottom: 2,
        }),
        buildTableRepeaterField({
          id: 'householdMembersTableRepeater',
          title: m.draftMessages.householdMembersSection.tableRepeaterTitle,
          addItemButtonText:
            m.draftMessages.householdMembersSection.addMemberButton,
          editField: true,
          maxRows: 20,
          getStaticTableData: (application) =>
            getHouseholdMembersForTable(application),
          fields: {
            nationalIdWithName: {
              component: 'nationalIdWithName',
              label: m.draftMessages.householdMembersSection.nationalIdColumn,
              searchPersons: true,
              required: true,
            },
            file: {
              component: 'fileUpload',
              title:
                m.draftMessages.householdMembersSection
                  .custodyAgreementUploadTitle,
              introduction:
                m.draftMessages.householdMembersSection
                  .custodyAgreementUploadDescription,
              displayInTable: false,
              condition: isHouseholdMemberUnder18,
              required: true,
            },
          },
          table: {
            header: (answers) => {
              const fileUploaded = isFileUploaded(answers)
              const lastCol = fileUploaded
                ? [
                    m.draftMessages.householdMembersSection
                      .custodyAgreementUploadTitle,
                  ]
                : []
              return [
                m.draftMessages.householdMembersSection.nameColumn,
                m.draftMessages.householdMembersSection.nationalIdColumn,
                ...lastCol,
              ]
            },
            rows: (answers) => {
              const fileUploaded = isFileUploaded(answers)
              const lastCol = fileUploaded ? ['file'] : []
              return ['name', 'nationalId', ...lastCol]
            },
            format: {
              file: (value) => {
                const files = Array.isArray(value) ? value : []
                return files.length > 0 ? '✅ ' : ''
              },
            },
          },
        }),
      ],
    }),
  ],
})
