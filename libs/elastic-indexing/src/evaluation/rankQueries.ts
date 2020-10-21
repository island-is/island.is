import { Request } from '../../../api/content-search/src/queries/rankEvaluation'

// Rank queries will be processed
// and request attribute will be replaced with a standard search query, with the string as searchTerm
// _index will be replaced with the current index in use

export const rankQueries: Request[] = [
  {
    id: 'single-synonym',
    request: 'bál',
    ratings: [
      { _index: '_all', _id: '2mCfmijL65wP7qekLZ2RtH', rating: 1 }, // title: Leyfi fyrir brennu
    ],
  },
  {
    id: 'synonym-with-popular-word',
    request: 'bál umsókn',
    ratings: [
      { _index: '_all', _id: '2mCfmijL65wP7qekLZ2RtH', rating: 1 }, // title: Leyfi fyrir brennu
    ],
  },
  {
    id: 'high-profile-stafraent-okuskirteini',
    request: 'Stafrænt ökuskírteini',
    ratings: [
      { _index: '_all', _id: 'fZxwXvRXLTUgfeiQmoR3l', rating: 9 }, // title: Stafrænt ökuskírteini
      { _index: '_all', _id: '1Trciz91KZW13hKVrHaHsX', rating: 8 }, // title: Algengar spurningar um þjónustu Ísland.is
      { _index: '_all', _id: '7nKD0EiCdhC37T7e7VyUwY', rating: 7 }, // title: Ökuskírteini, almenn umsókn
    ],
  },
  {
    id: 'compound-high-profile-faedingarorlof',
    request: 'fæðingarorlof',
    ratings: [
      { _index: '_all', _id: '3w3dsda6V9iCPhEP40TpuU', rating: 9 }, // title: Réttindi starfsmanns í fæðingarorlofi
      { _index: '_all', _id: '59HH2C3hOLYYhFVY4fiX0G', rating: 8 }, // title: Fæðingarorlof fyrir foreldra á innlendum vinnumarkaði
      { _index: '_all', _id: '2Q46wjXrMSL1l5FUlGi5QX', rating: 7 }, // title: Forsjárlausir foreldrar, réttindi til fæðingarorlofs
    ],
  },
  {
    id: 'compound-aramotabrenna',
    request: 'áramótabrenna',
    ratings: [
      { _index: '_all', _id: '2mCfmijL65wP7qekLZ2RtH', rating: 2 }, // title: Leyfi fyrir brennu
      { _index: '_all', _id: '73qZVxqcCo5iErCesii33I', rating: 1 }, // title: Leyfi til að brenna sinu
    ],
  },
  {
    id: 'part-of-popular-compound-orlof',
    request: 'orlof',
    ratings: [
      { _index: '_all', _id: '4n0yzq68tt1lHlkW33G4Jg', rating: 10 }, // title: Orlofsréttur
      { _index: '_all', _id: '5mr5YSYQLVGHzwS0E9q9Ei', rating: 9 }, // title: Vangreitt orlof
      { _index: '_all', _id: '3w3dsda6V9iCPhEP40TpuU', rating: 8 }, // title: Réttindi starfsmanns í fæðingarorlofi
      { _index: '_all', _id: '5VJRlfLQmGN5D1bog3dFX0', rating: 7 }, // title: Foreldraorlof án rétts til greiðslna
      { _index: '_all', _id: '5yh8KJ7BVr2KeliHlfubTY', rating: 6 }, // title: Ráðningarsamningur við erlenda starfsmenn
      { _index: '_all', _id: '3nSvy45isDXUPuMbPApoVP', rating: 5 }, // title: Fósturlát og andvana fæðing, réttindi til fæðingarorlofs
      { _index: '_all', _id: '3vTJup1Nk3lwB6AtzhX1ps', rating: 5 }, // title: Að stofna fyrirtæki
      { _index: '_all', _id: '2OL9R7dQwIfGHGlbprHe9z', rating: 4 }, // title: Veikindaréttur
      { _index: '_all', _id: '2m5aJp95ECqRw9WtuvCIyT', rating: 3 }, // title: Kjarasamningar og aðilar vinnumarkaðarins
      { _index: '_all', _id: '2F6n9qoAWTG1ekp12VTQOD', rating: 2 }, // title: Að eignast barn
      { _index: '_all', _id: 'VM5OiLpdHHInwHoSJLb53', rating: 1 }, // title: Stofnun fyrirtækis – almennar upplýsingar
    ],
  },
  {
    id: 'popular-word-skattur',
    request: 'skattur',
    ratings: [
      { _index: '_all', _id: '6rtr288qVOjyddl2LVroNi', rating: 10 }, // title: Skattur af vöxtum og arði
      { _index: '_all', _id: '6e3SWIyt0ayXwSuqB4HiiE', rating: 9 }, // title: Persónuafsláttur og skattur af launum
      { _index: '_all', _id: '3vTJup1Nk3lwB6AtzhX1ps', rating: 7 }, // title: Að stofna fyrirtæki
      { _index: '_all', _id: '1TTXfamiqT1ouLc46OwRLq', rating: 6 }, // title: Bifreiðatryggingar og -gjöld
    ],
  },
]
