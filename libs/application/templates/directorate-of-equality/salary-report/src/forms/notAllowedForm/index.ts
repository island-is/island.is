import {
  buildForm,
  buildImageField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { isCompany } from 'kennitala'
import { GuitarAndWheelchair } from '@island.is/application/assets/graphics'
import { DirectorateOfEqualityLogo } from '@island.is/application/assets/institution-logos'
import { messages } from '../../lib/messages'

// This form renders for two different rejection reasons: mapUserToRole sends
// non-company applicants here directly (no externalData fetched yet), while
// company applicants without an active equality report are sent here by the
// PREREQUISITES state guard. isCompany(application.applicant) is what tells
// the two apart, since it's available in both cases.
const notAllowedTitle = (application: Application) =>
  isCompany(application.applicant)
    ? messages.notAllowed.title
    : messages.notAllowed.notCompanyTitle

const notAllowedDescription = (application: Application) =>
  isCompany(application.applicant)
    ? messages.notAllowed.description
    : messages.notAllowed.notCompanyDescription

export const NotAllowedForm = buildForm({
  id: 'NotAllowedForm',
  logo: DirectorateOfEqualityLogo,
  children: [
    buildSection({
      id: 'notAllowedSection',
      tabTitle: messages.notAllowed.title,
      children: [
        buildMultiField({
          id: 'notAllowedMultiField',
          title: notAllowedTitle,
          description: notAllowedDescription,
          children: [
            buildImageField({
              id: 'notAllowedImage',
              image: GuitarAndWheelchair,
              alt: '',
              imageWidth: 'auto',
              imagePosition: 'center',
            }),
          ],
        }),
      ],
    }),
  ],
})
