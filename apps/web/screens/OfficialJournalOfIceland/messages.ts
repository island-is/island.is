import { defineMessages } from 'react-intl'

export const m = {
  breadcrumb: defineMessages({
    frontpage: {
      id: 'web.ojoi:breadcrumb.frontpage',
      defaultMessage: 'Ísland.is',
    },
    help: {
      id: 'web.ojoi:breadcrumb.help',
      defaultMessage: 'Leiðbeiningar',
    },
    about: {
      id: 'web.ojoi:breadcrumb.about',
      defaultMessage: 'Um stjórnartíðindi',
    },
  }),
  general: defineMessages({
    seeMore: {
      id: 'web.ojoi:general.seeMore',
      defaultMessage: 'Skoða nánar',
    },
  }),
  home: defineMessages({
    title: {
      id: 'web.ojoi:home.title',
      defaultMessage: 'Stjórnartíðindi',
    },
    description: {
      id: 'web.ojoi:home.description',
      defaultMessage:
        'Um útgáfu Stjórnartíðinda gilda lög um Stjórnartíðindi og Lögbirtingablað nr. 15/2005.',
    },
    featuredImage: {
      id: 'web.ojoi:home.featuredImage',
      defaultMessage:
        'https://images.ctfassets.net/8k0h54kbe6bj/5LqU9yD9nzO5oOijpZF0K0/b595e1cf3e72bc97b2f9d869a53f5da9/LE_-_Jobs_-_S3.png',
    },
    readMore: {
      id: 'web.ojoi:home.readMore',
      defaultMessage: 'Lesa meira',
    },

    inputPlaceholder: {
      id: 'web.ojoi:home.inputPlaceholder',
      defaultMessage: 'Leitaðu í Stjórnartíðindum',
    },
    shortcuts: {
      id: 'web.ojoi:home.shortcuts',
      defaultMessage: 'Flýtileiðir',
    },
    mainCategories: {
      id: 'web.ojoi:home.mainCategories',
      defaultMessage: 'Yfirflokkar',
    },
    latestAdverts: {
      id: 'web.ojoi:home.latestAdverts',
      defaultMessage: 'Nýjustu auglýsingar',
    },
    allCategories: {
      id: 'web.ojoi:home.allCategories',
      defaultMessage: 'Málaflokkar A-Ö',
    },
  }),

  search: defineMessages({
    emptySearchResult: {
      id: 'web.ojoi:search.emptySearchResult',
      defaultMessage: 'Engin mál fundust',
    },
    errorFetchingAdvertsTitle: {
      id: 'web.ojoi:search.errorFetchingAdvertsTitle',
      defaultMessage: 'Ekki tókst að sækja auglýsingar',
    },
    errorFetchingCategoriesTitle: {
      id: 'web.ojoi:search.errorFetchingCategoriesTitle',
      defaultMessage: 'Ekki tókst að sækja málaflokka',
    },
    errorFetchingCategoriesMessage: {
      id: 'web.ojoi:search.errorFetchingCategoriesMessage',
      defaultMessage:
        'Ekki náðist samband við vefþjónustur Stjórnartíðinda, reynið aftur síðar.',
    },
    errorFetchingAdvertsMessage: {
      id: 'web.ojoi:search.errorFetchingAdvertsMessage',
      defaultMessage:
        'Ekki náðist samband við vefþjónustur Stjórnartíðinda, reynið aftur síðar.',
    },
    breadcrumbTitle: {
      id: 'web.ojoi:search.breadcrumbTitle',
      defaultMessage: 'Leitarniðurstöður',
    },
    title: {
      id: 'web.ojoi:search.title',
      defaultMessage: 'Leit í Stjórnartíðindum',
    },
    description: {
      id: 'web.ojoi:search.description',
      defaultMessage:
        'Um útgáfu Stjórnartíðinda gilda lög um Stjórnartíðindi og Lögbirtingablað nr. 15/2005.',
    },

    inputPlaceholder: {
      id: 'web.ojoi:search.inputPlaceholder',
      defaultMessage: 'Leit í Stjórnartíðindum',
    },
    filterTitle: {
      id: 'web.ojoi:search.filterTitle',
      defaultMessage: 'Síun',
    },
    clearFilter: {
      id: 'web.ojoi:search.clearFilter',
      defaultMessage: 'Hreinsa síun',
    },

    departmentLabel: {
      id: 'web.ojoi:search.departmentLabel',
      defaultMessage: 'Deild',
    },
    departmentPlaceholder: {
      id: 'web.ojoi:search.departmentPlaceholder',
      defaultMessage: 'Veldu deild',
    },
    departmentAll: {
      id: 'web.ojoi:search.departmentAll',
      defaultMessage: 'Allar deildir',
    },
    typeLabel: {
      id: 'web.ojoi:search.typeLabel',
      defaultMessage: 'Tegund',
    },
    typePlaceholder: {
      id: 'web.ojoi:search.typePlaceholder',
      defaultMessage: 'Veldu tegund',
    },
    typeAll: {
      id: 'web.ojoi:search.typeAll',
      defaultMessage: 'Allar tegundir',
    },
    chooseYear: {
      id: 'web.ojoi:search.chooseYear',
      defaultMessage: 'Veldu ártal',
    },
    categoriesLabel: {
      id: 'web.ojoi:search.categoriesLabel',
      defaultMessage: 'Málaflokkur',
    },
    categoriesPlaceholder: {
      id: 'web.ojoi:search.categoriesPlaceholder',
      defaultMessage: 'Veldu málaflokk',
    },
    categoriesAll: {
      id: 'web.ojoi:search.categoriesAll',
      defaultMessage: 'Allir flokkar',
    },
    dateFromLabel: {
      id: 'web.ojoi:search.dateFromLabel',
      defaultMessage: 'Útgáfudagsetning frá',
    },
    dateToLabel: {
      id: 'web.ojoi:search.dateToLabel',
      defaultMessage: 'Útgáfudagsetning til',
    },
    dateFromPlaceholder: {
      id: 'web.ojoi:search.dateFromPlaceholder',
      defaultMessage: 'Veldu upphafsdagsetningu',
    },
    dateToPlaceholder: {
      id: 'web.ojoi:search.dateToPlaceholder',
      defaultMessage: 'Veldu lokadagsetningu',
    },
    institutionLabel: {
      id: 'web.ojoi:search.institutionLabel',
      defaultMessage: 'Stofnun',
    },
    institutionPlaceholder: {
      id: 'web.ojoi:search.institutionPlaceholder',
      defaultMessage: 'Veldu stofnun',
    },
    institutionAll: {
      id: 'web.ojoi:search.institutionAll',
      defaultMessage: 'Allir stofnanir',
    },
    allYears: {
      id: 'web.ojoi:search.allYears',
      defaultMessage: 'Öll ár',
    },

    listView: {
      id: 'web.ojoi:search.listView',
      defaultMessage: 'Sýna sem lista',
    },
    cardView: {
      id: 'web.ojoi:search.cardView',
      defaultMessage: 'Sýna sem spjöld',
    },

    notFoundTitle: {
      id: 'web.ojoi:search.notFoundTitle',
      defaultMessage: 'Engin mál fundust',
    },
    notFoundMessage: {
      id: 'web.ojoi:search.notFoundMessage',
      defaultMessage: 'Vinsamlega endurskoðaðu leitarskilyrði',
    },
  }),

  categories: defineMessages({
    breadcrumbTitle: {
      id: 'web.ojoi:categories.breadcrumbTitle',
      defaultMessage: 'Málaflokkar',
    },
    title: {
      id: 'web.ojoi:categories.title',
      defaultMessage: 'Málaflokkar Stjórnartíðinda',
    },
    description: {
      id: 'web.ojoi:categories.description',
      defaultMessage:
        'Um útgáfu Stjórnartíðinda gilda lög um Stjórnartíðindi og Lögbirtingablað nr. 15/2005.',
    },
    searchTitle: {
      id: 'web.ojoi:categories.searchTitle',
      defaultMessage: 'Leit',
    },
    searchPlaceholder: {
      id: 'web.ojoi:categories.searchPlaceholder',
      defaultMessage: 'Leit í flokkum',
    },
    filterTitle: {
      id: 'web.ojoi:categories.filterTitle',
      defaultMessage: 'Síun',
    },
    clearFilter: {
      id: 'web.ojoi:categories.clearFilter',
      defaultMessage: 'Hreinsa síun',
    },
    departmentLabel: {
      id: 'web.ojoi:categories.departmentLabel',
      defaultMessage: 'Deild',
    },
    departmentPlaceholder: {
      id: 'web.ojoi:categories.departmentPlaceholder',
      defaultMessage: 'Veldu deild',
    },
    departmentAll: {
      id: 'web.ojoi:categories.departmentAll',
      defaultMessage: 'Allar deildir',
    },
    mainCategoryLabel: {
      id: 'web.ojoi:categories.mainCategoryLabel',
      defaultMessage: 'Yfirflokkur',
    },
    mainCategoryPlaceholder: {
      id: 'web.ojoi:categories.mainCategoryPlaceholder',
      defaultMessage: 'Veldu yfirflokk',
    },
    mainCategoryAll: {
      id: 'web.ojoi:categories.mainCategoryAll',
      defaultMessage: 'Allir flokkar',
    },
    notFoundMessage: {
      id: 'web.ojoi:categories.notFoundMessage',
      defaultMessage: 'Ekkert fannst fyrir þessi leitarskilyrði',
    },
  }),

  advert: defineMessages({
    title: {
      id: 'web.ojoi:advert.title',
      defaultMessage: 'Auglýsing',
    },
    description: {
      id: 'web.ojoi:advert.description',
      defaultMessage:
        'Sé munur á uppsetningu texta hér að neðan og í PDF skjali gildir PDF skjalið.',
    },
    descriptionEmpty: {
      id: 'web.ojoi:advert.description-empty',
      defaultMessage:
        'Þessi auglýsing var birt fyrir gildistöku laga nr. 15/2005 og er eingöngu á PDF-formi.',
    },
    descriptionPdfOnly: {
      id: 'web.ojoi:advert.description-empty-pdf-only',
      defaultMessage: 'Þessi auglýsing er eingöngu á PDF-formi.',
    },

    sidebarTitle: {
      id: 'web.ojoi:advert.sidebarTitle',
      defaultMessage: 'Upplýsingar um auglýsingu',
    },

    sidebarCorrectionTitle: {
      id: 'web.ojoi:advert.sidebarCorrectionTitle',
      defaultMessage: 'Leiðréttingar',
    },

    similarTitle: {
      id: 'web.ojoi:advert.similarTitle',
      defaultMessage: 'Tengd mál',
    },
    sidebarDepartment: {
      id: 'web.ojoi:advert.sidebarDepartment',
      defaultMessage: 'Deild',
    },
    sidebarInstitution: {
      id: 'web.ojoi:advert.sidebarInstitution',
      defaultMessage: 'Stofnun',
    },
    sidebarCategory: {
      id: 'web.ojoi:advert.sidebarCategory',
      defaultMessage: 'Málaflokkur',
    },
    signatureDate: {
      id: 'web.ojoi:advert.signatureDate',
      defaultMessage: 'Undirritunardagur',
    },
    publicationDate: {
      id: 'web.ojoi:advert.publicationDate',
      defaultMessage: 'Útgáfudagur',
    },
    correctedDate: {
      id: 'web.ojoi:advert.correctedDate',
      defaultMessage: 'Leiðrétt',
    },
    correctionSingular: {
      id: 'web.ojoi:advert.correctionSingular',
      defaultMessage: 'Leiðrétting',
    },
    correctionDoc: {
      id: 'web.ojoi:advert.correctionDoc',
      defaultMessage: 'Leiðrétt skjal',
    },
    getPdf: {
      id: 'web.ojoi:advert.getPdf',
      defaultMessage: 'Sækja PDF',
    },
  }),

  casesInProgress: defineMessages({
    title: {
      id: 'web.ojoi:casesInProgress.title',
      defaultMessage: 'Mál í vinnslu',
    },
    description: {
      id: 'web.ojoi:casesInProgress.description',
      defaultMessage: 'Listi yfir mál sem hafa ekki verið gefin út.',
    },
    notFoundMessage: {
      id: 'web.ojoi:casesInProgress.notFoundMessage',
      defaultMessage: 'Engin mál í vinnslu',
    },
    createdAt: {
      id: 'web.ojoi:casesInProgress.createdAt',
      defaultMessage: 'Innsending',
    },
    status: {
      id: 'web.ojoi:casesInProgress.status',
      defaultMessage: 'Staða',
    },
    requestedPublicationDate: {
      id: 'web.ojoi:casesInProgress.requestedPublicationDate',
      defaultMessage: 'Áætl. útgáfud.',
    },
    advertTitle: {
      id: 'web.ojoi:casesInProgress.advertTitle',
      defaultMessage: 'Heiti',
    },
    involvedParty: {
      id: 'web.ojoi:casesInProgress.involvedParty',
      defaultMessage: 'Stofnun',
    },
  }),
  rss: defineMessages({
    rssFeeds: {
      id: 'web.ojoi:rss.rssFeeds',
      defaultMessage: 'RSS veitur',
    },
    departmentA: {
      id: 'web.ojoi:rss.departmentA',
      defaultMessage:
        'Í A-deild Stjórnartíðinda skal birta lög öll, tilskipanir, opin bréf, auglýsingar og aðrar tilkynningar almenns efnis, sem út eru gefnar af æðsta handhafa framkvæmdarvaldsins, svo og reglur, sem Alþingi kann að setja um framkvæmd almennra málefna í þingsályktunum, sbr. 2. gr. laga nr. 15/2005.',
    },
    departmentB: {
      id: 'web.ojoi:rss.departmentB',
      defaultMessage:
        'Í B-deild Stjórnartíðinda skal birta reglugerðir, erindisbréf, samþykktir og auglýsingar, sem gefnar eru út eða staðfestar af ráðherra, umburðarbréf, ákvarðanir og úrlausnir ráðuneyta, sem almenna þýðingu hafa, veitingar opinberra starfa og lausn frá þeim, er handhafi æðsta framkvæmdarvalds eða ráðherra fer með, reikninga sjóða, ef svo er mælt í staðfestum skipulagsákvæðum þeirra, úrslit alþingiskosninga, skrá yfir félög, firmu og vörumerki, sem tilkynnt hafa verið á árinu, heiðursmerki, nafnbætur og heiðursverðlaun, sem ríkisstjórnin veitir. Einnig skal þar birta reglur sem opinberum stjórnvöldum og stofnunum, öðrum en ráðuneytum, er falið lögum samkvæmt að gefa út, sbr. 1. mgr. 3. gr. laga nr. 15/2005.',
    },
    departmentC: {
      id: 'web.ojoi:rss.departmentC',
      defaultMessage:
        'Í C-deild Stjórnartíðinda skal birta samninga við önnur ríki, svo og auglýsingar varðandi gildi þeirra, sbr. 1. mgr. 4. gr. laga nr. 15/2005.',
    },
  }),
  help: defineMessages({
    title: {
      id: 'web.ojoi:help.title',
      defaultMessage: 'Leiðbeiningar fyrir Stjórnartíðindi',
    },
  }),
  about: defineMessages({
    title: {
      id: 'web.ojoi:about.title',
      defaultMessage: 'Um stjórnartíðindi',
    },
    description: {
      id: 'web.ojoi:about.description',
      defaultMessage: 'Einhver lýsing',
    },
  }),
}
