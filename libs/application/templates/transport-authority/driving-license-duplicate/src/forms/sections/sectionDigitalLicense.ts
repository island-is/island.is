import {
  buildSection,
  buildMultiField,
  buildAlertMessageField,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { requirementsMet } from '../../lib/utils'

// Informational screen: the licence is issued digitally first (available in the
// Ísland.is app once processing completes), with the plastic card produced and
// posted to the applicant's legal domicile afterwards. Same notice and Contentful
// copy as the driving-license application (shared `dl.application:digitalLicense.*`
// ids). Shown once the applicant is eligible for a duplicate, matching the other
// happy-path sections.
export const sectionDigitalLicense = buildSection({
  id: 'digitalLicense',
  title: m.digitalLicenseSubSectionTitle,
  condition: (answers, externalData) => requirementsMet(answers, externalData),
  children: [
    buildMultiField({
      id: 'digitalLicenseInfo',
      title: m.digitalLicenseSubSectionTitle,
      children: [
        buildAlertMessageField({
          id: 'digitalLicenseAlert',
          title: m.digitalLicenseAlertTitle,
          message: m.digitalLicenseAlertMessage,
          alertType: 'info',
        }),
      ],
    }),
  ],
})
