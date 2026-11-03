import { defineMessages } from 'react-intl'

export const grant = {
  general: defineMessages({
    sectionTitle: {
      id: 'ef.application:grant.general.sectionTitle',
      defaultMessage: 'Styrkur',
      description: 'Title of grant section',
    },
    pageTitle: {
      id: 'ef.application:grant.general.pageTitle',
      defaultMessage: 'Styrkur vegna kaupa á rafbíl',
      description: 'Title of grant page',
    },
    submit: {
      id: 'ef.application:grant.general.submit',
      defaultMessage: 'Senda umsókn',
      description: 'submit button label',
    },
    confirmPriceDefinition: {
      id: 'ef.application:grant.general.confirmPriceDefinition#markdown',
      defaultMessage:
        'Ég staðfesti að upplýsingar í umsókninni eru réttar og að kaupverð er gefið upp samkvæmt [skilgreiningu Loftslags- og orkusjóðs](https://uos.is/orka/orkuskipti/loftslags-og-orkusjodur/rafbilastyrkir) á kaupverði. Mér er ljóst að sjóðurinn getur kallað eftir gögnum um kaupin, svo sem reikningi og kaupsamningi, og að ég þarf að afhenda þau innan þess frests sem sjóðurinn setur. Mér er einnig ljóst að sjóðurinn getur krafist endurgreiðslu styrksins ef upplýsingar reynast rangar eða villandi, ef umbeðin gögn eru ekki afhent innan frestsins eða ef ökutækið er selt úr landi innan þriggja ára frá því að styrkur er veittur.',
      description:
        'Applicant confirms the purchase price definition and the fund rights to request documents and reclaim the grant',
    },
  }),
}
