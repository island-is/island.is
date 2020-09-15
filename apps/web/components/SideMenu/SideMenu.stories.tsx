import React from 'react'
import { SideMenu } from './SideMenu'

export default {
  title: 'Components/SideMenu',
  component: SideMenu,
}

export const Default = () => (
  <SideMenu
    isVisible
    handleClose={() => null}
    tabs={[
      {
        title: 'Þjónustuflokkar',
        links: [
          { title: 'Fjölskyldumál', href: '/fjolskyldumal' },
          {
            title: 'Eldri borgarar',
            href: '/',
          },
          {
            title: 'Bætur',
            href: '/',
          },
          {
            title: 'Málefni fatlaðra',
            href: '/',
          },
          {
            title: 'Menntun',
            href: '/',
          },
          {
            title: 'Ferðalög og búseta erlendis',
            href: '/',
          },
          {
            title: 'Innflytjendur',
            href: '/',
          },
          {
            title: 'Umhverfismál',
            href: '/',
          },
          {
            title: 'Húsnæðismál',
            href: '/',
          },
        ],
      },
      {
        title: 'Stafrænt Ísland',
        links: [
          { title: 'Um Ísland.is', href: '/' },
          {
            title: 'Stofnanir',
            href: '/',
          },
        ],
        externalLinksHeading: 'Aðrir opinberir vefir',
        externalLinks: [
          {
            title: 'Heilsuvera',
            href: 'https://heilsuvera.is',
          },
          {
            title: 'Samráðsgátt',
            href: 'https://samradsgatt.island.is',
          },
          {
            title: 'Mannanöfn',
            href: 'https://vefur.island.is/mannanofn/',
          },
          {
            title: 'Undirskriftalistar',
            href: 'https://vefur.island.is/undirskriftalistar/',
          },
        ],
      },
    ]}
  />
)
