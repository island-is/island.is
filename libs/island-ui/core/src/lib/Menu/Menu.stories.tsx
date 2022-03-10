import React from 'react'

import { withFigma } from '../../utils/withFigma'

import { Menu } from './Menu'

const mainLinks = [
  { text: 'Akstur og bifreiðar', href: '#' },
  { text: 'Atvinnurekstur og sjálfstætt starfandi', href: '#' },
  { text: 'Dómstólar og réttarfar', href: '#' },
  { text: 'Fjármál og skattar', href: '#' },
  { text: 'Fjölskylda og velferð', href: '#' },
  { text: 'Heilbrigðismál', href: '#' },
  { text: 'Húsnæðismál', href: '#' },
  { text: 'Iðnaður', href: '#' },
  { text: 'Innflytjendamál', href: '#' },
  { text: 'Launþegi, réttindi og lífeyrir', href: '#' },
  { text: 'Málefni fatlaðs fólks', href: '#' },
  { text: 'Menntun', href: '#' },
  { text: 'Neytendamál', href: '#' },
  { text: 'Samfélag og réttindi', href: '#' },
  { text: 'Samgöngur', href: '#' },
  { text: 'Umhverfismál', href: '#' },
  { text: 'Vegabréf, ferðalög og búseta erlendis', href: '#' },
  { text: 'Vörur og þjónusta Ísland.is', href: '#' },
]

const asideTopLinks = [
  { text: 'Stofnanir', href: '#' },
  { text: 'Stafrænt Ísland', href: '#' },
  {
    text: 'Þróun',
    href: '#',
    sub: [
      { text: 'Viskuausan', href: '#' },
      { text: 'Ísland UI', href: '#' },
      { text: 'Hönnunarkerfi', href: '#' },
      { text: 'Efnisstefna', href: '#' },
    ],
  },
  {
    text: 'Upplýsingarsvæði',
    href: '#',
    sub: [
      {
        text: 'linkur á eitthvað',
        href: '#',
      },
    ],
  },
]

const asideBottomLinks = [
  { text: 'Heilsuvera', href: '#' },
  { text: 'Samráðsgátt', href: '#' },
  { text: 'Mannanöfn', href: '#' },
  { text: 'Undirskriftarlistar', href: '#' },
  { text: 'Opin gögn', href: '#' },
  { text: 'Opinber nýsköpun', href: '#' },
  { text: 'Tekjusagan', href: '#' },
]

export default {
  title: 'Navigation/Menu',
  component: Menu,
  parameters: withFigma('Menu'),
}

const Template = (args) => <Menu {...args} />

export const Default = Template.bind({})
Default.args = {
  baseId: 'story',
  myPagesText: 'Mínar síður',
  languageSwitchText: 'EN',
  mainLinks,
  asideTopLinks,
  asideBottomLinks,
  mainTitle: 'Þjónustuflokkar',
  menuButton: <button>Open</button>,
  asideBottomTitle: 'Aðrir opinberir vefir',
}
