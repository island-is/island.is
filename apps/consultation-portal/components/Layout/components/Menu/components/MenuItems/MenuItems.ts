import localization from '../../../../Layout.json'

const loc = localization.menu.menuItems

export const menuItems = [
  {
    label: loc[0].label,
    href: loc[0].href,
    testId: 'all-cases-btn',
  },
  {
    label: loc[1].label,
    href: loc[1].href,
    testId: 'subscriptions-btn',
  },
  // {
  //   label: loc[2].label,
  //   href: loc[2].href,
  //   testId: 'statistics-btn',
  // },
  {
    label: loc[3].label,
    href: loc[3].href,
    testId: 'advices-btn',
  },
]
