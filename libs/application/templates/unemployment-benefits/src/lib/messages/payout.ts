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
    accountBankNumber: {
      id: 'vmst.ub.application:payout.payoutInformation.accountBankNumber',
      defaultMessage: 'Banki',
      description: 'payout account bank label',
    },
    accountTypeNumber: {
      id: 'vmst.ub.application:payout.payoutInformation.accountTypeNumber',
      defaultMessage: 'HB',
      description: 'payout account type number label',
    },
    accountNumber: {
      id: 'vmst.ub.application:payout.payoutInformation.accountNumber',
      defaultMessage: 'Reikningsnúmer',
      description: 'payout account number label',
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
    datePlaceholder: {
      id: 'vmst.ub.application:payout.vacation.datePlaceholder',
      defaultMessage: 'Veldu dagsetningu',
      description: 'Vacation date placeholder',
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
      defaultMessage: `Umsækjendur sem þiggja bætur frá stéttarfélagi eða sjúkradagpeninga þurfa að skila inn staðfestingu ef við á.\n
Ef viðkomandi er að fá tekjur frá TR þá eru þær komnar inn í reit merktur Greiðslur frá Tryggingastofnun.\n
Ef viðkomandi er að fá lífeyri þá er upphæðin komin frá RSK í reit merktur Lífeyrisgreiðslur`,
      description: 'Other benefits page description',
    },
    paymentsFromInsuraceDescription: {
      id: 'vmst.ub.application:payout.otherBenefits.paymentsFromInsuraceDescription',
      defaultMessage: `Greiðslur frá Tryggingastofnun`,
      description: 'Other benefits payments from insurance description',
    },
    paymentsFromInsurace: {
      id: 'vmst.ub.application:payout.otherBenefits.paymentsFromInsurace',
      defaultMessage: 'Upphæð á mánuði',
      description: 'Other benefits payments from insurance label',
    },
    paymentsFromPensionDescription: {
      id: 'vmst.ub.application:payout.otherBenefits.paymentsFromPensionDescription',
      defaultMessage: `Greiðslur frá lífeyrissjóði/um`,
      description: 'Other benefits payments from pension description',
    },
    typeOfPayment: {
      id: 'vmst.ub.application:payout.otherBenefits.typeOfPayment',
      defaultMessage: 'Tegund greiðslu',
      description: 'Other benefits type of payment label',
    },
    paymentAmount: {
      id: 'vmst.ub.application:payout.otherBenefits.paymentAmount',
      defaultMessage: 'Upphæð á mánuði',
      description: 'Other benefits payment amount label',
    },
    paymentsFromSicknessAllowance: {
      id: 'vmst.ub.application:payout.otherBenefits.paymentsFromSicknessAllowance',
      defaultMessage: 'Greiðsla sjúkradagpeninga',
      description: 'Other benefits payments from sickness allowance label',
    },
    union: {
      id: 'vmst.ub.application:payout.otherBenefits.union',
      defaultMessage: 'Stéttarfélag',
      description: 'Other benefits union label',
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
    fileHeader: {
      id: 'vmst.ub.application:payout.otherBenefits.fileHeader',
      defaultMessage: 'Staðfesting á sjúkradagpeningum',
      description: 'Other benefits file header',
    },
    fileDescription: {
      id: 'vmst.ub.application:payout.otherBenefits.fileDescription',
      defaultMessage: `Tekið er við skjölum með endingu: .pdf, .docx, .rtf`,
      description: 'Other benefits file description',
    },
    payedFromPrivatePensionFundQuestion: {
      id: 'vmst.ub.application:payout.otherBenefits.payedFromPrivatePensionFundQuestion',
      defaultMessage: 'Ertu að fá greitt úr séreignarsjóði?',
      description: 'Other benefits payed from private pension fund question',
    },
    payedFromPrivatePensionFundAlertMessage: {
      id: 'vmst.ub.application:payout.otherBenefits.payedFromPrivatePensionFundAlertMessage#markdown',
      defaultMessage: `Þetta á aðeins við ef að séreignasjóðsgreiðslur eru greiddar út en ekki ef séreignasjóður er greiddur beint inn á lán.`,
      description:
        'Other benefits payed from private pension fund alert message',
    },
    payedFromPrivatePensionFundLabel: {
      id: 'vmst.ub.application:payout.otherBenefits.payedFromPrivatePensionFundLabel',
      defaultMessage: 'Séreignarsjóður',
      description: 'Other benefits payed from private pension fund label',
    },
    amountFromPrivatePensionFund: {
      id: 'vmst.ub.application:payout.otherBenefits.amountFromPrivatePensionFund',
      defaultMessage: 'Upphæð',
      description: 'Other benefits amount from private pension fund label',
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
