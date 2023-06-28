import localization from '../../../../Layout.json'

const loc = localization.menu.menuItems

export const menuItems = [
  {
    label: loc[0].label,
    href: loc[0].href,
    testId: 'menuItem_allCases',
  },
  {
    label: loc[1].label,
    href: loc[1].href,
    testId: 'menuItem_subscriptions',
  },
  // Tölfræði is hidden until PowerBI
  // {
  //   label: 'Tölfræði',
  //   href: '/tolfraedi',
  // },
  {
    label: loc[2].label,
    href: loc[2].href,
    testId: 'menuItem_advices',
  },
]
