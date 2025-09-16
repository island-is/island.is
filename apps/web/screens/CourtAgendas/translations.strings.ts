import { defineMessages } from 'react-intl'

export const m = {
  listPage: defineMessages({
    timeSeparator: {
      id: 'web.courtAgendas:listPage.timeSeparator',
      defaultMessage: ' til ',
      description: '-',
    },
    judgesSingluarPrefix: {
      id: 'web.courtAgendas:listPage.judgesSingluarPrefix',
      defaultMessage: 'Dómari',
      description: 'Dómari (eintala)',
    },
    judgesPluralPrefix: {
      id: 'web.courtAgendas:listPage.judgesPluralPrefix',
      defaultMessage: 'Dómarar',
      description: 'Dómarar (fleirtala)',
    },
    revealMoreLabel: {
      id: 'web.courtAgendas:listPage.revealMoreLabel',
      defaultMessage: 'Sjá reifun',
      description: 'Sjá reifun',
    },
    hideMoreLabel: {
      id: 'web.courtAgendas:listPage.hideMoreLabel',
      defaultMessage: 'Fela reifun',
      description: 'Fela reifun',
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
    caseNumberInputLabel: {
      id: 'web.courtAgendas:listPage.caseNumberInputLabel',
      defaultMessage: 'Sláðu inn málsnúmer',
      description: 'Málsnúmer (label á málsnúmer input)',
    },
    caseNumberAccordionLabel: {
      id: 'web.courtAgendas:listPage.caseNumberAccordionLabel',
      defaultMessage: 'Málsnúmer',
      description: 'Málsnúmer (label á málsnúmer accordion einingu)',
    },
    lawsAccordionLabel: {
      id: 'web.courtAgendas:listPage.lawsAccordionLabel',
      defaultMessage: 'Lagagreinar',
      description: 'Label á "Lagagreinar" accordion einingu',
    },
    lawsInputLabel: {
      id: 'web.courtAgendas:listPage.lawsInputLabel',
      defaultMessage: 'Sláðu inn lagagrein',
      description: 'Label á "Lagagreinar" input',
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
    showRetrialCourt: {
      id: 'web.courtAgendas:listPage.showRetrialCourt',
      defaultMessage: 'Endurupptökudómur',
      description: 'Endurupptökudómur',
    },
    searchInputPlaceholder: {
      id: 'web.courtAgendas:listPage.searchInputPlaceholder',
      defaultMessage: 'Sláðu inn orð, málsnúmer, málsaðila',
      description: 'Placeholder fyrir leitarbox',
    },
    presentings: {
      id: 'web.courtAgendas:listPage.presentings',
      defaultMessage: 'Reifun',
      description: 'Reifun',
    },
    revealPresentings: {
      id: 'web.courtAgendas:listPage.revealPresentings',
      defaultMessage: 'Sjá reifun',
      description: 'Sjá reifun',
    },
    hidePresentings: {
      id: 'web.courtAgendas:listPage.hidePresentings',
      defaultMessage: 'Fela reifun',
      description: 'Fela reifun',
    },
    courtSelectLabel: {
      id: 'web.courtAgendas:listPage.courtSelectLabel',
      defaultMessage: 'Veldu dómstól',
      description: 'Label á dómstóla select einingu',
    },
    keywordAccordionLabel: {
      id: 'web.courtAgendas:listPage.keywordAccordionLabel',
      defaultMessage: 'Lykilorð',
      description: 'Label á lykilorð accordion einingu',
    },
    keywordSelectPlaceholder: {
      id: 'web.courtAgendas:listPage.keywordSelectPlaceholder',
      defaultMessage: 'Veldu lykilorð',
      description: 'Placeholder á lykilorð select einingu',
    },
    caseTypeAccordionLabel: {
      id: 'web.courtAgendas:listPage.caseTypeAccordionLabel',
      defaultMessage: 'Málategundir',
      description: 'Label á "Málategundir" accordion einingu',
    },
    caseCategoryAccordionLabel: {
      id: 'web.courtAgendas:listPage.caseCategoryAccordionLabel',
      defaultMessage: 'Málaflokkur',
      description: 'Label á "Málaflokkur" accordion einingu',
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
    displayList: {
      id: 'web.courtAgendas:listPage.displayList',
      defaultMessage: 'Sýna sem lista',
      description: 'Sýna sem lista',
    },
    displayGrid: {
      id: 'web.courtAgendas:listPage.displayGrid',
      defaultMessage: 'Sýna sem spjöld',
      description: 'Sýna sem spjöld',
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
