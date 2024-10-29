import nodemailer from 'nodemailer'
import nodemailerMock from 'nodemailer-mock'
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

  // Configure `nodemailer-mock` as the transport
  const transporter = nodemailerMock.createTransport({
    host: 'smtp.mockserver.local',
    port: 587,
    secure: false,
    auth: {
      user: 'mockUser',
      pass: 'mockPass',
    },
  })

  const userEmail: EmailAccount = {
    email: 'mockUser@mockserver.local',

    async getLastEmail(retries: number): Promise<null | {
      subject: string | undefined
      text: string | undefined
      html: string | false
    }> {
      debug('Fetching the last mocked email')
      const sentEmails = nodemailerMock.mock.getSentMail()

      if (!sentEmails.length) {
        debug('No emails found')
        if (retries <= 0) {
          return null
        } else {
          await new Promise((r) => setTimeout(r, 5000))
          return userEmail.getLastEmail(retries - 1)
        }
      } else {
        const lastEmail = sentEmails[sentEmails.length - 1]
        debug(`Last email subject: ${lastEmail.subject}`)
        debug(`Last email text: ${lastEmail.text}`)

        return {
          subject: lastEmail.subject,
          text: lastEmail.text?.toString(),
          html: lastEmail.html?.toString() || false,
        }
      }
    },
  }

  if (!emailAccountExists) {
    await registerEmailAddressWithSES(userEmail)
  }
  writeFileSync(
    storagePath,
    JSON.stringify({ user: 'mockUser', pass: 'mockPass' }),
    { encoding: 'utf-8' },
  )

  return userEmail
}

async function registerEmailAddressWithSES(emailAccount: EmailAccount) {
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

export { makeEmailAccount, registerEmailAddressWithSES }
