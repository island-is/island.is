import { useLocale } from '@island.is/localization'
import { IntroWrapper } from '@island.is/portals/my-pages/core'
import { messages } from '../../lib/messages'

import { useDocumentList } from '@island.is/portals/my-pages/documents'
import { DocumentsList } from '../Communications/components/DocumentsList/DocumentsList'

const Communications = () => {
  const { formatMessage } = useLocale()
  const { filteredDocuments, loading } = useDocumentList()

  return (
    <IntroWrapper
      title={messages.communications}
      intro={messages.communicationsPregnancyIntro}
      childrenWidthFull
    >
      {/* Display documents for pregnancy -> Fix and display only pregnancy related data */}
      <DocumentsList documents={filteredDocuments} loading={loading} />
    </IntroWrapper>
  )
}

export default Communications
