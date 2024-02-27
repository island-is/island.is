import { defineMessages } from 'react-intl'

export const application = {
  general: defineMessages({
    name: {
      id: 'ghb.application:general.name',
      defaultMessage: 'Kaup á íbúðarhúsnæði í Grindavík',
      description: 'Grindavik Housing Buyout application name',
    },
    submit: {
      id: 'ghb.application:general.submit',
      defaultMessage: 'Senda inn umsókn',
      description: 'Submit application button text',
    },
  }),
  applicant: defineMessages({
    sectionTitle: {
      id: 'ghb.application.applicant:section.title',
      defaultMessage: 'Upplýsingar um þig',
      description: 'Applicant information section title',
    },
  }),
  propertyInformation: defineMessages({
    sectionTitle: {
      id: 'ghb.application.propertyInformation:section.title',
      defaultMessage: 'Upplýsingar um eign',
      description: 'Property information section title',
    },
    sectionDescription: {
      id: 'ghb.application.propertyInformation:section.description',
      defaultMessage:
        'Hér birtast upplýsingar úr fasteignaskrá um fasteignir þínar, lönd og lóðir sem þú ert þinglýstur eigandi að.',
      description: 'Property information section description',
    },
    propertyOwners: {
      id: 'ghb.application.propertyInformation:propertyOwners',
      defaultMessage: 'Þinglýstir eigendur',
      description: 'Property owners',
    },
    propertyPermit: {
      id: 'ghb.application.propertyInformation:propertyPermit',
      defaultMessage: 'Heimild',
      description: 'Property permit',
    },
    ownershipRatio: {
      id: 'ghb.application.propertyInformation:ownershipRatio',
      defaultMessage: 'Eignarhlutfall',
      description: 'Ownership ratio',
    },
    ownerNationalId: {
      id: 'ghb.application.propertyInformation:ownerNationalid',
      defaultMessage: 'Kennitala',
      description: 'Owner national id',
    },
    fireInsuranceValue: {
      id: 'ghb.application.propertyInformation:fireInsuranceValue',
      defaultMessage: 'Brunabótamat',
      description: 'Fire insurance value',
    },
    explaination: {
      id: 'ghb.application.propertyInformation:explaination#markdown',
      defaultMessage:
        'Brunabótamat fasteignar er **{fireInsuranceValue}**\n\nKaupverð fasteignar er **{buyoutPrice}** Áhvílandi lán eru þá tekin af þessari upphæð ef um slíkt er að ræða.\n\n5% af kaupverði fasteignar sem er haldið eftir fram að afsali er **{closingPayment}**\n\n Útreikningur er (kaupverð) - (áhvílandi lán) - (5% af kaupverði).\n\nÚtgreitt við kaupsamning er þá (**{buyoutPrice}** - **{totalLoans}** - **{closingPayment}**) eða **{result}**\n\nAfhending fer fram eigi síðar en 3 mánuðum eftir kaupsamning og afsal eigi síðar en 4 mánuðum eftir kaupsamning.',
      description: 'Property information explaination',
    },
  }),
  loanStatus: defineMessages({
    sectionTitle: {
      id: 'ghb.application.loanStatus:section.title',
      defaultMessage: 'Staða á láni',
      description: 'Loan status section title',
    },
    sectionDescription: {
      id: 'ghb.application.loanStatus:section.description',
      defaultMessage: 'Hér birtast upplýsingar um stöðu á láni fasteignar.',
      description: 'Loan status section description',
    },
    statusOfLoan: {
      id: 'ghb.application.loanStatus:statusOfLoan',
      defaultMessage: 'Uppgreiðsluvirði',
      description: 'Status of loan',
    },
    addLoanTitle: {
      id: 'ghb.application.loanStatus:addLoanTitle',
      defaultMessage: 'Bættu við núverandi stöðu á lánum fasteignar',
      description: 'Add loan title',
    },
    addLoanDescription: {
      id: 'ghb.application.loanStatus:addLoanDescription',
      defaultMessage:
        'Bættu við núverandi stöðu á þínum lánum hjá banka eða lífeyrissjóði.',
      description: 'Add loan description',
    },
    loanProvider: {
      id: 'ghb.application.loanStatus:loanProvider',
      defaultMessage: 'Lánveitandi',
      description: 'Loan provider',
    },
    addNewLoan: {
      id: 'ghb.application.loanStatus:addNewLoan',
      defaultMessage: 'Bæta við nýju láni',
      description: 'Add new loan',
    },
    saveNewLoan: {
      id: 'ghb.application.loanStatus:saveNewLoan',
      defaultMessage: 'Vista lán',
      description: 'Save new loan',
    },
  }),
  results: defineMessages({
    sectionTitle: {
      id: 'ghb.application.results:section.title',
      defaultMessage: 'Útreikningur',
      description: 'Results section title',
    },
  }),
  overview: defineMessages({
    sectionTitle: {
      id: 'ghb.application.overview:section.title',
      defaultMessage: 'Yfirlit',
      description: 'Overview section title',
    },
    sectionDescription: {
      id: 'ghb.application.overview:section.description',
      defaultMessage:
        'Vinsamlegast farðu yfir umsóknina áður en þú sendir hana inn.',
      description: 'Overview section description',
    },
    applicantTitle: {
      id: 'ghb.application.overview:applicantTitle',
      defaultMessage: 'Persónu upplýsingar',
      description: 'Applicant information title',
    },
    propertyTitle: {
      id: 'ghb.application.overview:propertyTitle',
      defaultMessage: 'Fasteign',
      description: 'Property information title',
    },
    compensationAssessmentTitle: {
      id: 'ghb.application.overview:compensationAssessmentTitle',
      defaultMessage: 'Brunabótamat',
      description: 'Compensation assessment title',
    },
    buyoutPriceTitle: {
      id: 'ghb.application.overview:buyoutPriceTitle',
      defaultMessage: 'Kaupverð 95% af brunabótamati',
      description: 'Buyout Price title',
    },
    totalLoanTitle: {
      id: 'ghb.application.overview:totalLoanTitle',
      defaultMessage: 'Lán á fasteign',
      description: 'Total loan title',
    },
    loanStatusTitle: {
      id: 'ghb.application.overview:loanStatusTitle',
      defaultMessage: 'Staða á láni',
      description: 'Loan status title',
    },
  }),
}
