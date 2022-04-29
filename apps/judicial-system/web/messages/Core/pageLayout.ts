import { defineMessage } from 'react-intl'

export const pageLayout = {
  adminRole: {
    alertTitle: defineMessage({
      id: 'judicial.system.core:page_layout.admin_role.alert_title',
      defaultMessage: 'Notandi fannst ekki',
      description:
        'Notaður sem titill á villuboðum þegar notandi finnst ekki í admin viðmóti',
    }),
    alertMessage: defineMessage({
      id: 'judicial.system.core:page_layout.admin_role.alert_message',
      defaultMessage:
        'Vinsamlega reyndu að opna notandann aftur frá yfirlitssíðunni.',
      description:
        'Notaður sem villuboð þegar notandi finnst ekki í admin viðmóti',
    }),
  },
  defenderRole: {
    alertTitle: defineMessage({
      id: 'judicial.system.core:page_layout.defender_role.alert_title',
      defaultMessage: 'Mál fannst ekki',
      description:
        'Notaður sem titill á villuboðum þegar mál finnst ekki í verjanda viðmóti',
    }),
    alertMessage: defineMessage({
      id: 'judicial.system.core:page_layout.defender_role.alert_message',
      defaultMessage: 'Ef til vill hefur þú ekki aðgang að þessu máli.',
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
        'Nota[ur sem titill á tengli til að fara aftur á yfirlitssíðu',
    }),
  },
}
