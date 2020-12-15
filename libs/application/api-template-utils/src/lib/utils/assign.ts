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
      name: 'Fæðingarorlofssjóður',
      address: 'baering@aranja.com',
    },
    replyTo: {
      name: 'Fæðingarorlofssjóður',
      address: 'baering@aranja.com',
    },
    to: [
      {
        name: '',
        address: email,
      },
    ],
    subject: ``,
    // TODO: place in translation file
    // TODO: get client origin from environment to replace http://localhost:4200
    text: dedent(`
      Góðan dag.
      
      Umsækjandi með kennitölu ${application.applicant} hefur skráð þig sem atvinnuveitanda í umsókn sinni.
      
      Ef þú áttir von á þessum tölvupósti þá getur þú haldið áfram hingað til þess að fara yfir umsóknina: http://localhost:4200/tengjast-umsokn?token=${token}

      Með kveðju.
      Starfsfólk fæðingarorlofssjóðs
    `),
  }

  return template
}
