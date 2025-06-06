import { defineMessage } from 'react-intl'

export const pageLayout = {
  defenderRole: {
    alertTitle: defineMessage({
      id: 'judicial.system.core:page_layout.defender_role.alert_title',
      defaultMessage: 'Mál fannst ekki',
      description:
        'Notaður sem titill á villuboðum þegar mál finnst ekki í verjanda viðmóti',
    }),
    alertMessage: defineMessage({
      id: 'judicial.system.core:page_layout.defender_role.alert_message',
      defaultMessage: 'Vinsamlega reyndu að opna málið aftur.',
      description:
        'Notaður sem villuboð þegar mál finnst ekki í verjanda viðmóti',
    }),
  },
  otherRoles: {
    alertTitle: defineMessage({
      id: 'judicial.system.core:page_layout.other_roles.alert_title',
      defaultMessage: 'Mál fannst ekki',
      description: 'Notaður sem titill á villuboðum þegar mál finnst ekki',
    }),
    alertMessage: defineMessage({
      id: 'judicial.system.core:page_layout.other_roles.alert_message',
      defaultMessage:
        'Vinsamlega reyndu að opna málið aftur frá yfirlitssíðunni.',
      description: 'Notaður sem villuboð þegar mál finnst ekki',
    }),
  },
  shared: {
    overviewLinkTitle: defineMessage({
      id: 'judicial.system.core:page_layout.shared.overview_link_title',
      defaultMessage: 'Fara á yfirlitssíðu.',
      description:
        'Notaður sem titill á tengli til að fara aftur á yfirlitssíðu',
    }),
  },
}
