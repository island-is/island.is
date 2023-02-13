import { defineMessages } from 'react-intl'

export const confirmation = {
  general: defineMessages({
    sectionTitle: {
      id: 'ta.avr.application:confirmation.general.sectionTitle',
      defaultMessage: 'Staðfesting',
      description: 'Title of confirmation screen',
    },
    alertTitle: {
      id: 'ta.avr.application:confirmation.general.alertTitle',
      defaultMessage: 'Umsókn þín hefur verið móttekin',
      description: 'Confirmation general alert title',
    },
    alertMessage: {
      id: 'ta.avr.application:confirmation.general.alertMessage',
      defaultMessage:
        'Umsókn þín um nafnleynd í ökutækjaskrá hefur verið móttekin',
      description: 'Confirmation general alert message',
    },
    accordionTitle: {
      id: 'ta.avr.application:confirmation.general.accordionTitle',
      defaultMessage: 'Hvað gerist næst?',
      description: 'Confirmation accordion title',
    },
    accordionText: {
      id: 'ta.avr.application:confirmation.general.accordionText',
      defaultMessage:
        `* Nafnleynd verður skráð í  ökutækjaskrá Samgöngustofu og tekur einungis til þeirra upplýsinga sem veittar eru hjá Samgöngustofu, þ.e. ekki til annarra aðila sem hafa aðgang að ökutækjaskránni.\n` +
        `* Leyndin tekur til tveggja þátta: ` +
        `Gagnvart uppflettingu í ökutækjaskrá á Mínu svæði Samgöngustofu. Ekkert er gefið upp um núverandi eiganda / umráðamann sem óskað hefur nafnleyndar. ` +
        `Nafn viðkomandi fer ekki á póstlista (auglýsingar, kyvittnningar, happadrætti, o.þ.h.). `,
      description: 'Confirmation accordion text',
    },
  }),
}
