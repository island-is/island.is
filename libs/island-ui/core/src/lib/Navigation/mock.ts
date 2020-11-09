export const categories = [
  {
    title: 'Fjölskylda og velferð',
    href: '/fjolskylda-og-velferd',
  },
  {
    title: 'Eldri borgarar',
    href: '/eldri-borgarar',
  },
  {
    title: 'Bætur',
    href: '/baetur',
  },
  {
    title: 'Málefni fatlaðra',
    href: '/malefni-fatladra',
  },
  {
    title: 'Menntun',
    href: '/menntun',
  },
  {
    title: 'Vegabréf, ferðalög og búseta erlendis',
    href: '/vegabref-ferdalog-og-buseta-erlendis',
  },
  {
    title: 'Innflytjendur',
    href: '/innflytjendur',
  },
  {
    title: 'Umhverfismál',
    href: '/umhverfismal',
  },
  {
    title: 'Húsnæðismál',
    href: '/husnaedismal',
  },
  {
    title: 'Samfélag og réttindi',
    href: '/samfelag-og-rettindi',
  },
  {
    title: 'Dómstólar og réttarfar',
    href: '/domstolar-og-rettarfar',
  },
  {
    title: 'Fjármál og skattar',
    href: '/fjarmal-og-skattar',
  },
]

export const pages = [
  {
    title: 'Hér er tengill á síðu',
    href: '/her-er-tengill-a-sidu',
  },
  {
    title: 'Þessi tengill er virkur og með undirsíðum sem opnast',
    href: '/thessi-tengill-er-virkur-og-med-undirsidum-sem-opnast',
    active: true,
    items: [
      {
        title: 'Hér er undirsíða',
        href: '/her-er-undirsida',
      },
      {
        title: 'Hér er virk undirsíða',
        href: '/her-er-virk-undirsida',
        active: true,
      },
      {
        title: 'Margt sniðugt að skoða',
        href: '/margt-snidugt-ad-skoda',
      },
      {
        title: 'Meira sniðugt',
        href: '/meira-snidugt',
      },
    ],
  },
  {
    title: 'Stakur tengill',
    href: '/stakur-tengill',
  },
  {
    title: 'Annar tengill með undirsíðum',
    href: '/annar-tengill-med-undirsidum',
    items: [
      {
        title: 'Undirsíða 1',
        href: '/undirsida 1',
        items: [
          {
            title: 'Undir undirsíða 1',
            href: '/undir-undirsida-1',
          },
          {
            title: 'Undir undirsíða 2',
            href: '/undir-undirsida-2',
          },
        ],
      },
      {
        title: 'Undirsíða 2',
        href: '/undirsida 2',
      },
    ],
  },
]
