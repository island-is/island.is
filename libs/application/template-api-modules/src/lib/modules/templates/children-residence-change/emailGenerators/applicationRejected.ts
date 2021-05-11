import { getSelectedChildrenFromExternalData } from '@island.is/application/templates/family-matters-core/utils'
import { CRCApplication } from '@island.is/application/templates/children-residence-change'

import { EmailTemplateGenerator } from '../../../../types'
import { DistrictCommissionerLogo } from './consts'

export const applicationRejectedEmail: EmailTemplateGenerator = (props) => {
  const {
    application,
    options: { email },
  } = props
  const crcApplication = (application as unknown) as CRCApplication
  const selectedChildren = getSelectedChildrenFromExternalData(
    crcApplication.externalData.nationalRegistry.data.children,
    crcApplication.answers.selectedChildren,
  )
  const otherParent = selectedChildren[0].otherParent
  const newApplicationLink = 'https://island.is/umsoknir/breytt-logheimili-barn'
  const interviewLink = 'https://www.syslumenn.is/timabokanir'
  const requestLink =
    'https://www.syslumenn.is/media/malefni-barna/Beidni-foreldris-med-sameiginlega-forsja-um-breytt-logheimili-barns.pdf'

  const subject = 'Samningi um breytt lögheimili og meðlag hafnað'
  const body = `
        <img src=${DistrictCommissionerLogo} height="78" width="246" />


        <h1>${subject}</h1>

        ${otherParent.fullName} hefur hafnað drögum að samningi um breytt lögheimili og meðlag barna, sem þú útbjóst og undirritaðir á Island.is.

        <h2>Hver eru möguleg næstu skref?</h2>
        <ul>
            <li>Þið getið útbúið <a href=${newApplicationLink} target="_blank">nýjan samning</a> með því að hefja ferlið aftur.</li>
            <li>Þú getur sent <a href=${requestLink}>beiðni um lögheimilisbreytingu</a> á sýslumann, sem tekur málið til meðferðar.</li>
            <li>Þú getur óskað eftir <a href=${interviewLink}>viðtali</a> hjá sýslumanni til að ræða næstu skref.</li>
        </ul>

        <h2>Sáttameðferð sýslumanns:</h2>
        <ul>
            <li>Ef foreldar eru ekki sammála um flutning verður aðeins leyst úr þeim ágreiningi fyrir dómi.</li>
            <li>Áður en málið fer fyrir dóm reynir sýslumaður sáttameðferð þar sem þið koma í viðtal til sýslumanns og vinna að mögulegri sáttameðferð í málinu.</li>
            <li>Markmið sáttameðferðar er að hjálpa foreldrum að gera samning um þá lausn máls sem er barni fyrir bestu. Ef sætti skila ekki árangri í sáttameðferð mun málið fara fyrir dóm.</li>
            <li>Ef sætti skila ekki árangri í sáttameðferð mun málið fara fyrir dóm.</li>
        </ul>
      `

  return {
    from: {
      name: email.sender,
      address: email.address,
    },
    to: [
      {
        name: '',
        address: crcApplication.answers.parentA.email,
      },
    ],
    subject,
    html: `<p>${body
      .split('')
      .map((c) => (c === '\n' ? `<br />\n` : c))
      .join('')}</p>`,
  }
}
