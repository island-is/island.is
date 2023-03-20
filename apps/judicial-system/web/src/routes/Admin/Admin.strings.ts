import { defineMessages } from 'react-intl'

export const adminStrings = defineMessages({
  alertTitle: {
    id: 'judicial.system.core:page_layout.admin_role.alert_title',
    defaultMessage: 'Notandi fannst ekki',
    description:
      'Notaður sem titill á villuboðum þegar notandi finnst ekki í admin viðmóti',
  },
  alertMessage: {
    id: 'judicial.system.core:page_layout.admin_role.alert_message',
    defaultMessage:
      'Vinsamlega reyndu að opna notandann aftur frá yfirlitssíðunni.',
    description:
      'Notaður sem villuboð þegar notandi finnst ekki í admin viðmóti',
  },
})
