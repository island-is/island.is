import { defineMessages } from 'react-intl'

export const assigneeApproval = defineMessages({
  title: {
    id: 'hb.application:assigneeApproval.title',
    defaultMessage: 'Samþykki heimilismanna',
    description: 'Assignee approval title',
  },
  description: {
    id: 'hb.application:assigneeApproval.description#markdown',
    defaultMessage:
      'Umsóknin um húsnæðisbætur þarf samþykki allra heimilismanna yfir 18 ára. Vinsamlegast kynntu þér upplýsingarnar og staðfestu að þú samþykki.',
    description: 'Assignee approval description',
  },
  externalDataSubTitle: {
    id: 'hb.application:assigneeApproval.externalDataSubTitle',
    defaultMessage: 'Sæki þínar upplýsingar til að staðfesta auðkenni',
    description: 'External data sub title for assignee',
  },
  checkboxLabel: {
    id: 'hb.application:assigneeApproval.checkboxLabel',
    defaultMessage: 'Ég hef lesið og samþykki að sækja upplýsingar',
    description: 'External data checkbox label',
  },
  nationalRegistryTitle: {
    id: 'hb.application:assigneeApproval.nationalRegistryTitle',
    defaultMessage: 'Þjóðskrá',
    description: 'National registry title',
  },
  nationalRegistrySubTitle: {
    id: 'hb.application:assigneeApproval.nationalRegistrySubTitle',
    defaultMessage: 'Upplýsingar um nafn, kennitölu og heimilisfang',
    description: 'National registry sub title',
  },
  confirmRead: {
    id: 'hb.application:assigneeApproval.confirmRead',
    defaultMessage:
      'Ég hef kynnt mér upplýsingar umsóknarinnar og samþykki að hún sé send til HMS',
    description: 'Assignee confirm read checkbox',
  },
  approveButton: {
    id: 'hb.application:assigneeApproval.approveButton',
    defaultMessage: 'Staðfesta',
    description: 'Approve button',
  },
  prereqMunicipalitySectionTitle: {
    id: 'hb.application:assigneeApproval.prereqMunicipalitySectionTitle',
    defaultMessage: 'Sérstakur húsnæðisstuðningur',
    description: 'Assignee prerequisite municipality section title',
  },
  prereqMunicipalityDescription: {
    id: 'hb.application:assigneeApproval.prereqMunicipalityDescription#markdown',
    defaultMessage:
      'Flest sveitarfélög bjóða upp á sérstakan húsnæðisstuðning. Til að ákvarða hvort þú getir fengið stuðning þarf sveitarfélagið að sækja upplýsingar um þig til að ákvarða hvort þú getir fengið stuðning.',
    description: 'Assignee prerequisite municipality description',
  },
  prereqConfirmRead: {
    id: 'hb.application:assigneeApproval.prereqConfirmRead',
    defaultMessage:
      'Ég samþykki að að sveitarfélagið mitt sæki upplýsingar um mig til að ákvarða sérstakan húsnæðisstuðning.',
    description: 'Checkbox after assignee external data',
  },
  prereqContinueButton: {
    id: 'hb.application:assigneeApproval.prereqContinueButton',
    defaultMessage: 'Halda áfram',
    description: 'Submit after assignee prerequisites (stays in same state)',
  },
  taxTitle: {
    id: 'hb.application:assigneeApproval.taxTitle',
    defaultMessage: 'Skatturinn',
    description: 'Tax title',
  },
  taxSubtitle: {
    id: 'hb.application:assigneeApproval.taxSubtitle',
    defaultMessage: 'Upplýsingar um skattframtalsskil',
    description: 'Tax subtitle',
  },
})
