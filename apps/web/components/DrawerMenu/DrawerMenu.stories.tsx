import React from 'react'
import DrawerMenu from './DrawerMenu'

export default {
  title: 'Components/DrawerMenu',
  component: DrawerMenu,
}

const categories = [
  {
    title: 'Efnisyfirlit',
    items: [
      { title: 'Inngangur', url: '/' },
      { title: 'Orlofstími', url: '/' },
      { title: 'Greiðslur', url: '/' },
      { title: 'Mat á réttindum', url: '/' },
      { title: 'Spurt og svarað', url: '/' },
      { title: 'Umsókn', url: '/' },
      { title: 'Umsjónaraðili', url: '/' },
    ],
  },
  {
    title: 'Tengt efni',
    items: [
      { title: 'Fæðingarorlof fyrir foreldra utan vinnumarkaðar', url: '/' },
      { title: 'InnFæðingarorlof fyrir foreldra í fullu námigangur', url: '/' },
      { title: 'Réttindi starfsmanns í fæðingarorlofi', url: '/' },
      { title: 'Kæruréttur', url: '/' },
    ],
  },
]

export const Default = () => (
  <div style={{ maxWidth: 360 }}>
    <DrawerMenu categories={categories} />
  </div>
)
