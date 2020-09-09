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
          { title: 'Fjölskyldumál', url: '/fjolskyldumal' },
          {
            title: 'Eldri borgarar',
            url: '/',
          },
          {
            title: 'Bætur',
            url: '/',
          },
          {
            title: 'Málefni fatlaðra',
            url: '/',
          },
          {
            title: 'Menntun',
            url: '/',
          },
          {
            title: 'Ferðalög og búseta erlendis',
            url: '/',
          },
          {
            title: 'Innflytjendur',
            url: '/',
          },
          {
            title: 'Umhverfismál',
            url: '/',
          },
          {
            title: 'Húsnæðismál',
            url: '/',
          },
        ],
      },
      {
        title: 'Stafrænt Ísland',
        links: [
          { title: 'Um Ísland.is', url: '/' },
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
          },
          {
            title: 'Samráðsgátt',
            url: 'https://samradsgatt.island.is',
          },
          {
            title: 'Mannanöfn',
            url: 'https://vefur.island.is/mannanofn/',
          },
          {
            title: 'Undirskriftalistar',
            url: 'https://vefur.island.is/undirskriftalistar/',
          },
        ],
      },
    ]}
  />
)
