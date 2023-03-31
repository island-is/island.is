import { Locale } from 'locale'
import {
  LiveChatIncChatPanelProps,
  WatsonChatPanelProps,
} from '../../ChatPanel'

export const liveChatIncConfig: Record<string, LiveChatIncChatPanelProps> = {
  // HSN - Organization
  // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/EM4Y0gF4OoGhH9ZY0Dxl6
  EM4Y0gF4OoGhH9ZY0Dxl6: {
    license: 15092154,
    version: '2.0',
  },
  // HSU - Organization
  // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/1UDhUhE8pzwnl0UxuzRUMk
  '1UDhUhE8pzwnl0UxuzRUMk': {
    license: 15092154,
    version: '2.0',
  },
  // HVE - Organization
  // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/Un4jJk0rPybt9fu8gk94m
  Un4jJk0rPybt9fu8gk94m: {
    license: 15092154,
    version: '2.0',
  },
}

const onDirectorateOfImmigrationChatLoad = (instance) => {
  instance.on({
    type: 'window:open',
    handler: () => {
      const customPanel = instance.customPanels.getPanel()

      const emailInputId = 'email'
      const nameInputId = 'name'
      const submitButtonId = 'submit-button'

      customPanel.hostElement.innerHTML = `
        <div style="padding: 8px">

          <div class="bx--form-item">
            <label for="${emailInputId}" class="bx--label">Netfang/Email</label>
            <input id="${emailInputId}" name="${emailInputId}" type="text" class="bx--text-input">
          </div>

          <br />

          <div class="bx--form-item">
            <label for="${nameInputId}" class="bx--label">Nafn/Name</label>
            <input id="${nameInputId}" type="text" class="bx--text-input">
          </div>

          <br />
          
          <div class="bx--form-item" style="display: flex; justify-content: center">
            <button id="${submitButtonId}" class="bx--btn" type="button">Áfram / Continue</button>
          </div>
        </div>
      `

      customPanel.open({
        title: 'Netspjall Útlendingastofnunar',
        hideBackButton: true,
      })

      const emailInput = document.getElementById(
        emailInputId,
      ) as HTMLInputElement
      const nameInput = document.getElementById(nameInputId) as HTMLInputElement
      const submitButton = document.getElementById(submitButtonId)

      submitButton.onclick = () => {
        const emailValue = emailInput?.value ?? ''
        const nameValue = nameInput?.value ?? ''

        console.log('email entered:', emailValue)
        console.log('name entered:', nameValue)
      }
    },
  })
}

export const watsonConfig: Record<
  Locale,
  Record<string, WatsonChatPanelProps>
> = {
  en: {
    // Útlendingastofnun - Organization
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/77rXck3sISbMsUv7BO1PG2
    '77rXck3sISbMsUv7BO1PG2': {
      integrationID: '89a03e83-5c73-4642-b5ba-cd3771ceca54',
      region: 'eu-gb',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'default',
      onLoad(instance) {
        onDirectorateOfImmigrationChatLoad(instance)
      },
    },
  },
  is: {
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

    // Útlendingastofnun - Organization
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/77rXck3sISbMsUv7BO1PG2
    '77rXck3sISbMsUv7BO1PG2': {
      integrationID: '89a03e83-5c73-4642-b5ba-cd3771ceca54',
      region: 'eu-gb',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'default',
      onLoad(instance) {
        onDirectorateOfImmigrationChatLoad(instance)
      },
    },
  },
}
