import { defineMessages } from 'react-intl'

export const terms = defineMessages({
  pageTitle: {
    id: 'aa.application:terms.pageTitle',
    defaultMessage: 'Samþykki',
    description: `Terms page title`,
  },
  subTitle: {
    id: 'aa.application:terms.subTitle',
    defaultMessage:
      'Með því að skila inn þessari umsókn samþykkir umsækjandi eftirfarandi:',
    description: 'terms and conditions sub title',
  },
  description: {
    id: 'aa.application:terms.description#markdown',
    defaultMessage: `* Að hafa frumkvæði að starfsleit og er reiðubúinn, án sérstaks fyrirvara, að taka hvert það starf sem greitt er fyrir í samræmi við gildandi lög og kjarasamninga og honum er unnt að gegna í ljósi getu hans til virkni á vinnumarkaði.
    \n* Að hann á ekki rétt á launum eða öðrum greiðslum í tengslum við störf á vinnumarkaði þann tíma sem hann er í virkri atvinnuleit.
    \n* Að hann hefur vilja og getu til að taka þátt í vinnumarkaðsúrræðum sem standa honum til boða.
    \n* Að vera reiðubúinn að veita Vinnumálastofnun nauðsynlegar upplýsingar til að stofnunin geti gefið honum kost á þátttöku í viðeigandi vinnumarkaðsúrræðum og aukið líkur á að hann fái starf á vinnumarkaði.
    \n* Að hann dvelji á íslandi en sé ekki staddur erlendis þar sem það er skilyrði þess að fá virknisstyrk.`,
    description: 'terms and conditions for the application, in markdown format',
  },
  checkboxText: {
    id: 'aa.application:terms.checkboxText',
    defaultMessage: 'Ég skil',
    description: 'Terms checkbox text',
  },
})
