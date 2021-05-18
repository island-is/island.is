import { defineMessages } from 'react-intl'

const t = 'pdpp.application'

export const paymentPlan = {
  general: defineMessages({
    pageTitle: {
      id: `${t}:section.paymentPlan.pageTitle`,
      defaultMessage: 'Yfirlit yfir skuldir ',
      description: 'Payment plan page title',
    },
    pageDescription: {
      id: `${t}:section.paymentPlan.description`,
      defaultMessage: `Hér gefur að líta yfirlit yfir þær
      skuldir þar sem boðið er upp á greiðsludreifingu.
      Til að ganga frá greiðsludreifingu þarf að gera
      greiðsluáætlun fyrir allar útistandandi skuldir og undirrita áætlunina rafrænt.`,
    },
  }),
  labels: defineMessages({}),
}
