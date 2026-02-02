import { defineMessages } from 'react-intl'

export const signingMethodSelectionModal = defineMessages({
  title: {
    id: 'judicial.system.core:signing_method_selection_modal.title',
    defaultMessage: 'Undirritun',
    description: 'Titill í modal glugga þegar notandi velur undirritunarleið.',
  },
  descriptionRuling: {
    id: 'judicial.system.core:signing_method_selection_modal.description_ruling',
    defaultMessage:
      'Þú ert að fara að undirrita úrskurð í máli {courtCaseNumber}. \nVinsamlegast veldu undirritunarleið til að halda áfram.',
    description:
      'Lýsing í modal glugga þegar verið er að undirrita úrskurð/dóm.',
  },
  descriptionCourtRecord: {
    id: 'judicial.system.core:signing_method_selection_modal.description_court_record',
    defaultMessage:
      'Þú ert að fara að undirrita þingbók í máli {courtCaseNumber}. \nVinsamlegast veldu undirritunarleið til að halda áfram.',
    description: 'Lýsing í modal glugga þegar verið er að undirrita þingbók.',
  },
  audkenniButton: {
    id: 'judicial.system.core:signing_method_selection_modal.audkenni_button',
    defaultMessage: 'Auðkennisappið',
    description:
      'Texti á hnappi til að velja Auðkennisappið sem undirritunarleið.',
  },
  mobileButton: {
    id: 'judicial.system.core:signing_method_selection_modal.mobile_button',
    defaultMessage: 'Rafræn skilríki',
    description:
      'Texti á hnappi til að velja rafræn skilríki (símanúmer) sem undirritunarleið.',
  },
})
