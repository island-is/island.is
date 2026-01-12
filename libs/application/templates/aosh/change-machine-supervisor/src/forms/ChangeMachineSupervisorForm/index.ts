import { buildForm, buildSection } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { informationSection } from './InformationSection'
import { AoshLogo } from '@island.is/application/assets/institution-logos'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { conclusion, externalData } from '../../lib/messages'

export const TransferOfMachineOwnershipForm: Form = buildForm({
  id: 'TransferOfMachineOwnershipFormDraft',
  logo: AoshLogo,
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    buildSection({
      id: 'externalData',
      title: externalData.dataProvider.sectionTitle,
      children: [],
    }),
    informationSection,
    buildFormConclusionSection({
      sectionTitle: conclusion.general.sectionTitle,
      multiFieldTitle: conclusion.general.title,
      alertTitle: conclusion.default.accordionTitle,
      alertMessage: conclusion.default.alertMessage,
      expandableHeader: conclusion.default.accordionTitle,
      expandableDescription: conclusion.default.accordionText,
    }),
  ],
})
