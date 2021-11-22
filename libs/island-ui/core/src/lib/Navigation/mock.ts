export const categories = [
  {
    title: 'Fjölskylda og velferð',
    href: '#',
  },
  {
    title: 'Eldri borgarar',
    href: '#',
    active: true,
  },
  {
    title: 'Bætur',
    href: '#',
  },
  {
    title: 'Málefni fatlaðra',
    href: '#',
  },
  {
    title: 'Menntun',
    href: '#',
  },
  {
    title: 'Vegabréf, ferðalög og búseta erlendis',
    href: '#',
  },
  {
    title: 'Innflytjendur',
    href: '#',
  },
  {
    title: 'Umhverfismál',
    href: '#',
  },
  {
    title: 'Húsnæðismál',
    href: '#',
  },
  {
    title: 'Samfélag og réttindi',
    href: '#',
  },
  {
    title: 'Dómstólar og réttarfar',
    href: '#',
  },
  {
    title: 'Fjármál og skattar',
    href: '#',
  },
]

export const pages = [
  {
    title: 'Hér er tengill á síðu',
    href: '#',
  },
  {
    title: 'Þessi tengill er virkur og með undirsíðum sem opnast',
    href: '#',
    active: true,
    items: [
      {
        title: 'Hér er undirsíða',
        href: '#',
      },
      {
        title: 'Hér er virk undirsíða',
        href: '#',
        active: true,
      },
      {
        title: 'Margt sniðugt að skoða',
        href: '#',
      },
      {
        title: 'Meira sniðugt',
        href: '#',
      },
    ],
  },
  {
    title: 'Stakur tengill',
    href: '#',
  },
  {
    title: 'Annar tengill með undirsíðum',
    href: '#',
    items: [
      {
        title: 'Undirsíða 1',
        href: '#',
        items: [
          {
            title: 'Undir undirsíða 1',
            href: '#',
          },
          {
            title: 'Undir undirsíða 2',
            href: '#',
          },
        ],
      },
      {
        title: 'Undirsíða 2',
        href: '#',
      },
    ],
  },
]

export const pagesWithAccordion = [
  {
    title: 'Tengill sem opnast með takka',
    href: '#',
    accordion: true,
    items: categories,
  },
]
