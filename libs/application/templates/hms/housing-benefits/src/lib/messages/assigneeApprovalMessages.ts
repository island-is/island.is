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
    defaultMessage: 'Upplýsingar frá þjóðskrá',
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
})
