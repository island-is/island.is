import { defineMessages } from 'react-intl'

export const complainee = {
  general: defineMessages({
    sectionTitle: {
      id: `ctao.application:complainee.sectionTitle`,
      defaultMessage: 'Upplýsingar um þann sem kvörtun beinist að',
      description: 'Complainee section title',
    },
    sectionDescription: {
      id: 'ctao.application:complainee.sectionDescription#markdown',
      defaultMessage:
        'Umboðsmaður Alþingis hefur eftirlit með stjórnsýslu ríkis og sveitarfélaga. Það þýðir að hann hefur fyrst og fremst eftirlit með ráðuneytum og ríkisstofnunum, opinberum nefndum, sveitarfélögum, stofnunum sveitarfélaga o.þ.h. Það er hins vegar ekki hægt að kvarta til umboðsmanns yfir störfum Alþingis og stofnana þess eða dómstóla. Það er ekki heldur hægt að kvarta yfir einkaaðilum nema í afmörkuðum tilvikum þegar þeim hefur verið falið opinbert vald til að taka svokallaðar stjórnvaldsákvarðanir. Ef þú telur þig þurfa frekari upplýsingar um starfssvið umboðsmanns er hægt að nálgast þær á [umbodsmadur.is](https://www.umbodsmadur.is) eða með því að hafa samband við skrifstofu umboðsmanns í síma [+354 510 6700](tel:+3545106700).',
      description: 'Complainee section description',
    },
  }),
  labels: defineMessages({
    governmentComplaint: {
      id: `ctao.application:complainee.governmentComplaint`,
      defaultMessage:
        'Kvörtunin beinist að stjórnvaldi eða starfsmanni stjórnsýslunnar',
      description: 'Government complaint radio label',
    },
    otherComplaint: {
      id: `ctao.application:complainee.otherComplaint`,
      defaultMessage: 'Kvörtunin beinist að öðrum aðila',
      description: 'Other complaint radio label',
    },
    complaineeNameGovernmentTitle: {
      id: 'ctao.application:complainee.complaineeName.government.title',
      defaultMessage:
        'Heiti stjórnvalds eða annars aðila sem kvörtun beinist að',
      description: 'Government complainee name input title',
    },
    complaineeNameGovernmentPlaceholder: {
      id: 'ctao.application:complainee.complaineeName.government.placeholder',
      defaultMessage: 'Settu inn nafn stjórnvalds',
      description: 'Government complainee name input placeholder',
    },
    complaineeNameOtherTitle: {
      id: 'ctao.application:complainee.complaineeName.other.title',
      defaultMessage: 'Nafn á aðila sem kvörtun beinist að',
      description: 'Other complainee name input title',
    },
    complaineeNameOtherPlaceholder: {
      id: 'ctao.application:complainee.complaineeName.other.placeholder',
      defaultMessage: 'Settu inn nafn aðila',
      description: 'Other complainee name input placeholder',
    },
  }),
}
