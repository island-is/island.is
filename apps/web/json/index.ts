export const categories = [
  {
    title: 'Fjölskyldumál og velferð',
    description:
      'Meðal annars fæðingarorlof, nöfn, forsjá, gifting og skilnaður.',
  },
  {
    title: 'Eldri borgarar',
    description: 'Þjónusta, réttindi og lífeyrismál.',
  },
  {
    title: 'Bætur',
    description: 'Bótagreiðslur til einstaklinga frá ríki og sveitarfélögum.',
  },
  {
    title: 'Málefni fatlaðra',
    description: 'Réttindi, bætur, jafnrétti og umönnun.',
  },
  {
    title: 'Menntun',
    description:
      'Leikskólar, grunnskólar, framhaldsskólar, háskólar, styrkir og lán.',
  },
  {
    title: 'Ferðalög og búseta erlendis',
    description: 'Útgáfa vegabréfa, evrópska sjúkrakortið, störf erlendis.',
  },
  {
    title: 'Fjölskyldumál og velferð',
    description:
      'Meðal annars fæðingarorlof, nöfn, forsjá, gifting og skilnaður.',
  },
]

export const tags = [
  { title: 'COVID-19' },
  { title: 'Atvinnuleysisbætur' },
  { title: 'Hlutabætur' },
  { title: 'Ferðagjöf' },
  { title: 'Gifting' },
  { title: 'Fæðingarorlof' },
  { title: 'Skilnaður' },
  { title: 'Færnimat' },
  { title: 'Styrkir og lán' },
  { title: 'Örorkumat' },
  { title: 'Framhaldsskólar' },
  { title: 'Veiðikort' },
  { title: 'Dvalarleyfi' },
  { title: 'Sótt um hæli' },
]

export const articles = [
  { title: 'Skráning nafns' },
  { title: 'Nafnabreyting' },
  { title: 'Breytt ritun nafns' },
  { title: 'Breytt skráning á kyni' },
]

export const getTags = (count = 5) => {
  const c = count > 0 && count > tags.length ? tags.length : count
  const shuffledTags = tags.sort(() => Math.random() - 0.5)
  return shuffledTags.slice(0, c)
}

export const selectOptions = categories.map((x) => ({
  label: x.title,
  value: x.title,
}))

export const tempTabs = [
  {
    title: 'Þjónustuflokkar',
    links: [
      { title: 'Fjölskylda og velferð', url: '/flokkur/fjolskylda-og-velferd' },
      {
        title: 'Launþegi, réttindi og lífeyrir',
        url: '/flokkur/launthegi-rettindi-og-lifeyrir',
      },
      {
        title: 'Atvinnurekstur og sjálfstætt starfandi',
        url: '/',
      },
      {
        title: 'Heilbrigðismál',
        url: '/',
      },
      {
        title: 'Samgöngur',
        url: '/',
      },
      {
        title: 'Akstur og bifreiðar',
        url: '/',
      },
      {
        title: 'Fjármál og skattar',
        url: '/',
      },
      {
        title: 'Iðnaður',
        url: '/',
      },
      {
        title: 'Vegabréf, ferðalög og búseta erlendis',
        url: '/',
      },
      {
        title: 'Menntun',
        url: '/',
      },
      {
        title: 'Innflytjendamál',
        url: '/',
      },
      {
        title: 'Húsnæðismál',
        url: '/',
      },
      {
        title: 'Samfélag og réttindi',
        url: '/',
      },
      {
        title: 'Málefni fatlaðra',
        url: '/',
      },
      {
        title: 'Dómstólar og réttarfar',
        url: '/',
      },
      {
        title: 'Umhverfismál',
        url: '/',
      },
    ],
  },
  {
    title: 'Stafrænt Ísland',
    links: [
      { title: 'Um Ísland.is', url: '/um-island-is' },
      {
        title: 'Stofnanir',
        url: '/',
      },
    ],
    externalLinksHeading: 'Aðrir opinberir vefir',
    externalLinks: [
      {
        title: 'Heilsuvera',
        url: 'https://heilsuvera.is',
        icon: null,
      },
      {
        title: 'Samráðsgátt',
        url: 'https://samradsgatt.island.is',
        icon: null,
      },
      {
        title: 'Mannanöfn',
        url: 'https://vefur.island.is/mannanofn/',
        icon: null,
      },
      {
        title: 'Undirskriftalistar',
        url: 'https://vefur.island.is/undirskriftalistar/',
        icon: null,
      },
      {
        title: 'Opin gögn',
        url: 'https://opingogn.is/',
        icon: null,
      },
      {
        title: 'Opinber Nýsköpun',
        url: 'https://opinbernyskopun.island.is/',
        icon: null,
      },
      {
        title: 'Opnir reikn. ríkisins',
        url: 'http://www.opnirreikningar.is/',
        icon: null,
      },
      {
        title: 'Tekjusagan',
        url: 'http://www.tekjusagan.is/',
        icon: null,
      },
    ],
  },
]
