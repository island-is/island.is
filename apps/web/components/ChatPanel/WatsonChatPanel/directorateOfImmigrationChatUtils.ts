import { Locale } from 'locale'

import { storageFactory, stringHash } from '@island.is/shared/utils'
import initApollo from '@island.is/web/graphql/client'
import {
  Query,
  QueryWatsonAssistantChatIdentityTokenArgs,
} from '@island.is/web/graphql/schema'
import { GET_DIRECTORATE_OF_IMMIGRATION_WATSON_ASSISTANT_CHAT_IDENTITY_TOKEN } from '@island.is/web/screens/queries/WatsonAssistantChat'

const emailInputId = 'utlendingastofnun-chat-email'
const nameInputId = 'utlendingastofnun-chat-name'
const submitButtonId = 'utlendingastofnun-chat-submit-button'

const storage = storageFactory(() => sessionStorage)

const getTranslations = (
  namespace: Record<string, string>,
  activeLocale: Locale,
) => {
  const introText =
    namespace?.utlendingastofnunChatIntroText ??
    (activeLocale === 'is'
      ? 'Hefurðu kannað hvort spurningu þinni hafi þegar verið svarað á <a href="/adstod/utlendingastofnun">þjónustuvef Útlendingastofnunar</a>?'
      : `Did you check if your question was already answered on the <a href="/en/help/directorate-of-immigration">Directorate's service web</a>?`)

  const panelTitle =
    namespace?.utlendingastofnunChatPanelTitle ??
    (activeLocale === 'is'
      ? 'Netspjall Útlendingastofnunar'
      : "Directorate of Immigration's chat")

  const missingEmailText =
    namespace?.utlendingastofnunChatMissingEmailText ??
    (activeLocale === 'is' ? 'Netfang vantar' : 'Email missing')

  const missingNameText =
    namespace?.utlendingastofnunChatMissingNameText ??
    (activeLocale === 'is' ? 'Nafn vantar' : 'Name missing')

  const continueText =
    namespace?.utlendingastofnunChatContinue ??
    (activeLocale === 'is' ? 'Áfram' : 'Continue')

  const nameText =
    namespace?.utlendingastofnunChatName ??
    (activeLocale === 'is' ? 'Nafn' : 'Name')

  const emailText =
    namespace?.utlendingastofnunChatEmail ??
    (activeLocale === 'is' ? 'Netfang' : 'Email')

  return {
    introText,
    panelTitle,
    missingEmailText,
    missingNameText,
    continueText,
    nameText,
    emailText,
  }
}

const getUserID = () => {
  const email = storage.getItem(emailInputId)
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  return String(stringHash(storage.getItem('IBM_WAC_DEVICE_ID') ?? email))
}

const getUserInformation = async (
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  instance,
  namespace: Record<string, string>,
  activeLocale: Locale,
  callback: (userInfo: { name: string; email: string }) => void,
) => {
  const storedName = storage.getItem(nameInputId)
  const storedEmail = storage.getItem(emailInputId)

  // If we have stored the user information previously we simply return that
  if (storedName && storedEmail) {
    callback({ name: storedName, email: storedEmail })
    return
  }

  // Otherwise we prompt the user to enter his information
  const customPanel = instance.customPanels.getPanel()

  const translations = getTranslations(namespace, activeLocale)

  customPanel.hostElement.innerHTML = `
          <div style="padding: 16px">

            <p style="font-size: 14px">${translations.introText}</p>
  
            <br />
            <br />

            <div class="bx--form-item">
              <label for="${emailInputId}" class="bx--label">${translations.emailText} <span style="color: red">*</span></label>
              <input id="${emailInputId}" name="${emailInputId}" type="text" class="bx--text-input">
              <span id="${emailInputId}-error" style="color: red; min-height: 18px"></span>
            </div>
  
            <br />
  
            <div class="bx--form-item">
              <label for="${nameInputId}" class="bx--label">${translations.nameText} <span style="color: red">*</span></label>
              <input id="${nameInputId}" type="text" class="bx--text-input">
              <span id="${nameInputId}-error" style="color: red; min-height: 18px"></span>
            </div>
  
            <br />
            
            <div style="display: flex; justify-content: center">
              <button id="${submitButtonId}" type="button" style="display: flex; justify-content: center; border-radius: 4px; padding: 12px; background-color: #0061FF; color: white; font-size: 15px; cursor:pointer; border:none">${translations.continueText}</button>
            </div>
          </div>
        `

  customPanel.open({
    title: translations.panelTitle,
    hideBackButton: true,
  })

  const emailInput = document.getElementById(emailInputId) as HTMLInputElement
  const nameInput = document.getElementById(nameInputId) as HTMLInputElement
  const submitButton = document.getElementById(submitButtonId)

  const emailInputErrorMessage = document.getElementById(
    `${emailInputId}-error`,
  )
  const nameInputErrorMessage = document.getElementById(`${nameInputId}-error`)

  if (submitButton) {
    submitButton.onclick = () => {
      const email = emailInput?.value ?? ''
      const name = nameInput?.value ?? ''

      if (emailInputErrorMessage) {
        emailInputErrorMessage.innerText = !email
          ? translations.missingEmailText
          : ''
      }

      if (nameInputErrorMessage) {
        nameInputErrorMessage.innerText = !name
          ? translations.missingNameText
          : ''
      }

      if (!email || !name) {
        return
      }

      storage.setItem(emailInputId, email)
      storage.setItem(nameInputId, name)

      callback({ email, name })

      customPanel.close()
    }
  }
}
export const onDirectorateOfImmigrationChatLoad = (
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  instance,
  namespace: Record<string, string>,
  activeLocale: Locale,
) => {
  const apolloClient = initApollo({})

  instance.on({
    type: 'identityTokenExpired',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore make web strict
    handler: (event) => {
      return new Promise((resolve, reject) => {
        getUserInformation(
          instance,
          namespace,
          activeLocale,
          ({ email, name }) => {
            apolloClient
              .query<Query, QueryWatsonAssistantChatIdentityTokenArgs>({
                query:
                  GET_DIRECTORATE_OF_IMMIGRATION_WATSON_ASSISTANT_CHAT_IDENTITY_TOKEN,
                variables: {
                  input: {
                    name,
                    email,
                    userID: getUserID(),
                  },
                },
              })
              .then((response) => {
                const token =
                  response.data.watsonAssistantChatIdentityToken.token
                instance.updateIdentityToken(token)
                event.identityToken = token
                resolve(token)
              })
              .catch(reject)
          },
        )
      })
    },
  })

  instance.on({
    type: 'window:open',
    handler: () => {
      if (storage.getItem(nameInputId) && storage.getItem(emailInputId)) return

      getUserInformation(
        instance,
        namespace,
        activeLocale,
        ({ email, name }) => {
          apolloClient
            .query<Query, QueryWatsonAssistantChatIdentityTokenArgs>({
              query:
                GET_DIRECTORATE_OF_IMMIGRATION_WATSON_ASSISTANT_CHAT_IDENTITY_TOKEN,
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
        },
      )
    },
  })
}
