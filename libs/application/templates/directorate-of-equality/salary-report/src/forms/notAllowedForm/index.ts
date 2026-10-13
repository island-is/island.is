import {
  buildForm,
  buildImageField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { Application, StaticText } from '@island.is/application/types'
import { isCompany } from 'kennitala'
import { GuitarAndWheelchair } from '@island.is/application/assets/graphics'
import { DirectorateOfEqualityLogo } from '@island.is/application/assets/institution-logos'
import { messages } from '../../lib/messages'

// This form renders for two different rejection reasons. mapUserToRole sends
// non-company applicants here directly (no externalData fetched yet), which
// isCompany(application.applicant) is what tells apart — it is available in
// every case. The other is DMR's one remaining refusal: the company owes a
// jafnréttisáætlun.
//
// A third case falls through without a message of its own: a third party who
// opens someone else's application is routed here by mapUserToRole, but
// `applicant` is still the company, so isCompany is true and they are told
// about the jafnréttisáætlun rather than to sign in on a company's behalf.
// Pre-existing, and left alone on purpose — telling the two apart needs the
// caller's own id, which this form is not given, and deciding what a stranger
// should be told is a product question.
const notAllowedTitle = (application: Application): StaticText =>
  isCompany(application.applicant)
    ? messages.notAllowed.title
    : messages.notAllowed.notCompanyTitle

const notAllowedDescription = (application: Application): StaticText =>
  isCompany(application.applicant)
    ? messages.notAllowed.description
    : messages.notAllowed.notCompanyDescription

export const NotAllowedForm = buildForm({
  id: 'NotAllowedForm',
  logo: DirectorateOfEqualityLogo,
  children: [
    buildSection({
      id: 'notAllowedSection',
      tabTitle: notAllowedTitle,
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
