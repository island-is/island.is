import { SendMailOptions } from 'nodemailer'
import { dedent } from 'ts-dedent'
import { Application } from '@island.is/application/core'

export default (
  {
    application,
    clientLocationOrigin,
  }: { application: Application; clientLocationOrigin: string },
  token: string,
): SendMailOptions => ({
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
      address: application.answers.employerEmail as string,
    },
  ],
  subject: ``,
  // TODO: clickable link
  text: dedent(`
    Góðan dag.
    
    Umsækjandi með kennitölu ${application.applicant} hefur skráð þig sem foreldri í umsókn sinni.
    
    Ef þú áttir von á þessum tölvupósti þá getur þú haldið áfram hingað til þess að fara yfir umsóknina: ${clientLocationOrigin}/tengjast-umsokn?token=${token}

    Með kveðju.
    Starfsfólk fæðingarorlofssjóðs
  `),
})
