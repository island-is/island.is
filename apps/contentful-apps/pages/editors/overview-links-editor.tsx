import { EditorExtensionSDK } from '@contentful/app-sdk'
import { useSDK } from '@contentful/react-apps-toolkit'

import { OverviewLinksEditor } from '../../components/editors/OverviewLinksEditor/OverviewLinksEditor'
import { OverviewLinksEditorDialog } from '../../components/editors/OverviewLinksEditor/OverviewLinksEditorDialog'

const App = () => {
  const sdk = useSDK<EditorExtensionSDK>()
  if (sdk.location.is('dialog')) {
    return <OverviewLinksEditorDialog />
  }
  return <OverviewLinksEditor />
}

export default App
