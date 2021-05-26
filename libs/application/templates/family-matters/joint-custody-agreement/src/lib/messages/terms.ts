import { defineMessages } from 'react-intl'

// Terms
export const terms = {
  general: defineMessages({
    sectionTitle: {
      id: 'jca.application:section.effect.terms.sectionTitle',
      defaultMessage: 'Réttindi foreldra',
      description: 'Terms section title',
    },
    pageTitle: {
      id: 'jca.application:section.effect.terms.pageTitle',
      defaultMessage:
        'Hvaða áhrif hefur sameiginleg forsjá á réttindi foreldra og barna?',
      description: 'Terms page title',
    },
    description: {
      id: 'jca.application:section.effect.terms.description#markdown',
      defaultMessage:
        'Breytingin hefur margvísleg áhrif og er mikilvægt að foreldrar kynni sér vel hvað hún felur í sér.\\n\\#### Báðir foreldrar ráða högum barns og svara fyrir það\\n\\nForsjá barns felur bæði í sér rétt og skyldu fyrir foreldri til að ráða persónulegum högum barnsins og ákveða búsetustað þess. Foreldrar með sameiginlega forsjá fara bæði með lögformlegt fyrirsvar barns til dæmis í dómsmáli.\\n\\n#### Foreldrar með sameiginlega forsjá eiga að hafa samráð um ákvarðanir\\n\\nForeldrar sem fara sameiginlega með forsjá barns eiga alltaf að leitast við að hafa samráð áður en teknar eru afgerandi ákvarðanir um málefni barns er varða daglegt líf þess, til dæmis um hvar barnið skuli eiga lögheimili og um val á leik- og grunnskóla, um venjulega eða nauðsynlega heilbrigðisþjónustu og reglubundið tómstundastarf.\\n\\n#### Ef samráð foreldra skilar ekki árangri ræður lögheimilisforeldrið\\n\\nLögheimilisforeldrið hefur á hinn bóginn heimild til þess að taka þessar ákvarðanir, ef samráðið skilar ekki árangri. Lögheimilisforeldri hefur því heimild til þess að flytja með barn innanlands og ákveða í hvaða skóla barn skuli ganga.\\n\\n####Barnabætur og aðrar greiðslur tengdar börnum falla til lögheimilisforeldris\\n\\Barnabætur falla til lögheimilisforeldrisins. Jafnframt getur lögheimili barns haft áhrif í ýmsu öðru tilliti, svo sem á húsaleigubætur, námslán, greiðslur vegna örorku, umönnunarbætur og fleira sem þarf að skoða í hverju tilviki. \\n\\n#### Öðru foreldrinu er óheimilt að fara með börnin úr landi án samþykkis hins\\n\\nÞegar foreldrar fara sameiginlega með forsjá barns síns er öðru foreldrinu óheimilt að fara með barnið úr landi án samþykkis hins. Það á við hvort sem um lengri eða skemmri dvöl er að ræða. Ef foreldrar fara saman með forsjá barns og annað þeirra vill fara með barnið í ferðalag til útlanda, til dæmis í sumarfrí, en hitt samþykkir það ekki, er hægt að leita til sýslumanns í umdæmi þar sem barn býr og hann úrskurðar í málinu.',
      description: 'Terms page description',
    },
  }),
  jointCustodyCheckbox: defineMessages({
    label: {
      id: 'jca.application:section.effect.terms.jointCustody.label',
      defaultMessage: 'Ég skil hvaða áhrif breyting á forsjá hefur',
      description: 'Label for joint custody agreement checkbox',
    },
  }),
  legalResidenceCheckbox: defineMessages({
    label: {
      id: 'jca.application:section.effect.terms.legalResidence.label',
      defaultMessage:
        'Ég skil að ríkari réttur til ákvarðana liggur hjá lögheimilisforeldrinu',
      description: 'Label for legal residence checkbox',
    },
  }),
}
