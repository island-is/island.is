import {
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import { userInformation } from '../../../lib/messages'
import { applicantInformationMultiField } from '@island.is/application/ui-forms'
import { ApplicationType, Routes, Student } from '../../../utils'
import { Application } from '@island.is/application/types'

export const personalSubSection = buildSubSection({
  id: 'personalSubSection',
  title: userInformation.applicant.subSectionTitle,
  children: [
    buildMultiField({
      id: Routes.PERSONAL,
      title: userInformation.applicant.pageTitle,
      description: userInformation.applicant.description,
      children: [
        buildDescriptionField({
          id: 'applicantInfo.subtitle',
          title: userInformation.applicant.subtitle,
          titleVariant: 'h5',
        }),
        ...applicantInformationMultiField({
          emailRequired: true,
          phoneRequired: true,
          readOnly: true,
        }).children,
        buildDescriptionField({
          id: 'applicationTypeInfo.subtitle',
          title: userInformation.applicationType.subtitle,
          titleVariant: 'h5',
          space: 3,
        }),
        buildRadioField({
          title: '',
          id: 'applicationType',
          options: [
            {
              value: ApplicationType.FRESHMAN,
              label: userInformation.applicationType.freshmanOptionTitle,
            },
            {
              value: ApplicationType.GENERAL_APPLICATION,
              label:
                userInformation.applicationType.generalApplicationOptionTitle,
            },
          ],
          defaultValue: (application: Application) => {
            const studentInfo = getValueViaPath<Student>(
              application.externalData,
              'studentInfo.data',
            )
            if (studentInfo?.isFreshman) return ApplicationType.FRESHMAN
          },
          width: 'full',
        }),
      ],
    }),
  ],
})
