// use Nodemailer to get an Ethereal email inbox
// https://nodemailer.com/about/
import { createTestAccount } from 'nodemailer'
// used to check the email inbox
import { connect } from 'imap-simple'
import { simpleParser } from 'mailparser'
import axios from 'axios'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import {
  GetIdentityVerificationAttributesCommand,
  SESClient,
  VerifyEmailAddressCommand,
} from '@aws-sdk/client-ses'
import { join } from 'path'
import { sessionsPath } from './session'
import { debug } from './utils'

/**
 * Register the email address with AWS SES, so we can send emails to it
 * @param emailAccount
 */
async function registerEmailAddressWithSES(emailAccount: {
  getLastEmail(retries: number): Promise<{
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
  if (verifyMsg && verifyMsg.text) {
    debug(`Verify message is ${verifyMsg.subject}: ${verifyMsg.text}`)
    const verifyUrl = verifyMsg.text.match(/https:\/\/email-verification.+/)
    if (!verifyUrl || verifyUrl.length !== 1) {
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
      emailVerifiedStatus.VerificationAttributes &&
      emailVerifiedStatus.VerificationAttributes[emailAccount.email][
        'VerificationStatus'
      ] !== 'Success'
    ) {
      throw new Error('Email identity still not validated in AWS SES')
    }
  } else {
    throw new Error('Verification message not found.')
  }
}

export type EmailAccount = {
  getLastEmail(retries: number): Promise<{
    subject: string | undefined
    text: string | undefined
    html: string | false
  } | null>
  email: string
}
const makeEmailAccount = async (name: string): Promise<EmailAccount> => {
  const storagePath = join(sessionsPath, `${name}-email.json`)
  const emailAccountExists = existsSync(storagePath)
  const testAccount = emailAccountExists
    ? (JSON.parse(readFileSync(storagePath, { encoding: 'utf-8' })) as {
        user: string
        pass: string
      })
    : await createTestAccount()

  const emailConfig = {
    imap: {
      user: testAccount.user,
      password: testAccount.pass,
      host: 'imap.ethereal.email',
      port: 993,
      tls: true,
      authTimeout: 10000,
    },
  }
  debug('created new email account %s', testAccount.user)
  debug('for debugging, the password is %s', testAccount.pass)
  const userEmail: EmailAccount = {
    email: testAccount.user,

    /**
     * Utility method for getting the last email
     * for the Ethereal email account created above.
     */
    async getLastEmail(retries: number): Promise<null | {
      subject: string | undefined
      text: string | undefined
      html: string | false
    }> {
      // makes debugging very simple
      debug('getting the last email')
      debug(emailConfig)

      debug('connecting to mail server...')
      const connection = await connect(emailConfig)
      debug('connected')
      try {
        // grab up to 50 emails from the inbox
        debug('Opening inbox...')
        await connection.openBox('INBOX')
        debug('Opened inbox.')
        const searchCriteria = ['UNSEEN']
        const fetchOptions = {
          bodies: [''],
          markSeen: true,
        }
        debug('Starting search for new messages...')
        const messages = await connection.search(searchCriteria, fetchOptions)
        debug('Search finished')

        if (!messages.length) {
          debug('cannot find any emails')
          if (retries <= 0) {
            return null
          } else {
            await new Promise((r) => setTimeout(r, 5000))
            return userEmail.getLastEmail(retries - 1)
          }
        } else {
          debug('there are %d messages', messages.length)
          // grab the last email
          const mail = await simpleParser(
            messages[messages.length - 1].parts[0].body,
          )
          debug(mail.subject)
          debug(mail.text)

          // and returns the main fields
          return {
            subject: mail.subject,
            text: mail.text,
            html: mail.html,
          }
        }
      } finally {
        // and close the connection to avoid it hanging
        connection.end()
      }
    },
  }

  if (!emailAccountExists) {
    await registerEmailAddressWithSES(userEmail)
  }
  writeFileSync(
    storagePath,
    JSON.stringify({ user: testAccount.user, pass: testAccount.pass }),
    { encoding: 'utf-8' },
  )

  return userEmail
}

export { makeEmailAccount, registerEmailAddressWithSES }
