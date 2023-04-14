import initApollo from '@island.is/web/graphql/client'
import { GET_DIRECTORATE_OF_IMMIGRATION_WATSON_ASSISTANT_CHAT_IDENTITY_TOKEN } from '@island.is/web/screens/queries/WatsonAssistantChat'
import { storageFactory, stringHash } from '@island.is/shared/utils'
import {
  Query,
  QueryWatsonAssistantChatIdentityTokenArgs,
} from '@island.is/web/graphql/schema'

const emailInputId = 'utlendingastofnun-chat-email'
const nameInputId = 'utlendingastofnun-chat-name'
const submitButtonId = 'utlendingastofnun-chat-submit-button'

const storage = storageFactory(() => sessionStorage)

const getUserID = () => {
  const email = storage.getItem(emailInputId)
  return String(stringHash(storage.getItem('IBM_WAC_DEVICE_ID') ?? email))
}

const getUserInformation = async (instance, callback) => {
  const storedName = storage.getItem(nameInputId)
  const storedEmail = storage.getItem(emailInputId)

  // If we have stored the user information previously we simply return that
  if (storedName && storedEmail) {
    callback({ name: storedName, email: storedEmail })
    return
  }

  // Otherwise we prompt the user to enter his information
  const customPanel = instance.customPanels.getPanel()

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

  const emailInput = document.getElementById(emailInputId) as HTMLInputElement
  const nameInput = document.getElementById(nameInputId) as HTMLInputElement
  const submitButton = document.getElementById(submitButtonId)

  submitButton.onclick = () => {
    const email = emailInput?.value ?? ''
    const name = nameInput?.value ?? ''

    storage.setItem(emailInputId, email)
    storage.setItem(nameInputId, name)

    callback({ email, name })

    customPanel.close()
  }
}

export const onDirectorateOfImmigrationChatLoad = (instance) => {
  const apolloClient = initApollo({})

  instance.on({
    type: 'identityTokenExpired',
    handler: (event) => {
      return new Promise((resolve, reject) => {
        getUserInformation(instance, ({ email, name }) => {
          apolloClient
            .query<Query, QueryWatsonAssistantChatIdentityTokenArgs>({
              query: GET_DIRECTORATE_OF_IMMIGRATION_WATSON_ASSISTANT_CHAT_IDENTITY_TOKEN,
              variables: {
                input: {
                  name,
                  email,
                  userID: getUserID(),
                },
              },
            })
            .then((response) => {
              const token = response.data.watsonAssistantChatIdentityToken.token
              instance.updateIdentityToken(token)
              event.identityToken = token
              resolve(token)
            })
            .catch(reject)
        })
      })
    },
  })

  instance.on({
    type: 'window:open',
    handler: () => {
      if (storage.getItem(nameInputId) && storage.getItem(emailInputId)) return

      getUserInformation(instance, ({ email, name }) => {
        apolloClient
          .query<Query, QueryWatsonAssistantChatIdentityTokenArgs>({
            query: GET_DIRECTORATE_OF_IMMIGRATION_WATSON_ASSISTANT_CHAT_IDENTITY_TOKEN,
            variables: {
              input: {
                name,
                email,
                userID: getUserID(),
              },
            },
          })
          .then((response) => {
            const token = response.data.watsonAssistantChatIdentityToken.token
            instance.updateIdentityToken(token)
          })
      })
    },
  })
}
