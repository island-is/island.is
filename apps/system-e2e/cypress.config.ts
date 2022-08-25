import { defineConfig } from 'cypress'
import { getCognitoCredentials } from './src/support/utils'
import type { TestEnvironment } from './src/lib/types'
import { BaseUrl, AuthUrl, Timeout } from './src/lib/types'
import axios from 'axios'
import { makeEmailAccount } from './src/support/email-account'
import {
  GetIdentityVerificationAttributesCommand,
  SESClient,
  VerifyEmailAddressCommand,
} from '@aws-sdk/client-ses'
import { UnwrapPromise } from 'next/dist/lib/coalesced-function'

const getEnvironmentUrls = (env: TestEnvironment) => {
  return env === 'dev'
    ? { authUrl: AuthUrl.dev, baseUrl: BaseUrl.dev }
    : env === 'prod'
    ? { authUrl: AuthUrl.prod, baseUrl: BaseUrl.prod }
    : env === 'staging'
    ? { authUrl: AuthUrl.staging, baseUrl: BaseUrl.staging }
    : { authUrl: AuthUrl.local, baseUrl: BaseUrl.local }
}

/**
 * Register the email address with AWS SES so we can send emails to it
 * @param emailAccount
 */
async function registerEmailAddressWithSES(emailAccount: {
  getLastEmail(
    retries: number,
  ): Promise<{
    subject: string | undefined
    text: string | undefined
    html: string | false
  } | null>
  email: string
}) {
  const client = new SESClient({ region: 'eu-west-1' })
  await client.send(
    new VerifyEmailAddressCommand({ EmailAddress: emailAccount.email }),
  )
  const verifyMsg = await emailAccount.getLastEmail(4)
  if (verifyMsg) {
    console.log(`Verify message is ${verifyMsg.subject}: ${verifyMsg.text}`)
    const verifyUrl = verifyMsg.text!.match(/https:\/\/email-verification.+/)
    if (!verifyUrl || verifyUrl.length != 1) {
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
      emailVerifiedStatus.VerificationAttributes![emailAccount.email][
        'VerificationStatus'
      ] !== 'Success'
    ) {
      throw new Error(`Email identity still not validated in AWS SES`)
    }
  } else {
    throw new Error('Verification message not found.')
  }
}

export default defineConfig({
  fileServerFolder: '.',
  fixturesFolder: './src/fixtures',
  video: false,
  defaultCommandTimeout: Timeout.long,
  pageLoadTimeout: Timeout.medium,
  responseTimeout: Timeout.short,
  viewportWidth: 1024,
  viewportHeight: 768,
  projectId: 'xw5cuj',
  retries: {
    runMode: 2,
    openMode: 0,
  },
  e2e: {
    specPattern: '**/*.spec.{js,ts}',
    experimentalSessionAndOrigin: true,
    supportFile: '**/support/index.{js,ts}',
    async setupNodeEvents(on, config) {
      const emailAccounts: {
        [name: string]: UnwrapPromise<ReturnType<typeof makeEmailAccount>>
      } = {}

      on('task', {
        createEmailAccount: async (name: string) => {
          if (!emailAccounts[name]) {
            const emailAccount = await makeEmailAccount()
            await registerEmailAddressWithSES(emailAccount)
            emailAccounts[name] = emailAccount
            return emailAccount.email
          } else {
            return emailAccounts[name].email
          }
        },

        getLastEmail: ({
          name,
          retries,
        }: {
          name: string
          retries: number
        }) => {
          if (!emailAccounts[name])
            throw new Error(`Email user not created yet`)
          return emailAccounts[name].getLastEmail(retries)
        },
      })
      const testEnvironment: TestEnvironment =
        process.env.TEST_ENVIRONMENT || 'local'
      if (testEnvironment !== 'local') {
        config.env.cognito = getCognitoCredentials()
      }
      const { baseUrl, authUrl } = getEnvironmentUrls(testEnvironment)
      config.env.testEnvironment = testEnvironment
      config.env.authUrl = authUrl
      config.baseUrl = baseUrl
      return config
    },
  },
})
