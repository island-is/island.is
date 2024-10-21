import { defineMessages } from 'react-intl'

export const strings = defineMessages({
  postponingTitle: {
    id: 'judicial.system.core:info_card_case_scheduled_indictment.postponing_title',
    defaultMessage: 'Frestað um ótilgreindan tíma',
    description:
      'Notaður sem titill á Frestað um ótilgreindan tíma upplýsingakorti.',
  },
  schedulingUntilVerdictTitle: {
    id: 'judicial.system.core:info_card_case_scheduled_indictment.scheduling_until_verdict_title',
    defaultMessage: 'Á dagskrá',
    description: 'Notaður sem titill á Á dagskrá upplýsingakorti.',
  },
  schedulingUntilVerdictText: {
    id: 'judicial.system.core:info_card_case_scheduled_indictment.scheduling_until_verdict_text',
    defaultMessage: 'Málið er dómtekið',
    description: 'Notaður sem gildi á Á dagskrá upplýsingakorti.',
  },
})
