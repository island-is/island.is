import { SendMailOptions } from 'nodemailer'
import { dedent } from 'ts-dedent'
import { Application } from '@island.is/application/core'
import get from 'lodash/get'

export default (
  {
    application,
    clientLocationOrigin,
  }: { application: Application; clientLocationOrigin: string },
  token: string,
): SendMailOptions => {
  const email = get(application.answers, 'employer.email', null)

  if (email === null) {
    throw new Error('Cannot create email template, missing employer email')
  }

  return {
    // TODO: place strings in translation file
    from: {
      name: 'Fæðingarorlofssjóður',
      address: 'todo@aranja.com',
    },
    replyTo: {
      name: 'Fæðingarorlofssjóður',
      address: 'todo@aranja.com',
    },
    to: [
      {
        name: '',
        address: email as string,
      },
    ],
    subject: ``,
    // TODO: clickable link
    text: dedent(`
      Góðan dag.
      
      Umsækjandi með kennitölu ${application.applicant} hefur skráð þig sem atvinnuveitanda í umsókn sinni.
      
      Ef þú áttir von á þessum tölvupósti þá getur þú haldið áfram hingað til þess að fara yfir umsóknina: ${clientLocationOrigin}/tengjast-umsokn?token=${token}
  
      Með kveðju.
      Starfsfólk fæðingarorlofssjóðs
    `),
  }
}
