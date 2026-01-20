import { defineMessages } from 'react-intl'

export const payout = {
  general: defineMessages({
    sectionTitle: {
      id: 'vmst.ub.application:payout.general.sectionTitle',
      defaultMessage: 'Greiðslur',
      description: 'payout section page title',
    },
  }),
  labels: defineMessages({}),
  payoutInformation: defineMessages({
    sectionTitle: {
      id: 'vmst.ub.application:payout.payoutInformation.sectionTitle',
      defaultMessage: 'Greiðsluupplýsingar',
      description: 'applicant payout section title',
    },
    pageTitle: {
      id: 'vmst.ub.application:payout.payoutInformation.pageTitle',
      defaultMessage: 'Greiðsluupplýsingar',
      description: 'payout page description',
    },
    accountLabel: {
      id: 'vmst.ub.application:payout.payoutInformation.accountLabel',
      defaultMessage: 'Reikningsupplýsingar',
      description: 'payout account label',
    },
    unionQuestion: {
      id: 'vmst.ub.application:payout.payoutInformation.unionQuestion',
      defaultMessage: 'Viltu greiða í stéttarfélag?',
      description: 'payout union question',
    },
    unionLabel: {
      id: 'vmst.ub.application:payout.payoutInformation.unionLabel',
      defaultMessage: 'Stéttafélag',
      description: 'payout union label',
    },
    unionAlertTitle: {
      id: 'vmst.ub.application:payout.payoutInformation.unionAlertTitle',
      defaultMessage: 'Athugið',
      description: 'payout union alert title',
    },
    unionAlertMessage: {
      id: 'vmst.ub.application:payout.payoutInformation.unionAlertMessage',
      defaultMessage: `Með því að velja „nei” missir þú áunninn rétt hjá stéttarfélagi þínu.`,
      description: 'payout union alert message',
    },
    pensionFundLabel: {
      id: 'vmst.ub.application:payout.payoutInformation.pensionFundLabel',
      defaultMessage: 'Lífeyrissjóður',
      description: 'payout pension fund label',
    },
    privatePensionFundQuestion: {
      id: 'vmst.ub.application:payout.payoutInformation.privatePensionFundQuestion',
      defaultMessage: 'Viltu greiða í séreignarsjóð?',
      description: 'payout private pension fund question',
    },
    privatePensionFundLabel: {
      id: 'vmst.ub.application:payout.payoutInformation.privatePensionFundLabel',
      defaultMessage: 'Séreignarsjóður',
      description: 'payout private pension fund label',
    },
    privatePensionFundPercentageLabel: {
      id: 'vmst.ub.application:payout.payoutInformation.privatePensionFundPercentageLabel',
      defaultMessage: 'Hlutfall',
      description: 'payout private pension fund percentage label',
    },
    privatePensionFundPercentageAlertMessage: {
      id: 'vmst.ub.application:payout.payoutInformation.privatePensionFundPercentageAlertMessage',
      defaultMessage: `Atvinnuleysisbætursjóður greiðir ekki mótframlag í séreignarsjóð.`,
      description: 'payout private pension fund percentage alert message',
    },
  }),
  taxDiscount: defineMessages({
    sectionTitle: {
      id: 'vmst.ub.application:payout.taxDiscount.sectionTitle',
      defaultMessage: 'Persónuafsláttur',
      description: 'applicant tax discount section title',
    },
    pageTitle: {
      id: 'vmst.ub.application:payout.taxDiscount.pageTitle',
      defaultMessage: 'Persónuafsláttur',
      description: 'Tax discount page description',
    },
    description: {
      id: 'vmst.ub.application:payout.taxDiscount.description#markdown',
      defaultMessage: `Sláðu inn hlutfall persónuafsláttar sem þú vilt nýta. Ef 0% þá nýtir þú engan persónuafslátt.`,
      description: 'Tax discount page description',
    },
    taxDiscountLabel: {
      id: 'vmst.ub.application:payout.taxDiscount.taxDiscountLabel',
      defaultMessage: 'Persónuafsláttur',
      description: 'Tax discount label',
    },
    taxDiscountPlaceholder: {
      id: 'vmst.ub.application:payout.taxDiscount.taxDiscountPlaceholder',
      defaultMessage: 'Sláðu inn persónuafslátt í prósentum (0-100%)',
      description: 'Tax discount placeholder',
    },
    taxDiscountAlertMessage: {
      id: 'vmst.ub.application:payout.taxDiscount.taxDiscountAlertMessage#markdown',
      defaultMessage: `Nálgast má nánari upplýsingar um persónuafslátt á heimasíðu [Skattsins](https://www.skatturinn.is/).`,
      description: 'Tax discount alert message',
    },
  }),
  vacation: defineMessages({
    sectionTitle: {
      id: 'vmst.ub.application:payout.vacation.sectionTitle',
      defaultMessage: 'Orlof',
      description: 'applicant vacation section title',
    },
    pageTitle: {
      id: 'vmst.ub.application:payout.vacation.pageTitle',
      defaultMessage: 'Orlof',
      description: 'Vactaion page description',
    },
    vacationAlertMessage: {
      id: 'vmst.ub.application:payout.vacation.vacationAlertMessage',
      defaultMessage: `Ef þú átt inni ótekið orlof eða hefur fengið greitt orlof við starfslok þarftu að skrá dagsetningu orlofsdaga. Athugaðu að þú getur ekki fengið atvinnuleysisbætur og orlof greitt á sama tímabili.`,
      description: 'Vacation alert message',
    },
    haveVacationQuestion: {
      id: 'vmst.ub.application:payout.vacation.haveVacationQuestion',
      defaultMessage: 'Áttu ótekið orlof þegar þú hættir í starfi?',
      description: 'Do you have vacation question',
    },
    explainVacationLabel: {
      id: 'vmst.ub.application:payout.vacation.explainVacationLabel',
      defaultMessage:
        'Vinsamlegast tilgreindu fjölda orlofsdaga og hvenær þú ætlar að nýta þá',
      description: 'Explain vacation label',
    },
    explainVacationDescription: {
      id: 'vmst.ub.application:payout.vacation.explainVacationDescription',
      defaultMessage: `Námundaðu upp í næsta heila dag, dæmi: 8 tímar=1 dagur, 9 tímar=2 dagar, 15 tímar=2 dagar, 16 tímar=2 dagar, 17 tímar=3 dagar.`,
      description: 'Explain vacation description',
    },
    vacationDaysLabel: {
      id: 'vmst.ub.application:payout.vacation.vacationDaysLabel',
      defaultMessage: 'Fjöldi orlofsdaga',
      description: 'Vacation days label',
    },
    dateStart: {
      id: 'vmst.ub.application:payout.vacation.dateStart',
      defaultMessage: 'Dagsetning frá',
      description: 'Vacation start date label',
    },
    dateEnd: {
      id: 'vmst.ub.application:payout.vacation.dateEnd',
      defaultMessage: 'Dagsetning til',
      description: 'Vacation end date label',
    },
  }),
  vacationsAndForeignWorkAgreement: defineMessages({
    sectionTitle: {
      id: 'vmst.ub.application:payout.vacationsAndForeignWorkAgreement.sectionTitle',
      defaultMessage: 'Dvöl og/eða vinna erlendis',
      description: 'Vacations and foreign work agreement section title',
    },
    pageTitle: {
      id: 'vmst.ub.application:payout.vacationsAndForeignWorkAgreement.pageTitle',
      defaultMessage: 'Utanlandsferðir og atvinna erlendis',
      description: 'Vacations and foreign work agreement page description',
    },
    pageDescription: {
      id: 'vmst.ub.application:payout.vacationsAndForeignWorkAgreement.pageDescription#markdown',
      defaultMessage: `Ef þú ferð til útlanda verður þú alltaf að láta Vinnumálastofnun 
      vita áður en þú ferð. Þú getur tilkynnt um utanlandsferð á Mínum síðum. Þú átt 
      ekki rétt á atvinnuleysisbótum á meðan þú ert erlendis nema að þú hafir fengið 
      útgefið vottorð (U2) sem heimilar atvinnuleit á Evrópska efnahagssvæðinu.
      \n Ef þú ætlar að leita þér að vinnu erlendis er gott að byrja á að skoða 
    [www.eures.is](www.eures.is) og tala við EURES ráðgjafa Vinnumálastofnunar.`,
      description: 'Vacations and foreign work agreement page description',
    },
  }),
  otherBenefits: defineMessages({
    sectionTitle: {
      id: 'vmst.ub.application:payout.otherBenefits.sectionTitle',
      defaultMessage: 'Aðrar greiðslur',
      description: 'applicant other benefits section title',
    },
    pageTitle: {
      id: 'vmst.ub.application:payout.otherBenefits.pageTitle',
      defaultMessage: 'Aðrar bætur eða lífeyrir',
      description: 'Other benefits page description',
    },
    pageDescription: {
      id: 'vmst.ub.application:payout.otherBenefits.pageDescription#markdown',
      defaultMessage: `Ef þú ert að fá greiðslur frá stéttarfélagi, tryggingastofnun eða lífeyrissjóði þá fyllir þú það út hér. Hægt er að bæta við dálkum ef greiðslur berast frá fleiri en einum aðila. `,
      description: 'Other benefits page description',
    },
    paymentsDescription: {
      id: 'vmst.ub.application:payout.otherBenefits.paymentsDescription',
      defaultMessage: `Ert þú að fá greiðslur frá Tryggingastofnun, lífeyrissjóði, séreignasjóði eða sjúkradagpeninga?`,
      description: 'Other benefits payments from insurance description',
    },
    typeOfPayment: {
      id: 'vmst.ub.application:payout.otherBenefits.typeOfPayment',
      defaultMessage: 'Tegund greiðslu',
      description: 'Other benefits type of payment label',
    },
    subTypeOfPayment: {
      id: 'vmst.ub.application:payout.otherBenefits.subTypeOfPayment',
      defaultMessage: 'Undirtegund greiðslu',
      description: 'Other benefits sub type of payment label',
    },
    paymentAmount: {
      id: 'vmst.ub.application:payout.otherBenefits.paymentAmount',
      defaultMessage: 'Upphæð á mánuði',
      description: 'Other benefits payment amount label',
    },
    unionPayer: {
      id: 'vmst.ub.application:payout.otherBenefits.unionPayer',
      defaultMessage: 'Stéttarfélag',
      description: 'Union payer label',
    },
    pensionFundPayer: {
      id: 'vmst.ub.application:payout.otherBenefits.pensionFundPayer',
      defaultMessage: 'Lífeyrissjóður',
      description: 'Pension fund payer label',
    },
    privatePensionFundPayer: {
      id: 'vmst.ub.application:payout.otherBenefits.privatePensionFundPayer',
      defaultMessage: 'Séreignasjóður',
      description: 'Private pension payer label',
    },
    dateFrom: {
      id: 'vmst.ub.application:payout.otherBenefits.dateFrom',
      defaultMessage: 'Tímabil frá',
      description: 'Other benefits date from label',
    },
    dateTo: {
      id: 'vmst.ub.application:payout.otherBenefits.dateTo',
      defaultMessage: 'Tímabil til',
      description: 'Other benefits date to label',
    },
    sickessAllowanceFileHeader: {
      id: 'vmst.ub.application:payout.otherBenefits.sickessFileHeader',
      defaultMessage: 'Staðfesting á sjúkradagpeningum',
      description: 'Other benefits sickess allowance file header',
    },
    paymentPlanFileHeader: {
      id: 'vmst.ub.application:payout.otherBenefits.paymentPlanFileHeader',
      defaultMessage: 'Staðfesting á greiðsluáætlun',
      description: 'Other benefits payment plan file header',
    },
    payedFromPrivatePensionFundAlertMessage: {
      id: 'vmst.ub.application:payout.otherBenefits.payedFromPrivatePensionFundAlertMessage#markdown',
      defaultMessage: `Þetta á aðeins við ef að séreignasjóðsgreiðslur eru greiddar út en ekki ef séreignasjóður er greiddur beint inn á lán.`,
      description:
        'Other benefits payed from private pension fund alert message',
    },
  }),
  capitalIncome: defineMessages({
    sectionTitle: {
      id: 'vmst.ub.application:payout.capitalIncome.sectionTitle',
      defaultMessage: 'Fjármagnstekjur',
      description: 'applicant capital income section title',
    },
    pageTitle: {
      id: 'vmst.ub.application:payout.capitalIncome.pageTitle',
      defaultMessage: 'Fjármagnstekjur',
      description: 'Capital income page description',
    },
    pageDescription: {
      id: 'vmst.ub.application:payout.capitalIncome.description#markdown',
      defaultMessage: `Ertu að fá aðrar tekjur en þær sem flokkast undir launatekjur? Eins og t.d. leigutekjur, vaxtatekjur, arð eða söluhagnað?
      \n [Nánar um fjármagnstekjur hér](https://www.skatturinn.is/einstaklingar/fjarmagnstekjur/)`,
      description: 'Capital income page description',
    },
    amountLabel: {
      id: 'vmst.ub.application:payout.capitalIncome.amountLabel',
      defaultMessage: 'Upphæð á mánuði',
      description: 'Capital income amount label',
    },
  }),
  unemploymentBenefitsPayoutAgreement: defineMessages({
    sectionTitle: {
      id: 'vmst.ub.application:payout.unemploymentBenefitsPayoutAgreement.sectionTitle',
      defaultMessage: 'Útborgun',
      description: 'Unemployment benefits payout agreement section title',
    },
    pageTitle: {
      id: 'vmst.ub.application:payout.unemploymentBenefitsPayoutAgreement.pageTitle',
      defaultMessage: 'Útborgun atvinnuleysisbóta',
      description: 'Unemployment benefits payout agreement description',
    },
    pageDescription: {
      id: 'vmst.ub.application:payout.unemploymentBenefitsPayoutAgreement.pageDescription#markdown',
      defaultMessage: `Greiðsla atvinnuleysisbóta tekur annaðhvort mið af þeim degi sem staðfest umsókn er send eða þegar uppsagnarfresti lýkur, svo lengi sem umsókn berst fyrir þann tíma.\n
Útborgun atvinnuleysisbóta er síðasta virka dag hvers mánaðar.\n
Greiðslutímabilið er frá fyrsta til síðasta dags mánaðar. Til dæmis fyrir 1. janúar – 31. janúar kemur greiðsla síðasta virka daginn í janúar.\n
Upphæðin lækkar eftir því sem bótarétturinn er minni en þú verður að hafa að minnsta kosti stundað 25% starf í 3 mánuði á síðastliðnum 12 mánuðum.`,
      description: 'Unemployment benefits payout agreement page description',
    },
  }),
}
