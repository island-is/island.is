import { defineMessages } from 'react-intl'

export const confirmation = {
  general: defineMessages({
    sectionTitle: {
      id: 'id.application:confirmation.general.sectionTitle',
      defaultMessage: 'Staðfesting',
      description: 'Confirmation section title',
    },
    alertTitle: {
      id: 'id.application:confirmation.general.alertTitle',
      defaultMessage: 'Umsókn þín um nafnskírteini hefur verið móttekin',
      description: 'Confirmation alert title',
    },
    accordionTitle: {
      id: 'id.application:confirmation.general.accordionTitle',
      defaultMessage: 'Hvað gerist næst?',
      description: 'Confirmation accordion title',
    },
  }),
}

export const reviewConfirmation = {
  general: defineMessages({
    sectionTitle: {
      id: 'id.application:reviewConfirmation.general.sectionTitle',
      defaultMessage: 'Staðfesting',
      description: 'Review confirmation section title',
    },
    alertTitle: {
      id: 'id.application:reviewConfirmation.general.alertTitle',
      defaultMessage: 'Samþykki móttekið!',
      description: 'Review confirmation alert title',
    },
    accordionTitle: {
      id: 'id.application:reviewConfirmation.general.accordionTitle',
      defaultMessage: 'Hvað gerist næst?',
      description: 'Review confirmation accordion title',
    },
    accordionText: {
      id: 'id.application:reviewConfirmation.general.accordionText#markdown',
      defaultMessage: `* Þú þarft að mæta í myndatöku á næsta umsóknarstað.
      \n* Umsókn er opin í 60 daga eftir forskráningu og mæta þarf til myndatöku innan þess tíma.  Ef af einhverjum ástæðum er ekki mætt í myndatöku, eða hætt er við umsókn að þeim tíma liðnum, þarf umsækjandi sjálfur að óska eftir endurgreiðslu með því að senda póst á endurgreidsla@island.is
      \n* Þú færð senda tilkynningu á Mínar síður þegar nafnskírteinið er tilbúið og hvenær hægt verður að sækja það á þann afhendingarstað sem þú valdir.\n`,
      description: 'Review confirmation accordion text',
    },
    accordionTextForChild: {
      id: 'id.application:reviewConfirmation.general.accordionTextForChild#markdown',
      defaultMessage: `* Forsjáraðili þarf að mæta með barni í myndatöku á [umsóknarstað](https://island.is/nafnskirteini).
      \n* Hafi báðir forsjá raðiliar samþykkt útgáfu nafnskírteinis barns er hún opin í 60 daga.  
      Ef að einhverjum ástæðum er ekki mætt í myndatöku að þeim tíma liðnum þarf að sækja um 
      endurgreiðslu með því að senda póst á [endurgreidsla@island.is](endurgreidsla@island.is).
      \n* Geti FORSJÁRAÐILI ekki mætt með barni í myndatöku þarf að veita þriðja aðila 
      [umboð til þess](https://island.is/nafnskirteini).\n`,
      description:
        'Review confirmation accordion text when applying for a child',
    },
    infoMessageText1: {
      id: 'id.application:reviewConfirmation.general.infoMessageText1',
      defaultMessage:
        'Athugaðu að forsjáraðili 2 hefur 7 daga til að samþykkja umsóknina inni á island.is - ef hún er ekki samþykkt að þeim tíma liðnum er endurgreitt sjálfkrafa.',
      description: 'Review confirmation first information message',
    },
    infoMessageText2: {
      id: 'id.application:reviewConfirmation.general.infoMessageText2',
      defaultMessage:
        'Athugaðu að eftir að báðir forsjáraðilar hafa samþykkt umsókn er hún opin í 60 daga inni á island.is - að þeim tíma liðnum þarf að sækja um endurgreiðslu ef ekki er mætt í myndatöku.',
      description: 'Review confirmation second information message',
    },
    bottomButtonMessage: {
      id: 'id.application:reviewConfirmation.general.bottomButtonMessage',
      defaultMessage:
        'Á mínum síðum og í appi eru nú margvíslegar upplýsingar s.s. stafrænt pósthólf, þínar upplýsingar, fjármál, umsóknir, menntun, ökutæki, skírteini, starfsleyfi o.fl.',
      description: 'Review confirmation bottom button message',
    },
  }),
}

export const reviewRejection = {
  general: defineMessages({
    sectionTitle: {
      id: 'id.application:reviewRejection.general.sectionTitle',
      defaultMessage: 'Umsókn hafnað',
      description: 'Review confirmation section title',
    },
    alertTitle: {
      id: 'id.application:reviewRejection.general.alertTitle',
      defaultMessage: `Þú hefur hafnað umsókn um nafnskírteini með ferðaheimild fyrir {name}.`,
      description: 'Review confirmation alert title',
    },
    accordionTitle: {
      id: 'id.application:reviewRejection.general.accordionTitle',
      defaultMessage: 'Hvað gerist næst?',
      description: 'Review confirmation accordion title',
    },
    accordionText: {
      id: 'id.application:reviewRejection.general.accordionText',
      defaultMessage: `* Umsækjandi, {guardian1}, fær tilkynningu um að umsókninni 
      hafi verið hafnað.
      \n* Et aliquet commodo vel et et netus. Pellentesque commodo 
      porttitor malesuada tellus mi et non. Tincidunt leo vivamus 
      egestas sed adipiscing cursus feugiat habitant. Facilisi 
      iaculis ut leo tortor imperdiet erat. Volutpat bibendum 
      faucibus integer habitant. Dolor.
      \n* Augue fames nulla ipsum ultrices non. Ornare nisi amet 
      aliquet ullamcorper nunc.`,
      description: 'Review confirmation accordion text',
    },
    bottomButtonMessage: {
      id: 'id.application:reviewRejection.general.bottomButtonMessage',
      defaultMessage:
        'Á mínum síðum og í appi eru nú margvíslegar upplýsingar s.s. stafrænt pósthólf, þínar upplýsingar, fjármál, umsóknir, menntun, ökutæki, skírteini, starfsleyfi o.fl.',
      description: 'Review confirmation bottom button message',
    },
  }),
}
