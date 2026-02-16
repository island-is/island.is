import { useLocale } from '@island.is/localization'
import { messages } from '../../lib/messages'
import { IntroWrapper } from '@island.is/portals/my-pages/core'
import { useDocumentList } from '@island.is/portals/my-pages/documents'
import { DocumentsList } from '../Communications/components/DocumentsList/DocumentsList'

const Files = () => {
  const { formatMessage } = useLocale()

  const { filteredDocuments, loading } = useDocumentList({
    categoryIds: ['3'],
  })

  return (
    <IntroWrapper
      title={formatMessage(messages.files)}
      intro={formatMessage(messages.communicationsPregnancyIntro)}
      childrenWidthFull
    >
      {/* TODO: Display files for pregnancy */}
      <DocumentsList documents={filteredDocuments} loading={loading} />
    </IntroWrapper>
  )
}

export default Files
