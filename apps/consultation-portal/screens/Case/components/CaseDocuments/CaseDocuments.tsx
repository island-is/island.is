import { CardSkeleton } from '../../../../components'
import { Document } from '../../../../types/interfaces'
import { DocFileName, Stacked } from '../../components'

interface Props {
  title: string
  documents: Array<Document>
}

export const CaseDocuments = ({ title, documents }: Props) => {
  return (
    <CardSkeleton>
      <Stacked title={title}>
        {documents.map((doc, index) => {
          return <DocFileName doc={doc} key={index} />
        })}
      </Stacked>
    </CardSkeleton>
  )
}
export default CaseDocuments
