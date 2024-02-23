import { defineMessage } from 'react-intl'

export const strings = {
  heading: defineMessage({
    id: 'judicial.system.indictments:processing.heading',
    defaultMessage: 'Málsmeðferð',
    description: 'Notaður sem titill á málsmeðferð skrefi í ákærum.',
  }),
  defendantPlea: defineMessage({
    id: 'judicial.system.indictments:processing.defendant_plea_v1',
    defaultMessage:
      'Afstaða {defendantCount, plural, one {sakbornings} other {sakborninga}} til sakarefnis',
    description:
      'Notaður sem titill á "Afstaða sakbornings til sakarefnis" hlutann á Málsmeðferðarskjánum.',
  }),
  defendantName: defineMessage({
    id: 'judicial.system.indictments:processing.defendant_name',
    defaultMessage: 'Ákærði {name}',
    description:
      'Notaður sem undirtitill á "Afstaða sakbornings til sakarefnis" hlutann á Málsmeðferðarskjánum.',
  }),
  pleaGuilty: defineMessage({
    id: 'judicial.system.indictments:processing.plea_guilty',
    defaultMessage: 'Játar sök',
    description:
      'Notaður sem texti í "Játar" valmöguleikanum á Málsmeðferðarskjánum.',
  }),
  pleaNotGuilty: defineMessage({
    id: 'judicial.system.indictments:processing.plea_not_guilty',
    defaultMessage: 'Neitar sök',
    description:
      'Notaður sem texti í "Neitar" valmöguleikanum á Málsmeðferðarskjánum.',
  }),
  pleaNoPlea: defineMessage({
    id: 'judicial.system.indictments:processing.plea_no_plea',
    defaultMessage: 'Tjáir sig ekki / óljóst',
    description:
      'Notaður sem texti í "Tekur ekki afstöðu" valmöguleikanum á Málsmeðferðarskjánum.',
  }),
}
