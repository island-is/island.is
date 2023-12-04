import { buildForm, buildSection } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { LogreglanLogo } from '../../assets'
import { m } from '../../lib/messages'
import { subSectionTempInfo } from './subSectionTempInfo'
import { subSectionOtherCountry } from './subSectionOtherCountry'
import { subSectionOtherCountryDirections } from './subSectionOtherCountryDirections'
import { subSectionQualityPhoto } from './subSectionQualityPhoto'
import { subSectionDelivery } from './subSectionDelivery'
import { subSectionHealthDeclaration } from './subSectionHealthDeclaration'
import { subSectionSummary } from './subSectionSummary'
import { subSectionPhone } from './subSectionPhone'

export const draft: Form = buildForm({
  id: 'DrivingLicenseApplicationDraftForm',
  title: '',
  logo: LogreglanLogo,
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
        subSectionTempInfo,
        subSectionOtherCountry,
        subSectionOtherCountryDirections,
        subSectionQualityPhoto,
        subSectionDelivery,
        subSectionPhone,
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
      id: 'confim',
      title: m.overviewSectionTitle,
      children: [],
    }),
    buildSection({
      id: 'done',
      title: m.overviewDone,
      children: [],
    }),
  ],
})
