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
  prereqSectionTitle: {
    id: 'hb.application:assigneeApproval.prereqSectionTitle',
    defaultMessage: 'Forkröfur heimilismanns',
    description: 'Assignee prerequisite step title',
  },
  prereqDescription: {
    id: 'hb.application:assigneeApproval.prereqDescription#markdown',
    defaultMessage:
      'Til að halda áfram þarftu fyrst að staðfesta auðkenni þitt með gögnum úr Þjóðskrá og sækja skattframtal frá Skattinum.',
    description: 'Assignee prerequisite description',
  },
  prereqConfirmRead: {
    id: 'hb.application:assigneeApproval.prereqConfirmRead',
    defaultMessage:
      'Ég hef kynnt mér upplýsingarnar og vil halda áfram við samþykki umsóknarinnar.',
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
