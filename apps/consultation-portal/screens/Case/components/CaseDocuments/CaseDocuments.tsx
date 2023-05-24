import { CardSkeleton } from '../../../../components'
import { Document } from '../../../../types/interfaces'
import { LinkV2 } from '@island.is/island-ui/core'
import env from '../../../../lib/environment'
import { Stacked } from '../../components'

interface Props {
  title: string
  documents: Array<Document>
}

export const CaseDocuments = ({ title, documents }: Props) => {
  return (
    <CardSkeleton>
      <Stacked title={title}>
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
      </Stacked>
    </CardSkeleton>
  )
}
export default CaseDocuments
