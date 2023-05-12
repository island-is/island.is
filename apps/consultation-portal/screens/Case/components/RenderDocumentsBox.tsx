import { SimpleCardSkeleton } from '../../../components/Card'
import { Document } from '../../../types/interfaces'
import StackedTitleAndDescription from '../../../components/StackedTitleAndDescription/StackedTitleAndDescription'
import { LinkV2 } from '@island.is/island-ui/core'
import env from '../../../lib/environment'

interface Props {
  title: string
  documents: Array<Document>
}

export const RenderDocumentsBox = ({ title, documents }: Props) => {
  return (
    <SimpleCardSkeleton>
      <StackedTitleAndDescription title={title}>
        {documents.map((document, index) => {
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
        })}
      </StackedTitleAndDescription>
    </SimpleCardSkeleton>
  )
}
