// TODO(style/desktop-header-nav): replace with Contentful grouped menu data.
// Shared between DesktopNav and MobileNav so both read from the same source.

export type HeaderNavKey = 'organizations' | 'categories' | 'lifeEvents'

export interface HeaderNavItem {
  title: string
  href: string
}

export interface HeaderNavSection {
  label: string
  title: string
  items: HeaderNavItem[]
  seeAllHref: string
  seeAllLabel: string
}

export type HeaderNavData = Record<HeaderNavKey, HeaderNavSection>

export const HEADER_NAV_KEYS: HeaderNavKey[] = [
  'organizations',
  'categories',
  'lifeEvents',
]

export const HEADER_NAV_MAX_ITEMS = 8

export const HEADER_NAV_MOCK_DATA: HeaderNavData = {
  organizations: {
    label: 'Stofnanir',
    title: 'Stofnanir á Ísland.is',
    seeAllHref: '/s',
    seeAllLabel: 'Skoða allar stofnanir',
    items: [
      { title: 'Embætti landlæknis', href: '/s/embaetti-landlaeknis' },
      { title: 'Fjársýslan', href: '/s/fjarsyslan' },
      {
        title: 'Heilbrigðisstofnun Norðurlands',
        href: '/s/heilbrigdisstofnun-nordurlands',
      },
      {
        title: 'Heilbrigðisstofnun Suðurlands',
        href: '/s/heilbrigdisstofnun-sudurlands',
      },
      { title: 'Landskjörstjórn', href: '/s/landskjorstjorn' },
      { title: 'Samgöngustofa', href: '/s/samgongustofa' },
      { title: 'Sjúkratryggingar', href: '/s/sjukratryggingar' },
      { title: 'Útlendingastofnun', href: '/s/utlendingastofnun' },
    ],
  },
  categories: {
    label: 'Þjónustuflokkar',
    title: 'Þjónustuflokkar á Ísland.is',
    seeAllHref: '/flokkur',
    seeAllLabel: 'Skoða alla þjónustuflokka',
    items: [
      {
        title: 'Fjölskylda og velferð',
        href: '/flokkur/fjolskylda-og-velferd',
      },
      { title: 'Heilbrigðismál', href: '/flokkur/heilbrigdismal' },
      { title: 'Húsnæðismál', href: '/flokkur/husnaedismal' },
      { title: 'Menntun', href: '/flokkur/menntun' },
      { title: 'Málefni útlendinga', href: '/flokkur/malefni-utlendinga' },
      { title: 'Samgöngur', href: '/flokkur/samgongur' },
      { title: 'Skattar og fjármál', href: '/flokkur/skattar-og-fjarmal' },
      { title: 'Umhverfismál', href: '/flokkur/umhverfismal' },
    ],
  },
  lifeEvents: {
    label: 'Lífsviðburðir',
    title: 'Lífsviðburðir á Ísland.is',
    seeAllHref: '/lifsvidburdir',
    seeAllLabel: 'Skoða alla lífsviðburði',
    items: [
      { title: 'Að eignast barn', href: '/lifsvidburdir/ad-eignast-barn' },
      {
        title: 'Að flytja til Íslands',
        href: '/lifsvidburdir/ad-flytja-til-islands',
      },
      { title: 'Að kaupa fasteign', href: '/lifsvidburdir/ad-kaupa-fasteign' },
      { title: 'Að missa ástvin', href: '/lifsvidburdir/ad-missa-astvin' },
      {
        title: 'Að stofna fyrirtæki',
        href: '/lifsvidburdir/ad-stofna-fyrirtaeki',
      },
      {
        title: 'Eftirlaun og lífeyrir',
        href: '/lifsvidburdir/eftirlaun-og-lifeyrir',
      },
      { title: 'Nám og skólaganga', href: '/lifsvidburdir/nam-og-skolaganga' },
      { title: 'Starfslok', href: '/lifsvidburdir/starfslok' },
    ],
  },
}
