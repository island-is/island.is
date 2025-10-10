import {
  buildFieldsRepeaterField,
  buildMultiField,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import { applicant as applicantMessages } from '../../../lib/messages'
import {
  ApplicantChildCustodyInformation,
  Application,
  ExternalData,
} from '@island.is/application/types'

export const familyInformationSubSection = buildSubSection({
  id: 'familyInformationSubSection',
  title: applicantMessages.familyInformation.sectionTitle,
  children: [
    buildMultiField({
      id: 'familyInformationSubSection',
      title: applicantMessages.familyInformation.pageTitle,
      children: [
        buildFieldsRepeaterField({
          id: 'familyInformation.children',
          minRows: (_, externalData: ExternalData) => {
            const children =
              getValueViaPath<ApplicantChildCustodyInformation[]>(
                externalData,
                'childrenCustodyInformation.data',
              ) ?? []

            return children.length
          },
          title: applicantMessages.labels.dependentChildren,
          titleVariant: 'h5',
          marginTop: 0,
          formTitleNumbering: 'none',
          hideAddButton: true,
          fields: {
            name: {
              label: applicantMessages.labels.childName,
              type: 'text',
              readonly: true,
              component: 'input',
              width: 'half',
              defaultValue: (
                application: Application,
                _activeField: Record<string, string>,
                index: number,
              ) => {
                const children =
                  getValueViaPath<ApplicantChildCustodyInformation[]>(
                    application.externalData,
                    'childrenCustodyInformation.data',
                  ) ?? []
                return children[index]?.fullName ?? ''
              },
            },
            nationalId: {
              label: applicantMessages.labels.childNationalId,
              type: 'text',
              format: '######-####',
              readonly: true,
              component: 'input',
              width: 'half',
              defaultValue: (
                application: Application,
                _activeField: Record<string, string>,
                index: number,
              ) => {
                const children =
                  getValueViaPath<ApplicantChildCustodyInformation[]>(
                    application.externalData,
                    'childrenCustodyInformation.data',
                  ) ?? []
                return children[index]?.nationalId ?? ''
              },
            },
          },
        }),
        buildFieldsRepeaterField({
          id: 'familyInformation.additionalChildren',
          minRows: 0,
          title: applicantMessages.labels.moreDependentChildren,
          titleVariant: 'h5',
          description:
            applicantMessages.labels.moreDependentChildrenDescription,
          marginTop: 4,
          formTitleNumbering: 'none',
          addItemButtonText:
            applicantMessages.labels.moreDependentChildrenButton,
          fields: {
            child: {
              customNationalIdLabel: applicantMessages.labels.childNationalId,
              customNameLabel: applicantMessages.labels.childName,
              component: 'nationalIdWithName',
            },
          },
        }),
      ],
    }),
  ],
})
