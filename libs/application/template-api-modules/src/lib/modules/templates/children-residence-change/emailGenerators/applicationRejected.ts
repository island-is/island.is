import {
  CRCApplication,
  getSelectedChildrenFromExternalData,
} from '@island.is/application/templates/children-residence-change'

import { EmailTemplateGenerator } from '../../../../types'

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

  const subject = 'Samningi um breytt lögheimili og meðlag hafnað'
  const body = `
        ${otherParent.fullName} hefur hafnað drögum að samningi um breytt lögheimili og meðlag barna, sem þú útbjóst og undirritaðir á Island.is.

        Möguleg næstu skref:

        <ul>
            <li>Þið getið útbúið nýjan samning með því að hefja ferlið aftur.</li>
            <li>Þú getur sent beiðni um lögheimilisbreytingu á sýslumann, sem tekur málið til meðferðar.</li>
            <li>Þú getur óskað eftir viðtali hjá sýslumanni til að ræða næstu skref.</li>
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
