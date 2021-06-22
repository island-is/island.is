import { defineMessages } from 'react-intl'

export const complainee = {
  general: defineMessages({
    pageTitle: {
      id: `ctao.application:complainee.pageTitle`,
      defaultMessage: 'Hverjum beinist kvörtunin að?',
      description: 'Definition of complainee page title',
    },
    conditionsText: {
      id: `ctao.application:complainee.conditionsText`,
      defaultMessage:
        'Hlutverk umboðsmanns Alþingis er að hafa eftirlit með stjórnsýslu ríkis og sveitarfélaga. Þess vegna er ekki hægt að kvarta til umboðsmanns yfir Alþingi, dómstólum og einkaaðilum nema í afmörkuðum tilvikum þegar einkaaðilum hefur verið falið opinbert vald til að taka svokallaðar stjórnvaldsákvarðanir. Eitt af skilyrðunum fyrir því að umboðsmaður Alþingis geti tekið kvörtun til meðferðar er æðra stjórnvald hafi fellt úrskurð sinn í málinu eða að kæruleiðir innan stjórnsýslunnar séu að öðru leyti tæmdar.',
      description: 'Definition of complainee conditions message',
    },
    conditionsTitle: {
      id: 'ctao.application:complainee.conditionsTitle',
      defaultMessage: 'Athugið',
      description: 'Defination of complainee conditions title',
    },
    complaineeNameGovernment: {
      id: 'ctao.application:complainee.complaineeName.government',
      defaultMessage: 'Nafn stjórnvalds sem kvörtun beinist að',
      description: 'Defination of government complainee name title',
    },
    complaineeNameOther: {
      id: 'ctao.application:complainee.complaineeName.other',
      defaultMessage: 'Nafn aðila sem kvörtun beinist að',
      description: 'Defination of other complainee name title',
    },
  }),
  labels: defineMessages({
    governmentComplaint: {
      id: `ctao.application:complainee.governmentComplaint`,
      defaultMessage: 'Kvörtun beinist að stjórnvaldi',
      description: 'Definition of government complaint radio label',
    },
    otherComplaint: {
      id: `ctao.application:complainee.otherComplaint`,
      defaultMessage:
        'Kvörtun beinist að öðrum aðila eða starfsmanni stjórnsýslunnar',
      description: 'Definition of other complaint radio label',
    },
  }),
}
