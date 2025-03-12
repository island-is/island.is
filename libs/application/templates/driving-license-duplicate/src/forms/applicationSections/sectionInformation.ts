import {
  buildSection,
  buildMultiField,
  buildTextField,
  buildCustomField,
  buildDescriptionField,
} from '@island.is/application/core'
import {
  Application,
  NationalRegistryIndividual,
} from '@island.is/application/types'
import { format as formatNationalId } from 'kennitala'
import { m } from '../../lib/messages'
import { requirementsMet } from '../../lib/utils'

export const sectionInformation = buildSection({
  id: 'applicantInformation',
  title: m.informationTitle,
  children: [
    buildMultiField({
      id: 'applicantInformation',
      title: m.informationTitle,
      description: m.informationSubtitle,
      condition: (answers, externalData) =>
        requirementsMet(answers, externalData),
      children: [
        buildDescriptionField({
          id: 'applicant',
          title: m.applicantTitle,
          titleVariant: 'h4',
        }),
        buildTextField({
          id: 'name',
          title: m.applicantsName,
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) => {
            const nationalRegistry = application.externalData.nationalRegistry
              .data as NationalRegistryIndividual
            return nationalRegistry.fullName
          },
        }),
        buildTextField({
          id: 'nationalId',
          title: m.applicantsNationalId,
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) =>
            formatNationalId(application.applicant),
        }),
        buildCustomField({
          id: 'categories',
          component: 'CurrentLicense',
        }),
      ],
    }),
    buildCustomField({
      condition: (answers, externalData) =>
        !requirementsMet(answers, externalData),
      title: 'SubmitAndDecline',
      component: 'SubmitAndDecline',
      id: 'SubmitAndDecline',
    }),
  ],
})
