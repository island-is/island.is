import React from 'react'
import DrawerMenu from './DrawerMenu'

export default {
  title: 'Components/DrawerMenu',
  component: DrawerMenu,
}

const bunchOfContent = [
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
      { title: 'Kæruréttur', url: '/' },
      { title: 'Kæruréttur', url: '/' },
      { title: 'Kæruréttur', url: '/' },
      { title: 'Kæruréttur', url: '/' },
    ],
  },
  {
    title: 'Meira tengt efni',
    items: [
      { title: 'Fæðingarorlof fyrir foreldra utan vinnumarkaðar', url: '/' },
      { title: 'InnFæðingarorlof fyrir foreldra í fullu námigangur', url: '/' },
      { title: 'Réttindi starfsmanns í fæðingarorlofi', url: '/' },
      { title: 'Kæruréttur', url: '/' },
      { title: 'Kæruréttur', url: '/' },
      { title: 'Kæruréttur', url: '/' },
      { title: 'Kæruréttur', url: '/' },
      { title: 'Kæruréttur', url: '/' },
    ],
  },
]

const littleContent = [
  {
    title: 'Efnisyfirlit',
    items: [
      { title: 'Inngangur', url: '/' },
      { title: 'Orlofstími', url: '/' },
    ],
  },
]

export const Default = () => (
  <div style={{ maxWidth: 360, margin: '0 auto' }}>
    <DrawerMenu categories={bunchOfContent} />
  </div>
)

export const LittleContent = () => (
  <div style={{ maxWidth: 360, margin: '0 auto' }}>
    <DrawerMenu categories={littleContent} />
  </div>
)
