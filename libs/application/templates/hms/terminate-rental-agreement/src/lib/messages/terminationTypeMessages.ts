import { defineMessages } from 'react-intl'

export const terminationTypeMessages = defineMessages({
  title: {
    id: 'tra.application:terminationType.title',
    defaultMessage: 'Tegund leigusamningsloka',
    description: 'Termination type title',
  },
  multiFieldDescription: {
    id: 'tra.application:terminationType.multiFieldDescription',
    defaultMessage:
      'Vinsamlegast veldu hvaða tegund leigusamningsloka eiga við. Frekari upplýsingar um réttindi og skyldur leigusala og leigjanda má finna í [Húsaleigulögum](https://www.althingi.is/lagas/nuna/1994036.html).',
    description: 'Termination type multi field description',
  },
  checkboxDescription: {
    id: 'tra.application:terminationType.checkboxDescription',
    defaultMessage: 'Veldu hvaða tegund leigusamningsloka á við',
    description: 'Termination type checkbox description',
  },
  terminationWithNoticeLabel: {
    id: 'tra.application:terminationType.terminationWithNotice',
    defaultMessage: 'Uppsögn leigusamnings',
    description: 'Termination with notice label',
  },
  terminationWithoutNoticeLabel: {
    id: 'tra.application:terminationType.terminationWithoutNotice',
    defaultMessage: 'Riftun leigusamnings',
    description: 'Termination without notice label',
  },
  terminationWithNoticeAlertDescription: {
    id: 'tra.application:terminationType.terminationWithNoticeAlertDescription#markdown',
    defaultMessage:
      'Heimildir til uppsagnar er að finna í [XI. kafla](https://www.althingi.is/lagas/nuna/1994036.html#G55) húsaleigulaga.\n\nUppsögn ótímabundins leigusamnings er heimil báðum aðilum hans á leigutíma í tæmandi lista tilvika.\n\nTímabundnum leigusamningi lýkur á umsömdum degi án sérstakrar uppsagnar eða tilkynningar af hálfu aðila.\n\nTímabundnum leigusamningi verður ekki slitið með uppsögn á umsömdum leigutíma',
    description: 'Termination with notice alert description',
  },
  terminationWithoutNoticeAlertDescription: {
    id: 'tra.application:terminationType.terminationWithoutNoticeAlertDescription#markdown',
    defaultMessage:
      'Riftun leigusamnings er neyðarúrræði. Heimildir til riftunar er að finna í [XII. kafla](https://www.althingi.is/lagas/nuna/1994036.html#G59) húsaleigulaga.\n\nRéttindi og skyldur leigusala og leigjanda samkvæmt leigusamningi falla niður frá dagsetningu riftunar og skal leigjandi rýma leiguhúsnæðið þegar í stað nema aðilar semji um annað og skal leigusali þá eiga rétt á greiðslu leigu vegna þess tíma sem líður frá riftun og þar til leigjandi hefur rýmt leiguhúsnæðið samkvæmt samkomulaginu.',
    description: 'Termination without notice alert description',
  },
})
