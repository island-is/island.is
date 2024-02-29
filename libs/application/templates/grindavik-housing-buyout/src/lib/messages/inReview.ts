import { defineMessages } from 'react-intl'

export const inReview = defineMessages({
  alertMessage: {
    id: 'ghb.application:inReview.alertMessage',
    defaultMessage:
      'Umsókn þín um kaup ríkisins á íbúðarhúsnæði þínu er móttekin og fer í vinnslu hjá fasteignafélaginu Þórkötlu. Stefnt er að því að afgreiðsla taki 2-4 vikur.',
    description: 'In review alert text',
  },
  nextSteps: {
    id: 'ghb.application:inReview.nextSteps#markdown',
    defaultMessage:
      '- Samantekt á umsókn þinni er að finna í Stafræna pósthólfinu þínu.\n- Ef það vantar gögn við vinnslu umsóknar þinnar verður haft samband við þig.\n- Stefnt er að því að umsóknarferlið verði ekki meira en 2-4 vikur.\n- Svör við helstu spurningum er að finna á upplýsingasíðu [Ísland.is](https://island.is/kaup-ibudarhusnaedis-i-grindavik).\n- Ef þú vilt hætta við umsókn þá sendirðu á xxxx',
    description: 'In review expandable description',
  },
  buttonText: {
    id: 'ghb.application:inReview.buttonText',
    defaultMessage: 'Mínar síður',
    description: 'In review button text',
  },
})
