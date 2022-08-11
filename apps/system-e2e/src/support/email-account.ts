// use Nodemailer to get an Ethereal email inbox
// https://nodemailer.com/about/
import { createTestAccount } from 'nodemailer'
// used to check the email inbox
import { connect } from 'imap-simple'
// used to parse emails from the inbox
// const simpleParser = require('mailparser').simpleParser
import { simpleParser } from 'mailparser'

export const makeEmailAccount = async () => {
  // Generate a new Ethereal email inbox account
  const testAccount = await createTestAccount()

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
  console.log('created new email account %s', testAccount.user)
  console.log('for debugging, the password is %s', testAccount.pass)

  const userEmail = {
    email: testAccount.user,

    /**
     * Utility method for getting the last email
     * for the Ethereal email account created above.
     */
    async getLastEmail(
      retries: number,
    ): Promise<null | {
      subject: string | undefined
      text: string | undefined
      html: string | false
    }> {
      // makes debugging very simple
      console.log('getting the last email')
      console.log(emailConfig)

      try {
        const connection = await connect(emailConfig)

        // grab up to 50 emails from the inbox
        await connection.openBox('INBOX')
        const searchCriteria = ['UNSEEN']
        const fetchOptions = {
          bodies: [''],
          markSeen: true,
        }
        const messages = await connection.search(searchCriteria, fetchOptions)
        // and close the connection to avoid it hanging
        connection.end()

        if (!messages.length) {
          console.log('cannot find any emails')
          if (retries <= 0) {
            return null
          } else {
            await new Promise((r) => setTimeout(r, 5000))
            return userEmail.getLastEmail(retries - 1)
          }
        } else {
          console.log('there are %d messages', messages.length)
          // grab the last email
          const mail = await simpleParser(
            messages[messages.length - 1].parts[0].body,
          )
          console.log(mail.subject)
          console.log(mail.text)

          // and returns the main fields
          return {
            subject: mail.subject,
            text: mail.text,
            html: mail.html,
          }
        }
      } catch (e) {
        console.error(e)
        return null
      }
    },
  }

  return userEmail
}
