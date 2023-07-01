import { defineMessages } from 'react-intl'

export const parentBIntro = {
  general: defineMessages({
    sectionTitle: {
      id: 'crc.application:section.parentBIntro.general.sectionTitle',
      defaultMessage: 'Inngangur',
      description: 'Parent B Intro Page Title',
    },
    pageTitle: {
      id: 'crc.application:section.parentBIntro.general.pageTitle',
      defaultMessage: 'Umsókn um breytt lögheimili barns',
      description: 'Parent b intro page title',
    },
    description: {
      id: 'crc.application:section.parentBIntro.general.description',
      defaultMessage:
        '{otherParentName} hefur sent þér drög um að breyta lögheimili barna ykkar. Ef samkomulag er um flutning ferð þú í gegnum ferlið hér, undirrita rafrænt og samningurinn fer svo til vinnslu hjá sýslumanni.',
      description: 'Parent b intro page description',
    },
  }),
  disagreement: defineMessages({
    title: {
      id: 'crc.application:section.parentBIntro.disagreement.title',
      defaultMessage: 'Er ágreiningur um breytinguna?',
      description: 'Title for disagreement',
    },
    description: {
      id: 'crc.application:section.parentBIntro.disagreement.description#markdown',
      defaultMessage:
        'Ef ágreiningur er á milli foreldra um breytingu á lögheimili barnsins eða barnanna er þetta umsóknarferli, sem lýkur með því að báðir foreldrar undirrita samning, ekki ákjósanlegur farvegur. Foreldri sem óskar eftir því að flytja lögheimili barns til sín án fyrirfram samkomulags við hitt foreldrið getur sent rökstudda beiðni á sýslumann.\\n\\n - [Beiðni um breytingu á lögheimilibarns.](https://island.is/umsoknir/breytt-logheimili-barns) \\n\\n - Nánari upplýsingar á [vefsíðu sýslumanns.](https://www.syslumenn.is/)',
      description: 'Description for disagreement',
    },
  }),
  interview: defineMessages({
    title: {
      id: 'crc.application:section.parentBIntro.interview.title',
      defaultMessage: 'Ertu með frekari spurningar?',
      description: 'Title for interview',
    },
    description: {
      id: 'crc.application:section.parentBIntro.interview.description#markdown',
      defaultMessage:
        'Við bendum á að alltaf er í boði að bóka viðtal hjá sýslumanni hvort sem um ágreiningsmál sé að ræða eður ei. [Bóka viðtal hjá sýslumanni.](https://www.syslumenn.is/timabokanir)',
      description: 'Description for interview',
    },
  }),
  contract: defineMessages({
    accept: {
      id: 'crc.application:section.parentBIntro.contract.accept',
      defaultMessage: 'Ég vil halda áfram í yfirlestur og undirritunarferli',
      description: 'Text for radio button to accept contract',
    },
    reject: {
      id: 'crc.application:section.parentBIntro.contract.reject',
      defaultMessage: 'Ég hafna ofangreindri breytingu ',
      description: 'Text for radio button to reject contract',
    },
  }),
}
