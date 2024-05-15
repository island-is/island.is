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
    accordionText: {
      id: 'id.application:confirmation.general.accordionText',
      defaultMessage: `* Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis eu nulla porta, luctus mi ac, pharetra mauris\n`,
      description: 'Confirmation accordion text',
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
      id: 'id.application:reviewConfirmation.general.accordionText',
      defaultMessage: `* Umsækjandi skal fara í myndatöku á næsta [afgreiðslustað](https://island.is/nafnskirteini) 
      og **hafa meðferðis núverandi nafnskírteini til að skila inn** sé það fyrir 
      hendi.
      \n* Þú færð senda tilkynningu á Mínar síður þegar nafnskírteinið er tilbúið 
      og hvenær hægt verður að sækja það á þann afhendingarstað sem þú valdir.\n`,
      description: 'Review confirmation accordion text',
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
