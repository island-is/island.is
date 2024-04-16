import { defineMessages } from 'react-intl'

export const strings = defineMessages({
  updateError: {
    id: 'judicial.system.core:admin.change_user.update_error',
    defaultMessage: 'Ekki tókst að uppfæra notanda.',
    description: 'Notaður sem skilaboð þegar ekki tókst að uppfæra notanda.',
  },
  alertTitle: {
    id: 'judicial.system.core:admin.change_user.alert_title',
    defaultMessage: 'Notandi fannst ekki',
    description:
      'Notaður sem titill á villuboðum þegar notandi finnst ekki í admin viðmóti',
  },
  alertMessage: {
    id: 'judicial.system.core:admin.change_user.alert_message',
    defaultMessage:
      'Vinsamlega reyndu að opna notandann aftur frá yfirlitssíðunni.',
    description:
      'Notaður sem villuboð þegar notandi finnst ekki í admin viðmóti',
  },
})
