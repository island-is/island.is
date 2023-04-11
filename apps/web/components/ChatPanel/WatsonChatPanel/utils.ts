import initApollo from '@island.is/web/graphql/client'
import { GET_DIRECTORATE_OF_IMMIGRATION_WATSON_ASSISTANT_CHAT_IDENTITY_TOKEN } from '@island.is/web/screens/queries/WatsonAssistantChat'

export const onDirectorateOfImmigrationChatLoad = (instance) => {
  const apolloClient = initApollo({})

  instance.on({
    type: 'identityTokenExpired',
    handler: (event) => {
      console.log('TOKEN EXPIRED')
    },
  })

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

        apolloClient
          .query({
            query: GET_DIRECTORATE_OF_IMMIGRATION_WATSON_ASSISTANT_CHAT_IDENTITY_TOKEN,
            variables: {
              name: nameValue,
              email: emailValue,
            },
          })
          .then((response) => {
            console.log('Received', response)
          })

        console.log('email entered:', emailValue)
        console.log('name entered:', nameValue)
      }
    },
  })
}
