import React from 'react'

import { withFigma } from '../../utils/withFigma'
import { Footer } from './Footer'

export default {
  title: 'Navigation/Footer',
  component: Footer,
  parameters: withFigma('Footer'),
}

const defaultBottomBarLinks = [
  {
    title: 'Getum við aðstoðað?',
    href: '/s/stafraent-island/hafa-samband',
  },
  {
    title: 'Persónuverndarstefna',
    href: '/personuverndarstefna-stafraent-islands',
  },
  {
    title: 'Notendaskilmálar',
    href: '/skilmalar-island-is',
  },
]

export const Default = () => (
  <Footer showMiddleLinks bottomBarLinks={defaultBottomBarLinks} />
)

export const WithTagLinks = () => (
  <Footer
    showMiddleLinks
    showTagLinks
    tagLinks={[
      { title: 'Kílómetragjald', href: '/kilometragjald' },
      { title: 'Vegabréf', href: '/vegabref' },
      { title: 'Fæðingarorlof', href: '/faedingarorlof' },
      { title: 'Sjúkratryggingakortið', href: '/sjukratryggingakortid' },
      { title: 'ísland.is app', href: '/island-is-app' },
      { title: 'Fasteignamat', href: '/fasteignamat' },
      { title: 'Hlutdeildarlán', href: '/hlutdeildarlan' },
      { title: 'Atvinnuleysisbætur', href: '/atvinnuleysisbaetur' },
      { title: 'Loftbrú', href: '/loftbru' },
    ]}
    bottomBarLinks={defaultBottomBarLinks}
  />
)
