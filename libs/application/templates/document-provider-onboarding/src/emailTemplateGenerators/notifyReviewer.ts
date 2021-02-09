import { SendMailOptions } from 'nodemailer'
import { dedent } from 'ts-dedent'
import { Application, getValueViaPath } from '@island.is/application/core'
export default (
  {
    application,
    clientLocationOrigin,
  }: { application: Application; clientLocationOrigin: string },
  token: string,
): SendMailOptions => {
  const email = 'island@island.is'
  const assignLink = `${clientLocationOrigin}/tengjast-umsokn?token=${token}`
  const applicantNationalId = getValueViaPath(
    application.answers,
    'applicant.nationalId',
    undefined,
  ) as string
  const applicantName = getValueViaPath(
    application.answers,
    'applicant.name',
    undefined,
  ) as string
  return {
    from: {
      name: 'island.is',
      address: 'island@island.is',
    },
    to: [
      {
        name: '',
        address: email as string,
      },
    ],
    subject: `Umsókn um að gerast skjalaveita`,
    text: dedent(`
      Góðan dag.
      ${applicantName} (kt. ${applicantNationalId}) hefur óskað eftir að gerast skjalaveita í pósthólfinu.
      Umsóknin var framkvæmd af ${application.applicant}.
      Ef þú áttir von á þessum tölvupósti þá getur þú haldið áfram hingað til þess að fara yfir umsóknina: ${assignLink}
      Með kveðju.
      Starfsfólk island.is
    `),
    html: `
      <p>
        Góðan dag<br/><br/>
        <strong>${applicantName}</strong> (kt. ${applicantNationalId}) hefur óskað eftir að gerast skjalaveita í pósthólfinu.<br/>
        Umsóknin var framkvæmd af ${application.applicant}.<br/><br/>
        Ef þú áttir von á þessum tölvupósti þá getur þú <a href="${assignLink}" target="_blank">smellt hér til þess að fara yfir umsóknina</a>.<br/><br/>
        Með kveðju.<br/>
        Starfsfólk island.is</br>
      </p>
    `,
  }
}
