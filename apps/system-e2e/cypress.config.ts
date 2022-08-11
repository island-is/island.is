import { defineConfig } from 'cypress'
import { getCognitoCredentials, testEnvironment } from './src/support/utils'
import { makeEmailAccount } from './src/support/email-account'
import {
  GetIdentityVerificationAttributesCommand,
  SESClient,
  VerifyEmailAddressCommand,
} from '@aws-sdk/client-ses'
import axios from 'axios'

export default defineConfig({
  fileServerFolder: '.',
  fixturesFolder: './src/fixtures',
  video: false,
  defaultCommandTimeout: 60000,
  pageLoadTimeout: 60000,
  responseTimeout: 12000,
  videosFolder: '../../dist/cypress/apps/web-e2e/videos',
  screenshotsFolder: '../../dist/cypress/apps/web-e2e/screenshots',
  chromeWebSecurity: false,
  viewportWidth: 1024,
  viewportHeight: 768,
  projectId: 'xw5cuj',
  retries: {
    runMode: 2,
    openMode: 0,
  },
  e2e: {
    specPattern: './src/integration/**/*.ts',
    experimentalSessionAndOrigin: true,
    supportFile: './src/support/index.ts',
    async setupNodeEvents(on, config) {
      // const options = {
      //   // send in the options from your webpack.config.js, so it works the same
      //   // as your app's code
      //   webpackOptions: sample,
      // }
      // on('file:preprocessor', webpackPreprocessor(options))
      const emailAccount = await makeEmailAccount()
      const client = new SESClient({ region: 'eu-west-1' })
      await client.send(
        new VerifyEmailAddressCommand({ EmailAddress: emailAccount.email }),
      )
      const verifyMsg = await emailAccount.getLastEmail(4)
      console.log(`Verify message is ${verifyMsg.subject}: ${verifyMsg.text}`)
      const verifyUrl = verifyMsg.text.match(/https:\/\/email-verification.+/)
      if (verifyUrl.length != 1) {
        throw new Error(
          `Email validation should have provided 1 URL but that did not happen. Here are the matches in the email message: ${JSON.stringify(
            verifyUrl,
          )}`,
        )
      }

      await axios.get(verifyUrl[0])
      const emailVerifiedStatus = await client.send(
        new GetIdentityVerificationAttributesCommand({
          Identities: [emailAccount.email],
        }),
      )
      if (
        emailVerifiedStatus.VerificationAttributes[emailAccount.email][
          'VerificationStatus'
        ] !== 'Success'
      ) {
        throw new Error(`Email identity still not validated in AWS SES`)
      }

      on('task', {
        getUserEmail: () => {
          return emailAccount.email
        },

        getLastEmail: (retries: number) => {
          return emailAccount.getLastEmail(retries)
        },
      })
      config.env.testEnvironment = testEnvironment
      if (testEnvironment !== 'local') {
        const { cognitoUsername, cognitoPassword } = getCognitoCredentials()
        config.env.cognitoUsername = cognitoUsername
        config.env.cognitoPassword = cognitoPassword
      }
      config.baseUrl = config.env[testEnvironment].baseUrl
      return config
    },
  },
})
// ci-cache-bust-01
