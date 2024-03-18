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
      id: 'ghb.application:applicant.section.title',
      defaultMessage: 'Upplýsingar um þig',
      description: 'Applicant information section title',
    },
    bankInfo: {
      id: 'ghb.application:applicant.labels.bankInfo',
      defaultMessage: 'Bankaupplýsingar',
      description: 'Bank information',
    },
    bankNumber: {
      id: 'ghb.application:applicant.labels.bankNumber',
      defaultMessage: 'Bankanúmer',
      description: 'Bank number',
    },
    bankLedger: {
      id: 'ghb.application:applicant.labels.bankLedger',
      defaultMessage: 'Höfuðbók',
      description: 'Ledger',
    },
    accountNumber: {
      id: 'ghb.application:applicant.labels.accountNumber',
      defaultMessage: 'Reikningsnúmer',
      description: 'Account number',
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
    deliveryDateTitle: {
      id: 'ghb.application:propertyInformation.deliveryDateTitle',
      defaultMessage: 'Afhendingardagur sem óskað er eftir',
      description: 'Delivery date title',
    },
    deliveryDateDescription: {
      id: 'ghb.application:propertyInformation.deliveryDateDescription',
      defaultMessage: 'Veldu dagsetningu sem þér hentar best.',
      description: 'Delivery date description',
    },
    deliveryDateLabel: {
      id: 'ghb.application:propertyInformation.deliveryDateLabel',
      defaultMessage: 'Afhendingardagur',
      description: 'Delivery date label',
    },
    deliveryDatePlaceholder: {
      id: 'ghb.application:propertyInformation.deliveryDatePlaceholder',
      defaultMessage: 'Veldu dagsetningu',
      description: 'Delivery date placeholder',
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
    otherOrganization: {
      id: 'ghb.application:loanStatus.otherOrganization',
      defaultMessage: 'Önnur lánastofnun',
      description: 'Other organization',
    },
    otherLoanProvider: {
      id: 'ghb.application:loanStatus.otherLoanProvider',
      defaultMessage: 'Nafn annars lánveitanda',
      description: 'Other loan provider',
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
    checkboxText: {
      id: 'ghb.application:loanStatus.checkboxText',
      defaultMessage:
        'Ég er ekki með nein áhvílandi lán á eigninni sem um ræðir',
      description: 'Loan status screen checkbox text',
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
    confirmLoanTakeover: {
      id: 'ghb.application:results.confirmLoanTakeover',
      defaultMessage: 'Ég óska eftir að áhvílandi veðskuldir verði teknar yfir',
      description: 'Confirm loan takeover',
    },
  }),
  sellerStatement: defineMessages({
    sectionTitle: {
      id: 'ghb.application:sellerStatement.section.title',
      defaultMessage: 'Yfirlýsing seljanda',
      description: 'Additional info section title',
    },
    text: {
      id: 'ghb.application:sellerStatement.text#markdown',
      defaultMessage:
        'Ég átti lögheimili í eigninni þann 10. nóvember 2023 sem var eignin þá og er í þinglýstri eigu minni. Í dag er eignin ekki bústaður fjölskyldu minnar eða notaður við atvinnurekstur maka míns.\n\nÉg veiti ríkinu heimild til þess að afla allra nauðsynlegra upplýsinga og ganga um eignina. Nauðsynleg gögn eru öll þinglýst skjöl, áhvílandi veðskuldir, lánastöðu, stöðu krafna, uppgjörsfjárhæðir og skuldir sem og eiga í samskiptum um uppgjör þeirra.\n\nKaupanda er heimilt að leita eftir stöðu opinberra gjalda sem og stöðu vegna kaupa á hita og rafmagns. Einnig er kaupanda heimilt að kanna kvaðir þær sem á eigninni kunna að hvíla og heimild til að hafa samband við aðila þeim tengdum. Ég lýsi því yfir að ég mun ekki fjarlægja fylgifé fasteignarinnar en með fylgifé er átti við fastar innréttingar, útipallar eða heitur pottur. Ég lýsi því yfir að ég skulda ekki fasteignagjöld, rafmagn, hita eða húsfélag. Yfirlýsing þessi tekur einnig til annara skulda við þriðja aðila vegna eignarinnar.',
      description: 'Additional info text',
    },
    confirmationLabel: {
      id: 'ghb.application:sellerStatement.confirmationLabel',
      defaultMessage:
        'Ég óska eftir því að í kaupsamningi sem gerður verður um eignina verðið kveðið á um forgagnsrétt minn til eignarinnar',
      description: 'Confirmation label',
    },
  }),
  preemptiveRight: defineMessages({
    sectionTitle: {
      id: 'ghb.application:preemptiveRight.section.title',
      defaultMessage: 'Forgangsréttur',
      description: 'Preemptive right section title',
    },
    description: {
      id: 'ghb.application:preemptiveRight.description#markdown',
      defaultMessage:
        'Nánari upplýsingar um forgangsrétt er að finna á [upplýsingasíðu Ísland.is](https://island.is/kaup-ibudarhusnaedis-i-grindavik/forgangsrettur).',
      description: 'Preemptive right description',
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
      defaultMessage:
        'Ég óska eftir forgangsrétt á eigninni þegar hún verður seld',
      description: 'Checkbox text',
    },
    preemptiveRightTypeTitle: {
      id: 'ghb.application:overview.preemptiveRightTypeTitle',
      defaultMessage: 'Veldu forgangsrétt',
      description: 'Preemptive right type title',
    },
    preemptiveRightsLabel: {
      id: 'ghb.application:overview.preemptiveRightsLabel',
      defaultMessage: 'Valdir forgangsréttir',
      description: 'Preemptive rights label',
    },
    purchaseRight: {
      id: 'ghb.application:overview.purchaseRight',
      defaultMessage: 'Kaupréttur',
      description: 'Purchase right',
    },
    prePurchaseRight: {
      id: 'ghb.application:overview.prePurchaseRight',
      defaultMessage: 'Forkaupsréttur',
      description: 'Pre purchase right',
    },
    preLeaseRight: {
      id: 'ghb.application:overview.preLeaseRight',
      defaultMessage: 'Forleiguréttur',
      description: 'Pre lease right',
    },
  }),
}
