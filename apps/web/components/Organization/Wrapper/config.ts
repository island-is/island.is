import { WatsonChatPanelProps } from '../../ChatPanel'

export const watsonConfig: Record<string, WatsonChatPanelProps> = {
  // District Commissioners (Sýslumenn) - Organization
  // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/kENblMMMvZ3DlyXw1dwxQ
  kENblMMMvZ3DlyXw1dwxQ: {
    integrationID: '0c96e8fb-d4dc-420e-97db-18b0f8bb4e3f',
    region: 'eu-gb',
    serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
    showLauncher: false,
    carbonTheme: 'g10',
    namespaceKey: 'default',
    onLoad: () => {
      if (sessionStorage.getItem('0c96e8fb-d4dc-420e-97db-18b0f8bb4e3f')) {
        sessionStorage.clear()
      }
    },
  },

  // Digital Iceland (Stafrænt Ísland) - Organization
  // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/1JHJe1NDwbBjEr7OVdjuFD
  '1JHJe1NDwbBjEr7OVdjuFD': {
    integrationID: 'b1a80e76-da12-4333-8872-936b08246eaa',
    region: 'eu-gb',
    serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
    showLauncher: false,
    carbonTheme: 'g10',
    namespaceKey: 'default',
    onLoad: () => {
      if (sessionStorage.getItem('b1a80e76-da12-4333-8872-936b08246eaa')) {
        sessionStorage.clear()
      }
    },
  },
}
