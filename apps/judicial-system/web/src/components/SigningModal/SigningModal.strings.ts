import { defineMessages } from 'react-intl'

export const signingModal = defineMessages({
  controlCode: {
    id: 'judicial.system.core:signing_modal.control_code',
    defaultMessage: 'Öryggistala: {controlCode}',
    description:
      'Notaður sem texti fyrir öryggistölu í modal glugga þegar verið er að undirrita.',
  },
  controlCodeExplanation: {
    id: 'judicial.system.core:signing_modal.control_code_explanation',
    defaultMessage:
      'Þetta er ekki pin-númerið. Staðfestu aðeins innskráningu ef sama öryggistala birtist í símanum þínum.',
    description:
      'Notaður sem texti fyrir útskýringu á öryggistölu í modal glugga þegar verið er að undirrita.',
  },
  inProgressTitle: {
    id: 'judicial.system.core:signing_modal.in_progress_title',
    defaultMessage: 'Rafræn undirritun',
    description:
      'Notaður sem titill í modal glugga þegar verið er að undirrita þegar undirritun er í gangi.',
  },
  successTitle: {
    id: 'judicial.system.core:signing_modal.success_title',
    defaultMessage: 'Úrskurður hefur verið staðfestur og undirritaður',
    description:
      'Notaður sem titill í modal glugga þegar verið er að undirrita þegar undirritun tókst.',
  },
  canceledTitle: {
    id: 'judicial.system.core:signing_modal.canceled_title',
    defaultMessage: 'Notandi hætti við undirritun',
    description:
      'Notaður sem titill í modal glugga þegar verið er að undirrita þegar notandi hættir við undirritun.',
  },
  errorTitle: {
    id: 'judicial.system.core:signing_modal.error_title',
    defaultMessage: 'Undirritun tókst ekki',
    description:
      'Notaður sem titill í modal glugga þegar verið er að undirrita þegar undirritun mistókst.',
  },
  successText: {
    id: 'judicial.system.restriction_cases:confirmation.modal.ruling_notification.text_v2#markdown',
    defaultMessage:
      'Úrskurður hefur verið sendur á ákæranda, verjanda og dómara sem kvað upp úrskurð.{summarySentToPrison, select, true { Auk þess hefur útdráttur verið sendur á fangelsi.} other {}}<br/><br/>Þú getur komið ábendingum á framfæri við þróunarteymi Réttarvörslugáttar um það sem mætti betur fara í vinnslu mála með því að smella á takkann hér fyrir neðan.',
    description:
      'Notaður sem texti í modal glugga þegar verið er að undirrita þegar undirritun tókst.',
  },
  errorText: {
    id: 'judicial.system.core:signing_modal.error_text',
    defaultMessage:
      'Vinsamlegast reynið aftur svo hægt sé að senda úrskurðinn með undirritun.',
    description:
      'Notaður sem texti í modal glugga þegar verið er að undirrita þegar undirritun mistókst.',
  },
  primaryButtonErrorText: {
    id: 'judicial.system.core:signing_modal.primary_button_error_text',
    defaultMessage: 'Undirrita seinna',
    description:
      'Notaður sem texti á aðalhnapp í modal glugga þegar undirritun mistókst.',
  },
  secondaryButtonErrorText: {
    id: 'judicial.system.core:signing_modal.secondary_button_error_text',
    defaultMessage: 'Reyna aftur',
    description:
      'Notaður sem texti á aukahnapp í modal glugga þegar undirritun mistókst.',
  },
})
