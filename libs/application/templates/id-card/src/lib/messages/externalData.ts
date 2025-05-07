import { defineMessages } from 'react-intl'

export const externalData = {
  dataProvider: defineMessages({
    sectionTitle: {
      id: 'id.application:externalData.dataProvider.sectionTitle',
      defaultMessage: 'Gagnaöflun',
      description: 'External data section title',
    },
    pageTitle: {
      id: 'id.application:externalData.dataProvider.pageTitle',
      defaultMessage: 'Umsókn um nafnskírteini',
      description: 'External data page title',
    },
    subTitle: {
      id: 'id.application:externalData.dataProvider.subTitle',
      defaultMessage: 'Eftirfarandi gögn verða sótt rafrænt',
      description: 'External data sub title',
    },
    checkboxLabel: {
      id: 'id.application:externalData.dataProvider.checkboxLabel',
      defaultMessage: 'Ég skil að ofangreind gögn verði sótt rafrænt',
      description: 'External data checkbox label',
    },
    submitButton: {
      id: 'id.application:externalData.dataProvider.submitButton',
      defaultMessage: 'Hefja umsókn',
      description: 'External data submit button',
    },
  }),
  preInformation: defineMessages({
    sectionTitle: {
      id: 'id.application:externalData.preInformation.sectionTitle',
      defaultMessage: 'Nafnskírteini',
      description: 'Pre information about application section title ',
    },
    title: {
      id: 'id.application:externalData.preInformation.title',
      defaultMessage: 'Nafnskírteini',
      description: 'Pre information about application title',
    },
    description: {
      id: 'id.application:externalData.preInformation.description#markdown',
      defaultMessage:
        'Gefnar eru út tvær tegundir nafnskírteina: Nafnskírteini sem gildir sem ferðaskilríki innan EES og nafnskírteini sem ekki er ferðaskilríki.  Báðar tegundir gilda sem fullgilt persónuskilríki og báðar tegundir eru með örgjörva sem geymir lífkenni handhafa.  Nánari upplýsingar um muninn á þessum tegundum, og hvar ferðaskilríkin eru tekin gild, er að finna á [vef Þjóðskrár](https://www.skra.is/).',
      description: 'Pre information about application description',
    },
    hasValidCardAlert: {
      id: 'id.application:externalData.preInformation.hasValidCardAlert',
      defaultMessage:
        'Vinsamlegast athugið að skila þarf inn gildu nafnskírteini áður en sótt er um nýtt.',
      description: 'Pre information has valid card alert message',
    },
    lostOldCardAlert: {
      id: 'id.application:externalData.preInformation.lostOldCardAlert',
      defaultMessage:
        'Vinsamlega athugaðu að ef eldra skírteini hefur glatast þarf að [tilkynna](https://www.skra.is/umsoknir/eydublod-umsoknir-og-vottord/stok-vara/?productid=7a8b6878-757d-11e9-9452-005056851dd2) það.',
      description: 'Pre information has lost old card alert message',
    },
    parentBIntroText: {
      id: 'id.application:externalData.preInformation.parentBIntroText#markdown',
      defaultMessage: `Í þessu ferli samþykkir þú sem forsjáraðili umsókn **{guardianName}** um vegabréf fyrir **{childName}**. Þegar þessi umsókn hefur verið samþykkt þarf viðkomandi að mæta í myndatöku hjá næsta sýslumanni til þess að vegabréfið geti farið í framleiðslu. Þegar vegabréfið er tilbúið verður hægt að sækja það hjá því sýslumannsembætti sem tilgreint var í umsóknarferlinu. Þetta ferli vistast sjálfkrafa á Mínar síður á Ísland.is. Þar getur þú einnig fylgst með stöðu umsóknar eftir að öll gögn hafa verið send inn.`,
      description: 'parent B preInformation description',
    },
  }),
  nationalRegistry: defineMessages({
    title: {
      id: 'id.application:externalData.nationalRegistry.title',
      defaultMessage: 'Persónuupplýsingar',
      description: 'National Registry title',
    },
    subTitle: {
      id: 'id.application:externalData.nationalRegistry.subTitle',
      defaultMessage:
        'Til þess að auðvelda fyrir sækjum við persónuupplýsingar úr Þjóðskrá til þess að fylla út umsóknina.',
      description: 'National Registry sub title',
    },
  }),
  userProfile: defineMessages({
    title: {
      id: 'id.application:externalData.userProfile.title',
      defaultMessage: 'Netfang og símanúmer',
      description: 'User profile title',
    },
    subTitle: {
      id: 'id.application:externalData.userProfile.subTitle',
      defaultMessage:
        'Upplýsingar frá Mínum síðum á Ísland.is um netfang og símanúmer.',
      description: 'User profile sub title',
    },
  }),
  identityDocument: defineMessages({
    title: {
      id: 'id.application:externalData.identityDocument.title',
      defaultMessage: 'Skilríkjaskrá',
      description: 'Identity document provider title',
    },
    subTitle: {
      id: 'id.application:externalData.identityDocument.subTitle',
      defaultMessage:
        'Til þess að auðvelda þér umsóknarferlið sækjum við núverandi skráningu þína í skílríkjaskrá Þjóðskrár, ásamt börnum sem þú hefur forsjá yfir.',
      description: 'Identity document provider subtitle',
    },
  }),
}
