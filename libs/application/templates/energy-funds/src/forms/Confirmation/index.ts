import { buildForm, buildSection } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { externalData } from '../../lib/messages'
import { TheEnergyAgencyLogo } from '@island.is/application/assets/institution-logos'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { confirmation } from '../../lib/messages/confirmation'
import { information } from '../../lib/messages/information'
import { grant } from '../../lib/messages/grant'

export const Confirmation: Form = buildForm({
  id: 'ConfirmationForm',
  logo: TheEnergyAgencyLogo,
  mode: FormModes.COMPLETED,
  children: [
    buildSection({
      id: 'externalData',
      title: externalData.dataProvider.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'information',
      title: information.general.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'grant',
      title: grant.general.sectionTitle,
      children: [],
    }),
    buildFormConclusionSection({
      alertTitle: confirmation.general.alertTitle,
      expandableHeader: confirmation.general.accordionTitle,
      expandableDescription: confirmation.general.accordionText,
    }),
  ],
})
