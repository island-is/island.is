import { defineMessages } from 'react-intl'

export const information = {
  general: defineMessages({
    sectionTitle: {
      id: 'ef.application:information.general.sectionTitle',
      defaultMessage: 'Upplýsingar',
      description: 'Title of information section',
    },
    pageTitle: {
      id: 'ef.application:information.general.pageTitle',
      defaultMessage: 'Upplýsingar',
      description: 'Title of information page',
    },
  }),
  labels: {
    bankInformation: defineMessages({
      title: {
        id: 'ef.application:information.labels.bankInformation.title',
        defaultMessage: 'Styrkur vegna kaupa á rafbíl',
        description: 'bankInformation title',
      },
      grantAmount: {
        id: 'ef.application:information.labels.bankInformation.grantAmount',
        defaultMessage: 'Styrkupphæð',
        description: 'bankInformation grant amount label',
      },
      accountInfo: {
        id: 'ef.application:information.labels.bankInformation.accountInfo',
        defaultMessage: 'Bankaupplýsingar',
        description: 'accountInfo title',
      },
      accountNumer: {
        id: 'ef.application:information.labels.bankInformation.accountNumer',
        defaultMessage: 'Reikningsnúmer',
        description: 'account number',
      },
      informationTitle: {
        id: 'ef.application:information.labels.bankInformation.informationTitle',
        defaultMessage: 'Til athugunar!',
        description: 'information title',
      },
      informationDescription: {
        id: 'ef.application:information.labels.bankInformation.informationDescription',
        defaultMessage:
          'Styrkurinn verður lagður inn á reikning þinn innan tveggja daga.',
        description: 'information description',
      },
    }),
    applicant: defineMessages({
      description: {
        id: 'ef.application:information.labels.applicant.description',
        defaultMessage: 'Umsækjandi',
        description: 'applicant description',
      },
      nationalId: {
        id: 'ef.application:information.labels.applicant.nationalId',
        defaultMessage: 'Kennitala',
        description: 'applicant national ID label',
      },
      name: {
        id: 'ef.application:information.labels.applicant.name',
        defaultMessage: 'Fullt nafn',
        description: 'applicant name label',
      },
      email: {
        id: 'ef.application:information.labels.applicant.email',
        defaultMessage: 'Netfang',
        description: 'applicant email label',
      },
      phone: {
        id: 'ef.application:information.labels.applicant.phone',
        defaultMessage: 'Símanúmer',
        description: 'applicant phone number label',
      },
    }),
    vehicle: defineMessages({
      sectionTitle: {
        id: 'ef.application:information.labels.vehicle.sectionTitle',
        defaultMessage: 'Ökutæki',
        description: 'Vehicle section title',
      },
      pageTitle: {
        id: 'ef.application:information.vehicle.pageTitle',
        defaultMessage: 'Upplýsingar um ökutæki',
        description: 'Title of information page',
      },
      title: {
        id: 'ef.application:information.labels.vehicle.title',
        defaultMessage: 'Ökutæki',
        description: 'Vehicle title',
      },
      description: {
        id: 'ef.application:information.labels.vehicle.description',
        defaultMessage:
          'Athugaðu að ekki er veittur styrkur fyrir kaup á bifreiðum sem kosta meira en 10.000.000 kr. Frá og með 1. nóvember 2026 er hámarkið fyrir fólksbíla (M1) 8.000.000 kr.',
        description: 'Vehicle description',
      },
      plate: {
        id: 'ef.application:information.labels.vehicle.plate',
        defaultMessage: 'Númer ökutækis',
        description: 'Vehicle plate number label',
      },
      type: {
        id: 'ef.application:information.labels.vehicle.type',
        defaultMessage: 'Tegund ökutækis',
        description: 'Vehicle type label',
      },
      price: {
        id: 'ef.application:information.labels.vehicle.price',
        defaultMessage: 'Kaupverð með vsk.',
        description: 'Vehicle price label',
      },
      priceHelpTitle: {
        id: 'ef.application:information.labels.vehicle.priceHelpTitle',
        defaultMessage: 'Hvað telst til kaupverðs?',
        description: 'Title of the purchase price help accordion',
      },
      priceHelpText: {
        id: 'ef.application:information.labels.vehicle.priceHelpText#markdown',
        defaultMessage:
          'Gefðu upp kaupverð bílsins.\n\n' +
          '**Teldu með:**\n\n' +
          '* allan búnað sem fylgdi bílnum úr framleiðslu, líka búnað sem var valinn við pöntun, til dæmis lit, innréttingu, felgur og dráttarbeisli\n' +
          '* dekkin sem fylgdu bílnum\n' +
          '* flutningsgjöld, önnur gjöld seljanda og virðisaukaskatt\n\n' +
          '**Dragðu frá:**\n\n' +
          '* afslátt sem seljandi veitti af verði bílsins\n\n' +
          '**Ekki telja með:**\n\n' +
          '* aukahluti sem seljandi seldi sérstaklega, til dæmis mottur, hleðslukapal umfram þann sem fylgdi eða aukasett af dekkjum\n' +
          '* auka dekk, dráttarbeisli eða annan búnað sem seljandi bætti við eftir framleiðslu\n' +
          '* opinber gjöld vegna nýskráningar\n\n' +
          '**Ekki draga frá:**\n\n' +
          '* styrkinn\n' +
          '* verð bíls sem þú lést upp í kaupin\n\n' +
          '**Notaður bíll:**\n\n' +
          '* Ef bíllinn var fyrst skráður erlendis skaltu gefa upp heildarverð með öllu sem fylgdi honum. Ef þú fluttir hann inn bætast við flutningskostnaður og aðflutningsgjöld.',
        description:
          'Definition of the purchase price, shown by the price field',
      },
      registrationDate: {
        id: 'ef.application:information.labels.vehicle.registrationDate',
        defaultMessage: 'Nýskráningar dagsetning',
        description: 'Vehicle registrationDate label',
      },
    }),
    pickVehicle: defineMessages({
      sectionTitle: {
        id: 'ef.application:information.labels.pickVehicle.sectionTitle',
        defaultMessage: 'Veldu ökutæki',
        description: 'Pick vehicle section title',
      },
      title: {
        id: 'ef.application:information.labels.pickVehicle.title',
        defaultMessage: 'Veldu ökutæki sem á að sækja um styrk fyrir',
        description: 'Pick vehicle title',
      },
      description: {
        id: 'ef.application:information.labels.pickVehicle.description',
        defaultMessage:
          'Hér að neðan er listi yfir ökutæki í þinni eigu, nýskráðir frá og með 1. janúar 2024. Veldu það ökutæki sem á að sækja um fyrir.',
        description: 'Pick vehicle description',
      },
      vehicle: {
        id: 'ef.application:information.labels.pickVehicle.vehicle',
        defaultMessage: 'Ökutæki',
        description: 'Pick vehicle label',
      },
      placeholder: {
        id: 'ef.application:information.labels.pickVehicle.placeholder',
        defaultMessage: 'Veldu ökutæki',
        description: 'Pick vehicle placeholder',
      },
      checkboxNotCheckable: {
        id: 'ef.application:information.labels.pickVehicle.checkboxNotCheckable',
        defaultMessage: 'Ökutækið hefur nú þegar fengið styrk',
        description: 'Checkbox not checkable tag label',
      },
      carNotEligable: {
        id: 'ef.application:information.labels.pickVehicle.carNotEligable',
        defaultMessage: 'Ökutækið hefur ekki rétt á styrk',
        description: 'car is not eligable for this grant',
      },
      checkboxCheckableTag: {
        id: 'ef.application:information.labels.pickVehicle.checkboxCheckableTag',
        defaultMessage: 'Styrkur {amount}',
        description: 'Checkbox checkable tag label',
      },
      findPlatePlaceholder: {
        id: 'ef.application:information.labels.pickVehicle.findPlatePlaceholder',
        defaultMessage: 'Sláðu inn plötunúmer',
        description: 'Pick vehicle find plate placeholder',
      },
      findButton: {
        id: 'ef.application:information.labels.pickVehicle.findButton',
        defaultMessage: 'Leita',
        description: 'Pick vehicle find button',
      },
      notFoundTitle: {
        id: 'ef.application:information.labels.pickVehicle.notFoundTitle',
        defaultMessage: 'Eitthvað fór úrskeiðis',
        description: 'vehicle not found',
      },
      notFoundMessage: {
        id: 'ef.application:information.labels.pickVehicle.notFoundMessage',
        defaultMessage: 'Ökutæki með plötunúmerið {plate} fannst ekki',
        description: 'vehicle not found message',
      },
      hasErrorTitle: {
        id: 'ef.application:information.labels.pickVehicle.hasErrorTitle',
        defaultMessage: 'Ekki er hægt að selja þessa bifreið vegna:',
        description: 'Pick vehicle has an error title',
      },
      registrationDate: {
        id: 'ef.application:information.labels.pickVehicle.registrationDate',
        defaultMessage: 'Nýskráningardagur',
        description: 'Vehicle registrationDate label',
      },
    }),
  },
}
