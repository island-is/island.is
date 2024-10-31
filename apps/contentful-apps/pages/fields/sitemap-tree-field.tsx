import { FieldExtensionSDK } from '@contentful/app-sdk'
import { useSDK } from '@contentful/react-apps-toolkit'

import { SitemapTreeField } from '../../components/sitemap/SitemapTreeField'
import { SitemapTreeFieldDialog } from '../../components/sitemap/SitemapTreeFieldDialog'

const App = () => {
  const sdk = useSDK<FieldExtensionSDK>()

  if (sdk.location.is('dialog')) {
    return <SitemapTreeFieldDialog />
  }

  return <SitemapTreeField />
}

export default App
