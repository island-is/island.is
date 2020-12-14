import jwt from 'jsonwebtoken'
import { SendMailOptions } from 'nodemailer'
import { dedent } from 'ts-dedent'

import { Application } from '@island.is/application/core'

export const createAssignToken = (application: Application, secret: string) => {
  const token = jwt.sign(
    {
      applicationId: application.id,
    },
    secret,
    { expiresIn: 24 * 60 * 60 },
  )

  return token
}

export const createAssignTemplate = (
  application: Application,
  email: string,
  token: string,
): SendMailOptions => {
  const template = {
    from: {
      name: 'ParentalLeave application',
      address: 'baering@aranja.com',
    },
    replyTo: {
      name: 'ParentalLeave application',
      address: 'baering@aranja.com',
    },
    to: [
      {
        name: '',
        address: email,
      },
    ],
    subject: ``,
    text: dedent(`
      Hello employer, ${application.applicant} has assigned you as a reviewer of this application.
      
      If you were expecting this email, then assign yourself to the application here: http://localhost:4200/applications/assign?token=${token}
    `),
  }

  return template
}
