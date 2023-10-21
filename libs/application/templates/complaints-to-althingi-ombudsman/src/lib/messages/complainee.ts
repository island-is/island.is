import { defineMessages } from 'react-intl'

export const complainee = {
  general: defineMessages({
    sectionTitle: {
      id: `ctao.application:complainee.sectionTitle`,
      defaultMessage: 'Upplýsingar um þann sem kvörtun beinist að',
      description: 'Complainee section title',
    },
    sectionDescription: {
      id: 'ctao.application:complainee.sectionDescription',
      defaultMessage:
        'Hlutverk umboðsmanns Alþingis er að hafa eftirlit með stjórnsýslu ríkis og sveitarfélaga. Þess vegna er ekki hægt að kvarta til umboðsmanns yfir Alþingi, dómstólum og einkaaðilum nema í afmörkuðum tilvikum þegar einkaaðilum hefur verið falið opinbert vald til að taka svokallaðar stjórnvaldsákvarðanir. Eitt af skilyrðunum fyrir því að umboðsmaður Alþingis geti tekið kvörtun til meðferðar er æðra stjórnvald hafi fellt úrskurð sinn í málinu eða að kæruleiðir innan stjórnsýslunnar séu að öðru leyti tæmdar.',
      description: 'Complainee section description',
    },
  }),
  labels: defineMessages({
    governmentComplaint: {
      id: `ctao.application:complainee.governmentComplaint`,
      defaultMessage: 'Kvörtunin beinist að stjórnvaldi',
      description: 'Government complaint radio label',
    },
    otherComplaint: {
      id: `ctao.application:complainee.otherComplaint`,
      defaultMessage:
        'Kvörtunin beinist að öðrum aðila eða starfsmanni stjórnsýslunnar',
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
