import { defineMessages } from 'react-intl'

export const payout = {
  general: defineMessages({
    sectionTitle: {
      id: 'vmst.ub.application:payout.general.sectionTitle',
      defaultMessage: 'Umsækjandi',
      description: 'applicant section page title',
    },
  }),
  labels: defineMessages({}),
  payoutInformation: defineMessages({
    pageTitle: {
      id: 'vmst.ub.application:payout.payoutInformation.pageTitle',
      defaultMessage: 'Greiðsluupplýsingar',
      description: 'payout page description',
    },
  }),
  taxDiscount: defineMessages({
    pageTitle: {
      id: 'vmst.ub.application:payout.taxDiscount.pageTitle',
      defaultMessage: 'Persónuafsláttur',
      description: 'Tax discount page description',
    },
  }),
  vacation: defineMessages({
    pageTitle: {
      id: 'vmst.ub.application:payout.vacation.pageTitle',
      defaultMessage: 'Orlof',
      description: 'Vactaion page description',
    },
  }),
  vacationsAndForeignWorkAgreement: defineMessages({
    pageTitle: {
      id: 'vmst.ub.application:payout.vacationsAndForeignWorkAgreement.pageTitle',
      defaultMessage: 'Utanlandsferðir og atvinna erlendis',
      description: 'Vacations and foreign work agreement page description',
    },
    pageDescription: {
      id: 'vmst.ub.application:payout.vacationsAndForeignWorkAgreement.pageDescription#markdown',
      defaultMessage: `Ef þú ferð til útlanda verður þú alltaf að láta Vinnumálastofnun vita áður en þú ferð. Þú getur tilkynnt um utanlandsferð á Mínum síðum. Þú átt ekki rétt á atvinnuleysisbótum á meðan þú ert erlendis nema að þú hafir fengið útgefið vottorð (U2) sem heimilar atvinnuleit á Evrópska efnahagssvæðinu.\nEf þú ætlar að leita þér að vinnu erlendis er gott að byrja á að skoða www.eures.is og tala við EURES ráðgjafa Vinnumálastofnunar.`,
      description: 'Vacations and foreign work agreement page description',
    },
  }),
  otherBenefits: defineMessages({
    pageTitle: {
      id: 'vmst.ub.application:payout.otherBenefits.pageTitle',
      defaultMessage: 'Aðrar bætur eða lífeyrir',
      description: 'Other benefits page description',
    },
    pageDescription: {
      id: 'vmst.ub.application:payout.otherBenefits.pageDescription#markdown',
      defaultMessage: `Umsækjendur sem þiggja bætur frá stéttarfélagi eða sjúkradagpeninga þurfa að skila inn staðfestingu ef við á.\n
Ef viðkomandi er að fá tekjur frá TR þá eru þær komnar inn í reit merktur Greiðslur frá Tryggingastofnun.\n
Ef viðkomandi er að fá lífeyri þá er upphæðin komin frá RSK í reit merktur Lífeyrisgreiðslur`,
      description: 'Other benefits page description',
    },
  }),
  capitalIncome: defineMessages({
    pageTitle: {
      id: 'vmst.ub.application:payout.capitalIncome.pageTitle',
      defaultMessage: 'Fjármagnstekjur',
      description: 'Capital income page description',
    },
  }),
  unemploymentBenefitsPayoutAgreement: defineMessages({
    pageTitle: {
      id: 'vmst.ub.application:payout.unemploymentBenefitsPayoutAgreement.pageTitle',
      defaultMessage: 'Útborgun atvinnuleysisbóta',
      description: 'Unemployment benefits payout agreement description',
    },
    pageDescription: {
      id: 'vmst.ub.application:payout.unemploymentBenefitsPayoutAgreement.pageDescription#markdown',
      defaultMessage: `Greiðsla atvinnuleysisbóta tekur annaðhvort mið af þeim degi sem staðfest umsókn er send eða þegar uppsagnarfresti lýkur, svo lengi sem umsókn berst fyrir þann tíma.\n
Útborgun atvinnuleysisbóta er síðasta virka dag hvers mánaðar.\n
Greiðslutímabilið er frá fyrsta til síðasta dags mánaðar. T.d. fyrir 1. janúar - 31. janúar kemur greiðsla síðasta virka daginn í janúar.\n
Upphæðin lækkar eftir því sem bótarétturinn er minni en þú verður að hafa a.m.k. stundað 25% starf í 3 mánuði á sl. 12 mánuðum.`,
      description: 'Unemployment benefits payout agreement page description',
    },
  }),
}
