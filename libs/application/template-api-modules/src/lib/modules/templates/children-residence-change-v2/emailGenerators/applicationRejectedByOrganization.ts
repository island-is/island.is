import { CRCApplication } from '@island.is/application/templates/children-residence-change'
import { childrenResidenceInfo } from '@island.is/application/templates/family-matters-core/utils'
import { EmailTemplateGenerator } from '../../../../types'
import { syslumennDataFromPostalCode } from '../utils'
import {
  DistrictCommissionerLogo,
  fontStyles,
  ulStyles,
  liStyles,
} from './consts'

export const applicationRejectedByOrganizationEmail: EmailTemplateGenerator = (
  props,
) => {
  const {
    application,
    options: { email },
  } = props
  const crcApplication = application as unknown as CRCApplication
  const { answers, externalData } = crcApplication
  const { nationalRegistry } = externalData
  const applicant = nationalRegistry.data
  const childResidenceInfo = childrenResidenceInfo(
    applicant,
    externalData.childrenCustodyInformation.data,
    answers.selectedChildren,
  )

  const orgName = childResidenceInfo.future?.address?.postalCode
    ? syslumennDataFromPostalCode(
        childResidenceInfo.future?.address?.postalCode ?? '',
      ).name
    : 'Sýslumaður'

  const newApplicationLink = 'https://island.is/umsoknir/breytt-logheimili-barn'
  const requestLink =
    'https://www.syslumenn.is/media/malefni-barna/Beidni-foreldris-med-sameiginlega-forsja-um-breytt-logheimili-barns.pdf'

  const subject = 'Samningi um breytt lögheimili barns hafnað'
  const body = `
        <img src=${DistrictCommissionerLogo} height="78" width="246" />


        <h1>${subject}</h1>

        <p style="${fontStyles} margin: 0;">${orgName} hefur hafnað samningi um breytt lögheimili, sem þú undirritaðir á Island.is.</p>

        <h2>Hver eru möguleg næstu skref?</h2>
        <ul style="${ulStyles}"><li style=${liStyles}>Þið getið útbúið <a href=${newApplicationLink} target="_blank">nýjan samning</a> með því að hefja ferlið aftur.</li><li style=${liStyles}>Þú getur sent <a href=${requestLink}>beiðni um lögheimilisbreytingu</a> til sýslumanns, sem tekur málið til meðferðar.</li><li style=${liStyles}>Þú getur haft samband við sýslumann í þínu umdæmi til að fá frekari leiðbeiningar.</li></ul>

        <h2>Sáttameðferð sýslumanns:</h2>
        <ul style="${ulStyles}"><li style=${liStyles}>Ef foreldrar eru ekki sammála um flutning verður aðeins leyst úr þeim ágreiningi fyrir dómi.</li><li style=${liStyles}>Markmið sáttameðferðar er að hjálpa foreldrum að gera samning um þá lausn máls sem er barni fyrir bestu. Ef sætti skila ekki árangri í sáttameðferð mun málið fara fyrir dóm.</li><li style=${liStyles}>Ef sáttameðferð skilar ekki árangri getur foreldri höfðað dómsmál til að leggja fram kröfu um breytt lögheimilis barns.</li></ul>
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
      {
        name: '',
        address: crcApplication.answers.parentB.email,
      },
    ],
    subject,
    html: `<p>${body
      .split('')
      .map((c) => (c === '\n' ? `<br />\n` : c))
      .join('')}</p>`,
  }
}
