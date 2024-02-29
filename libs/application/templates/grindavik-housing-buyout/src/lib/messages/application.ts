import { defineMessages } from 'react-intl'

export const application = {
  general: defineMessages({
    name: {
      id: 'ghb.application:general.name',
      defaultMessage: 'Kaup ríkis á íbúðarhúsnæði í Grindavík',
      description: 'Grindavik Housing Buyout application name',
    },
    institutionName: {
      id: 'ghb.application:general.institutionName',
      defaultMessage: 'Sýslumenn',
      description: 'Institution name',
    },
    submit: {
      id: 'ghb.application:general.submit',
      defaultMessage: 'Senda inn umsókn',
      description: 'Submit application button text',
    },
  }),
  applicant: defineMessages({
    sectionTitle: {
      id: 'ghb.application:applicant:section.title',
      defaultMessage: 'Upplýsingar um þig',
      description: 'Applicant information section title',
    },
  }),
  propertyInformation: defineMessages({
    sectionTitle: {
      id: 'ghb.application:propertyInformation.section.title',
      defaultMessage: 'Upplýsingar um eign',
      description: 'Property information section title',
    },
    sectionDescription: {
      id: 'ghb.application:propertyInformation.section.description',
      defaultMessage:
        'Hér birtast upplýsingar úr fasteignaskrá um fasteignir þínar, lönd og lóðir sem þú ert þinglýstur eigandi að.',
      description: 'Property information section description',
    },
    propertyOwners: {
      id: 'ghb.application:propertyInformation.propertyOwners',
      defaultMessage: 'Þinglýstir eigendur',
      description: 'Property owners',
    },
    propertyPermit: {
      id: 'ghb.application:propertyInformation.propertyPermit',
      defaultMessage: 'Heimild',
      description: 'Property permit',
    },
    ownershipRatio: {
      id: 'ghb.application:propertyInformation.ownershipRatio',
      defaultMessage: 'Eignarhlutfall',
      description: 'Ownership ratio',
    },
    ownerNationalId: {
      id: 'ghb.application:propertyInformation.ownerNationalid',
      defaultMessage: 'Kennitala',
      description: 'Owner national id',
    },
    fireInsuranceValue: {
      id: 'ghb.application:propertyInformation.fireInsuranceValue',
      defaultMessage: 'Brunabótamat fasteignar',
      description: 'Fire insurance value',
    },
  }),
  additionalOwners: defineMessages({
    sectionTitle: {
      id: 'ghb.application:additionalOwners.section.title',
      defaultMessage: 'Aðrir eigendur',
      description: 'Additional owners section title',
    },
    sectionDescription: {
      id: 'ghb.application:additionalOwners.section.description',
      defaultMessage:
        'Hér þarf að slá inn tengiupplýsingar fyrir aðra eigendur fasteignarinnar.',
      description: 'Additional owners section description',
    },
    owner: {
      id: 'ghb.application:additionalOwners.owner',
      defaultMessage: 'Eigandi',
      description: 'Owner',
    },
  }),
  loanStatus: defineMessages({
    sectionTitle: {
      id: 'ghb.application:loanStatus.section.title',
      defaultMessage: 'Staða á láni',
      description: 'Loan status section title',
    },
    sectionDescription: {
      id: 'ghb.application:loanStatus.section.description',
      defaultMessage: 'Hér birtast upplýsingar um stöðu á láni fasteignar.',
      description: 'Loan status section description',
    },
    statusOfLoan: {
      id: 'ghb.application:loanStatus.statusOfLoan',
      defaultMessage: 'Uppgreiðsluvirði',
      description: 'Status of loan',
    },
    addLoanTitle: {
      id: 'ghb.application:loanStatus.addLoanTitle',
      defaultMessage: 'Bættu við núverandi stöðu á lánum fasteignar',
      description: 'Add loan title',
    },
    addLoanDescription: {
      id: 'ghb.application:loanStatus.addLoanDescription',
      defaultMessage:
        'Upplýsingar um stöðu lána er að finna hjá lánveitenda. Uppgreiðsluverð láns er sú upphæð sem fylla skal inn.',
      description: 'Add loan description',
    },
    loanProvider: {
      id: 'ghb.application:loanStatus.loanProvider',
      defaultMessage: 'Lánveitandi',
      description: 'Loan provider',
    },
    addNewLoan: {
      id: 'ghb.application:loanStatus.addNewLoan',
      defaultMessage: 'Bæta við láni',
      description: 'Add new loan',
    },
    saveNewLoan: {
      id: 'ghb.application:loanStatus.saveNewLoan',
      defaultMessage: 'Vista lán',
      description: 'Save new loan',
    },
    additionalInfo: {
      id: 'ghb.application:loanStatus.additionalInfo#markdown',
      defaultMessage:
        'Ef þú ert ekki með lán hjá neinum lánveitanda hér fyrir ofan þá getur þú xxx ...',
      description: 'Loan status info',
    },
  }),
  results: defineMessages({
    sectionTitle: {
      id: 'ghb.application:results.section.title',
      defaultMessage: 'Útreikningur',
      description: 'Results section title',
    },
    explaination: {
      id: 'ghb.application:results.explaination#markdown',
      defaultMessage:
        'Kaupverð er 95% af brunabótamati fasteignar.\n\n5% af kaupverði fasteignar er haldið eftir fram að afsali.\n\nÁhvílandi lán eru tekin af kaupverði fasteignar ef um slíkt er að ræða.',
      description: 'Property information explaination',
    },
    infoText: {
      id: 'ghb.application:results.infoText',
      defaultMessage:
        'Afhending fer fram eigi síðar en 3 mánuðum eftir kaupsamning og afsal eigi síðar en 4 mánuðum eftir kaupsamning.',
      description: 'Property information info text',
    },
    tableDescription: {
      id: 'ghb.application:results.tableDescription',
      defaultMessage: 'Lýsing',
      description: 'Results table description',
    },
    tableValue: {
      id: 'ghb.application:results.tableValue',
      defaultMessage: 'Upphæð',
      description: 'Results table value',
    },
    payment: {
      id: 'ghb.application:results.payment',
      defaultMessage: 'Útgreitt við kaupsamning',
      description: 'Payment text',
    },
    fireAssessment: {
      id: 'ghb.application:results.fireAssessment',
      defaultMessage: 'Brunabótamat fasteignar',
      description: 'Fire assessment text',
    },
    buyoutPrice: {
      id: 'ghb.application:results.buyoutPrice',
      defaultMessage: 'Kaupverð 95% af brunabótamati',
      description: 'Buyout price text',
    },
    totalLoan: {
      id: 'ghb.application:results.totalLoan',
      defaultMessage: 'Áhvílandi lán',
      description: 'Total loan text',
    },
    total: {
      id: 'ghb.application:results.total',
      defaultMessage: 'Útgreitt samtals',
      description: 'Total text',
    },
    closingPayment: {
      id: 'ghb.application:results.closingPayment',
      defaultMessage: '5% af kaupverði sem er haldið eftir fram að afsali',
      description: 'Closing payment text',
    },
  }),
  overview: defineMessages({
    sectionTitle: {
      id: 'ghb.application:overview.section.title',
      defaultMessage: 'Yfirlit',
      description: 'Overview section title',
    },
    sectionDescription: {
      id: 'ghb.application:overview.section.description',
      defaultMessage:
        'Vinsamlegast farðu yfir umsóknina áður en þú sendir hana inn.',
      description: 'Overview section description',
    },
    applicantTitle: {
      id: 'ghb.application:overview.applicantTitle',
      defaultMessage: 'Persónu upplýsingar',
      description: 'Applicant information title',
    },
    propertyTitle: {
      id: 'ghb.application:overview.propertyTitle',
      defaultMessage: 'Fasteign',
      description: 'Property information title',
    },
    compensationAssessmentTitle: {
      id: 'ghb.application:overview.compensationAssessmentTitle',
      defaultMessage: 'Brunabótamat',
      description: 'Compensation assessment title',
    },
    buyoutPriceTitle: {
      id: 'ghb.application:overview.buyoutPriceTitle',
      defaultMessage: 'Kaupverð 95% af brunabótamati',
      description: 'Buyout Price title',
    },
    totalLoanTitle: {
      id: 'ghb.application:overview.totalLoanTitle',
      defaultMessage: 'Lán á fasteign',
      description: 'Total loan title',
    },
    loanStatusTitle: {
      id: 'ghb.application:overview.loanStatusTitle',
      defaultMessage: 'Staða á láni',
      description: 'Loan status title',
    },
    resultTitle: {
      id: 'ghb.application:overview.resultTitle',
      defaultMessage: 'Útreikningur',
      description: 'Result title',
    },
    checkboxText: {
      id: 'ghb.application:overview.checkboxText',
      defaultMessage: 'Ég skil að...',
      description: 'Checkbox text',
    },
  }),
}
