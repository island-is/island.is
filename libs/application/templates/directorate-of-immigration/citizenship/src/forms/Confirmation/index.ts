import { buildForm, buildSection } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import {
  information,
  externalData,
  payment,
  confirmation,
  personal,
  supportingDocuments,
} from '../../lib/messages'
import { MinistryForForeignAffairsLogo } from '@island.is/application/assets/institution-logos'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'

export const Confirmation: Form = buildForm({
  id: 'ConfirmationForm',
  logo: MinistryForForeignAffairsLogo,
  mode: FormModes.COMPLETED,
  children: [
    buildSection({
      id: 'externalData',
      title: externalData.dataProvider.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'personal',
      title: personal.general.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'informationSection',
      title: information.general.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'supportingDocuments',
      title: supportingDocuments.general.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'payment',
      title: payment.general.sectionTitle,
      children: [],
    }),
    buildFormConclusionSection({
      alertTitle: confirmation.general.alertTitle,
      alertMessage: confirmation.general.alertMessage,
      expandableHeader: confirmation.general.accordionTitle,
      expandableDescription: confirmation.general.accordionText,
    }),
  ],
})
