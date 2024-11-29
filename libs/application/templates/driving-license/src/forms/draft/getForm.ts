import { buildForm, buildSection } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { Logo } from '../../assets'
import { m } from '../../lib/messages'
import { subSectionApplicantInfo } from './subSectionApplicantInfo'
import { subSectionOtherCountry } from './subSectionOtherCountry'
import { subSectionOtherCountryDirections } from './subSectionOtherCountryDirections'
import { subSectionQualityPhoto } from './subSectionQualityPhoto'
import { subSectionDelivery } from './subSectionDelivery'
import { subSectionHealthDeclaration } from './subSectionHealthDeclaration'
import { subSectionSummary } from './subSectionSummary'

export const draft: Form = buildForm({
  id: 'DrivingLicenseApplicationDraftForm',
  title: '',
  logo: Logo,
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    buildSection({
      id: 'externalData',
      title: m.externalDataSection,
      children: [],
    }),
    buildSection({
      id: 'info',
      title: m.informationTitle,
      children: [
        subSectionApplicantInfo,

        /* Check for foreign driving certificates - Temporary License */
        subSectionOtherCountry,
        subSectionOtherCountryDirections,
        /* ----------------------------------------------- */

        subSectionQualityPhoto,
        subSectionDelivery,
        subSectionHealthDeclaration,
        subSectionSummary,
      ],
    }),
    buildSection({
      id: 'payment',
      title: m.overviewPaymentCharge,
      children: [],
    }),
    buildSection({
      id: 'done',
      title: m.applicationDone,
      children: [],
    }),
  ],
})
