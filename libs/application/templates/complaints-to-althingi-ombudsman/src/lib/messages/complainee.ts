import { defineMessages } from 'react-intl'

export const complainee = {
  general: defineMessages({
    pageTitle: {
      id: `ctao.application:complainee.pageTitle`,
      defaultMessage: 'Kvörtun',
      description: 'Complainee page title',
    },
    complaineeTypeTitle: {
      id: 'ctao.application:complainee.complaineeType',
      defaultMessage: 'Hverjum beinist kvörtunin að?',
      description: 'Complainee type radio selection title',
    },
    conditionsText: {
      id: `ctao.application:complainee.conditionsText`,
      defaultMessage:
        'Hlutverk umboðsmanns Alþingis er að hafa eftirlit með stjórnsýslu ríkis og sveitarfélaga. Þess vegna er ekki hægt að kvarta til umboðsmanns yfir Alþingi, dómstólum og einkaaðilum nema í afmörkuðum tilvikum þegar einkaaðilum hefur verið falið opinbert vald til að taka svokallaðar stjórnvaldsákvarðanir. Eitt af skilyrðunum fyrir því að umboðsmaður Alþingis geti tekið kvörtun til meðferðar er æðra stjórnvald hafi fellt úrskurð sinn í málinu eða að kæruleiðir innan stjórnsýslunnar séu að öðru leyti tæmdar.',
      description: 'Complainee conditions message',
    },
    conditionsTitle: {
      id: 'ctao.application:complainee.conditionsTitle',
      defaultMessage: 'Athugið',
      description: 'Complainee conditions title',
    },
    complaineeNameGovernment: {
      id: 'ctao.application:complainee.complaineeName.government',
      defaultMessage: 'Nafn stjórnvalds sem kvörtun beinist að',
      description: 'Government complainee name title',
    },
    complaineeNameOther: {
      id: 'ctao.application:complainee.complaineeName.other',
      defaultMessage: 'Nafn aðila sem kvörtun beinist að',
      description: 'Other complainee name title',
    },
  }),
  labels: defineMessages({
    governmentComplaint: {
      id: `ctao.application:complainee.governmentComplaint`,
      defaultMessage: 'Kvörtun beinist að stjórnvaldi',
      description: 'Government complaint radio label',
    },
    otherComplaint: {
      id: `ctao.application:complainee.otherComplaint`,
      defaultMessage:
        'Kvörtun beinist að öðrum aðila eða starfsmanni stjórnsýslunnar',
      description: 'Other complaint radio label',
    },
  }),
}
