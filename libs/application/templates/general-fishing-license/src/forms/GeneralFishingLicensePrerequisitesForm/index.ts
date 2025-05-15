import { buildForm, buildSection } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import {
  applicantInformation,
  conclusion,
  fishingLicense,
  overview,
  payment,
  shipSelection,
  fishingLicenseFurtherInformation,
} from '../../lib/messages'
import { externalDataSection } from './externalDataSection'

export const GeneralFishingLicensePrerequisitesForm: Form = buildForm({
  id: 'GeneralFishingLicensePrerequisitesForm',
  mode: FormModes.DRAFT,
  renderLastScreenButton: false,
  children: [
    externalDataSection,
    buildSection({
      id: 'applicantInformationSection',
      title: applicantInformation.general.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'shipSelectionSection',
      title: shipSelection.general.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'fishingLicenseSection',
      title: fishingLicense.general.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'fishingLicenseFurtherInformationSection',
      title: fishingLicenseFurtherInformation.general.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'overviewSection',
      title: overview.general.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'awaitingPayment',
      title: payment.general.sectionTitle,
      children: [],
    }),
    buildFormConclusionSection({
      alertTitle: conclusion.general.title,
      expandableHeader: conclusion.information.title,
      expandableDescription: conclusion.information.bulletList,
    }),
  ],
})
