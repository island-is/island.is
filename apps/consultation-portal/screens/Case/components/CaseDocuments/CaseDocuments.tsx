import { CardSkeleton } from '../../../../components'
import { Document } from '../../../../types/interfaces'
import { Stacked } from '../../components'
import CaseDocumentsSkeleton from './CaseDocumentsSkeleton'

interface Props {
  title: string
  documents: Array<Document>
}

export const CaseDocuments = ({ title, documents }: Props) => {
  return (
    <CardSkeleton>
      <Stacked title={title}>
        {documents.map((document, index) => {
          return <CaseDocumentsSkeleton document={document} key={index} />
        })}
      </Stacked>
    </CardSkeleton>
  )
}
export default CaseDocuments
