import { buildForm, buildSection } from '@island.is/application/core'
import { Form, FormModes, Section } from '@island.is/application/types'
import { confirmation, externalData, payment } from '../../lib/messages'
import { InformationSection } from './InformationSection'
import { PersonalSection } from './PersonalSection'
import { ReviewSection } from './ReviewSection'
import { ChildrenSupportingDocumentsSection } from './ChildrenSupportingDocuments'
import { MinistryForForeignAffairsLogo } from '@island.is/application/assets/institution-logos'
import { MAX_CNT_APPLICANTS } from '../../shared'
import { SupportingDocumentsSection } from './SupportingDocumentsSection'
import { buildFormPaymentChargeOverviewSection } from '@island.is/application/ui-forms'
import { getChargeItems } from '../../utils'

const buildSupportingDocumentsSections = (): Section[] => {
  return [...Array(MAX_CNT_APPLICANTS)].map((_key, index) => {
    return ChildrenSupportingDocumentsSection(index)
  })
}

export const CitizenshipForm: Form = buildForm({
  id: 'CitizenshipFormDraft',
  logo: MinistryForForeignAffairsLogo,
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    buildSection({
      id: 'externalData',
      title: externalData.dataProvider.sectionTitle,
      children: [],
    }),
    PersonalSection,
    InformationSection,
    SupportingDocumentsSection,
    ...buildSupportingDocumentsSections(),
    ReviewSection,
    buildFormPaymentChargeOverviewSection({
      sectionTitle: payment.general.sectionTitle,
      getSelectedChargeItems: (_) =>
        getChargeItems().map((item) => ({
          chargeItemCode: item.code,
          chargeItemQuantity: item.quantity,
        })),
    }),
    buildSection({
      id: 'confirmation',
      title: confirmation.general.sectionTitle,
      children: [],
    }),
  ],
})
