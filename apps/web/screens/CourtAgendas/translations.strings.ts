import { defineMessages } from 'react-intl'

export const m = {
  listPage: defineMessages({
    closedHearing: {
      id: 'web.courtAgendas:listPage.closedHearing',
      defaultMessage: 'Lokað þinghald',
      description: 'Lokað þinghald',
    },
    timeSeparator: {
      id: 'web.courtAgendas:listPage.timeSeparator',
      defaultMessage: ' til ',
      description: '-',
    },
    judgesSingularPrefix: {
      id: 'web.courtAgendas:listPage.judgesSingularPrefix',
      defaultMessage: 'Dómari',
      description: 'Dómari (eintala)',
    },
    judgesPluralPrefix: {
      id: 'web.courtAgendas:listPage.judgesPluralPrefix',
      defaultMessage: 'Dómarar',
      description: 'Dómarar (fleirtala)',
    },
    heading: {
      id: 'web.courtAgendas:listPage.heading',
      defaultMessage: 'Dagskrá',
      description: 'H1 titill',
    },
    description: {
      id: 'web.courtAgendas:listPage.description',
      defaultMessage: 'Næstu mál á dagskrá dómstólanna',
      description: 'Lýsing',
    },
    openFilter: {
      id: 'web.courtAgendas:listPage.openFilter',
      defaultMessage: 'Opna síu',
      description: 'Opna síu',
    },
    closeFilter: {
      id: 'web.courtAgendas:listPage.closeFilter',
      defaultMessage: 'Loka síu',
      description: 'Loka síu',
    },
    viewResults: {
      id: 'web.courtAgendas:listPage.viewResults',
      defaultMessage: 'Skoða niðurstöður',
      description: 'Skoða niðurstöður',
    },
    showAllCourts: {
      id: 'web.courtAgendas:listPage.showAllCourts',
      defaultMessage: 'Sýna allt',
      description: 'Sýna allt',
    },
    clearFilter: {
      id: 'web.courtAgendas:listPage.clearFilter',
      defaultMessage: 'Hreinsa síu',
      description: 'Hreinsa síu',
    },
    showDistrictCourts: {
      id: 'web.courtAgendas:listPage.showDistrictCourts',
      defaultMessage: 'Héraðsdómstólar',
      description: 'Héraðsdómstólar',
    },
    showCourtOfAppeal: {
      id: 'web.courtAgendas:listPage.showCourtOfAppeal',
      defaultMessage: 'Landsréttur',
      description: 'Landsréttur',
    },
    showSupremeCourt: {
      id: 'web.courtAgendas:listPage.showSupremeCourt',
      defaultMessage: 'Hæstiréttur',
      description: 'Hæstiréttur',
    },
    courtSelectLabel: {
      id: 'web.courtAgendas:listPage.courtSelectLabel',
      defaultMessage: 'Veldu dómstól',
      description: 'Label á dómstóla select einingu',
    },
    dateFromLabel: {
      id: 'web.courtAgendas:listPage.dateFromLabel',
      defaultMessage: 'Frá',
      description: 'Label á "Dagsetning frá" select einingu',
    },
    clearAllFiltersLabel: {
      id: 'web.courtAgendas:listPage.clearAllFiltersLabel',
      defaultMessage: 'Hreinsa allar síur',
      description: 'Label á "Hreinsa allar síur" takka',
    },
    closeAllFiltersLabel: {
      id: 'web.courtAgendas:listPage.closeAllFiltersLabel',
      defaultMessage: 'Loka öllum síum',
      description: 'Label á "Loka öllum síum" takka',
    },
    openAllFiltersLabel: {
      id: 'web.courtAgendas:listPage.openAllFiltersLabel',
      defaultMessage: 'Opna allar síur',
      description: 'Label á "Opna allar síur" takka',
    },
    dateToLabel: {
      id: 'web.courtAgendas:listPage.dateToLabel',
      defaultMessage: 'Til',
      description: 'Label á "Dagsetning til" select einingu',
    },
    dateAccordionLabel: {
      id: 'web.courtAgendas:listPage.dateAccordionLabel',
      defaultMessage: 'Dagsetning',
      description: 'Label á "Dagsetning" accordion einingu',
    },
    districtCourtSelectLabel: {
      id: 'web.courtAgendas:listPage.districtCourtSelectLabel',
      defaultMessage: 'Veldu héraðsdómstól',
      description: 'Label á héraðsdómstól select einingu',
    },
    loadingMoreFailed: {
      id: 'web.courtAgendas:listPage.loadingMoreFailed',
      defaultMessage:
        'Villa kom upp við að sækja fleiri færslur. Vinsamlegast reynið aftur síðar.',
      description: 'Villuskilaboð ef ekki tekst að sækja fleiri færslur',
    },
    seeMoreCourtAgendas: {
      id: 'web.courtAgendas:listPage.seeMorecourtAgendas',
      defaultMessage: 'Sjá fleiri færslur ({remainingCourtAgendasCount})',
      description:
        'Texti í hnapp neðst á yfirlitssíðu til að sækja fleiri færslur',
    },
    sidebarFilterHeading: {
      id: 'web.courtAgendas:listPage.sidebarFilterHeading',
      defaultMessage: 'Ítarleit',
      description: 'Ítarleit',
    },
    courtAgendasFoundPlural: {
      id: 'web.courtAgendas:listPage.courtAgendasFoundPlural',
      defaultMessage: 'færslur fundust',
      description: 'færslur fundust (fleirtala)',
    },
    courtAgendasFoundSingular: {
      id: 'web.courtAgendas:listPage.courtAgendasFound',
      defaultMessage: 'færsla fannst',
      description: 'færsla fannst (eintala)',
    },
  }),
}
