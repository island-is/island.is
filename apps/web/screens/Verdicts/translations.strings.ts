import { defineMessages } from 'react-intl'

export const m = {
  listPage: defineMessages({
    heading: {
      id: 'web.verdicts:listPage.heading',
      defaultMessage: 'Dómar og úrskurðir',
      description: 'H1 titill',
    },
    description: {
      id: 'web.verdicts:listPage.description',
      defaultMessage: 'Dómar frá öllum dómstigum á Íslandi',
      description: 'Lýsing',
    },
    showAllCourts: {
      id: 'web.verdicts:listPage.showAllCourts',
      defaultMessage: 'Sýna allt',
      description: 'Sýna allt',
    },
    showDistrictCourts: {
      id: 'web.verdicts:listPage.showDistrictCourts',
      defaultMessage: 'Héraðsdómstólar',
      description: 'Héraðsdómstólar',
    },
    caseNumberInputLabel: {
      id: 'web.verdicts:listPage.caseNumberInputLabel',
      defaultMessage: 'Málsnúmer',
      description: 'Málsnúmer (label á málsnúmer input)',
    },
    showCourtOfAppeal: {
      id: 'web.verdicts:listPage.showCourtOfAppeal',
      defaultMessage: 'Landsréttur',
      description: 'Landsréttur',
    },
    showSupremeCourt: {
      id: 'web.verdicts:listPage.showSupremeCourt',
      defaultMessage: 'Hæstiréttur',
      description: 'Hæstiréttur',
    },
    searchInputPlaceholder: {
      id: 'web.verdicts:listPage.searchInputPlaceholder',
      defaultMessage: 'Sláðu inn orð, málsnúmer, málsaðila',
      description: 'Placeholder fyrir leitarbox',
    },
    presentings: {
      id: 'web.verdicts:listPage.presentings',
      defaultMessage: 'Reifun',
      description: 'Reifun',
    },
    revealPresentings: {
      id: 'web.verdicts:listPage.revealPresentings',
      defaultMessage: 'Sjá reifun',
      description: 'Sjá reifun',
    },
    hidePresentings: {
      id: 'web.verdicts:listPage.hidePresentings',
      defaultMessage: 'Fela reifun',
      description: 'Fela reifun',
    },
    courtSelectLabel: {
      id: 'web.verdicts:listPage.courtSelectLabel',
      defaultMessage: 'Veldu dómstól',
      description: 'Label á dómstól select einingu',
    },
    keywordSelectLabel: {
      id: 'web.verdicts:listPage.keywordSelectLabel',
      defaultMessage: 'Lykilorð',
      description: 'Label á lykilorð select einingu',
    },
    caseCategorySelectLabel: {
      id: 'web.verdicts:listPage.caseCategorySelectLabel',
      defaultMessage: 'Málaflokkar',
      description: 'Label á "Málaflokkar" select einingu',
    },
    districtCourtSelectLabel: {
      id: 'web.verdicts:listPage.districtCourtSelectLabel',
      defaultMessage: 'Veldu héraðsdómstól',
      description: 'Label á héraðsdómstól select einingu',
    },
    loadingMoreFailed: {
      id: 'web.verdicts:listPage.loadingMoreFailed',
      defaultMessage:
        'Villa kom upp við að sækja fleiri dóma. Vinsamlegast reynið aftur síðar.',
      description: 'Villuskilaboð ef ekki tekst að sækja fleiri dóma',
    },
    seeMoreVerdicts: {
      id: 'web.verdicts:listPage.seeMoreVerdicts',
      defaultMessage: 'Sjá fleiri dóma ({remainingVerdictCount})',
      description:
        'Texti í hnapp neðst á yfirlitssíðu til að sækja fleiri dóma',
    },
    displayList: {
      id: 'web.verdicts:listPage.displayList',
      defaultMessage: 'Sýna sem lista',
      description: 'Sýna sem lista',
    },
    displayGrid: {
      id: 'web.verdicts:listPage.displayGrid',
      defaultMessage: 'Sýna sem spjöld',
      description: 'Sýna sem spjöld',
    },
    sidebarFilterHeading: {
      id: 'web.verdicts:listPage.sidebarFilterHeading',
      defaultMessage: 'Ítarleit',
      description: 'Ítarleit',
    },
    verdictsFoundPlural: {
      id: 'web.verdicts:listPage.verdictsFoundPlural',
      defaultMessage: 'dómar fundust',
      description: 'dómar fundust (fleirtala)',
    },
    verdictsFoundSingular: {
      id: 'web.verdicts:listPage.verdictsFound',
      defaultMessage: 'dómur fannst',
      description: 'dómur fannst (eintala)',
    },
  }),
  verdictPage: {
    heading: {
      id: 'web.verdicts:verdictPage.heading',
      defaultMessage: 'Dómur',
      description: 'H1 titill á síðu dóms',
    },
    print: {
      id: 'web.verdicts:verdictPage.print',
      defaultMessage: 'Prenta',
      description: 'Texti á prenta hnapp',
    },
    goBack: {
      id: 'web.verdicts:verdictPage.goBack',
      defaultMessage: 'Til baka',
      description: 'Texti á "Til baka" hnapp',
    },
    caseNumberPrefix: {
      id: 'web.verdicts:verdictPage.caseNumberPrefix',
      defaultMessage: 'Mál nr.',
      description: 'Texti á undan málsnúmeri fyrir HTML dóma',
    },
    keywords: {
      id: 'web.verdicts:verdictPage.keywords',
      defaultMessage: 'Lykilorð',
      description: 'Lykilorð',
    },
    presentings: {
      id: 'web.verdicts:verdictPage.presentings',
      defaultMessage: 'Reifun',
      description: 'Reifun',
    },
    htmlVerdictLogoUrl: {
      id: 'web.verdicts:verdictPage.htmlVerdictLogoUrl',
      defaultMessage:
        'https://images.ctfassets.net/8k0h54kbe6bj/40DkdlOOP8LT7a49ytG0vS/71bdcf876b158e860e27b1d249043798/Frame_25613.svg',
      description: 'Logo efst í HTML dómi',
    },
  },
}
