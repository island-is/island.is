import { SimpleCardSkeleton } from '../../../components/Card'
import { Document } from '../../../types/interfaces'
import StackedTitleAndDescription from '../../../components/StackedTitleAndDescription/StackedTitleAndDescription'
import { LinkV2, Text } from '@island.is/island-ui/core'
import env from '../../../lib/environment'

interface Props {
  title: string
  documents: Array<Document>
}

export const RenderDocumentsBox = ({ title, documents }: Props) => {
  return (
    <SimpleCardSkeleton>
      <StackedTitleAndDescription title={title}>
        {documents?.length > 0 ? (
          documents.map((document, index) => {
            return (
              <LinkV2
                href={`${env.backendDownloadUrl}${document.id}`}
                color="blue400"
                underline="normal"
                underlineVisibility="always"
                key={index}
              >
                {document.fileName}
              </LinkV2>
            )
          })
        ) : (
          <Text>Engin skjöl fundust.</Text>
        )}
      </StackedTitleAndDescription>
    </SimpleCardSkeleton>
  )
}
