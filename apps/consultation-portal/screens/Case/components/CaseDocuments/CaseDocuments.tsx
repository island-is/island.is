import { sortLocale } from '../../../../utils/helpers'
import { CardSkeleton } from '../../../../components'
import { Document } from '../../../../types/interfaces'
import { DocFileName, Stacked } from '../../components'

interface Props {
  title: string
  documents: Array<Document>
}

export const CaseDocuments = ({ title, documents }: Props) => {
  const sortedDocuments = sortLocale({
    list: documents,
    sortOption: 'fileOrLink',
  })

  return (
    <CardSkeleton>
      <Stacked title={title}>
        {sortedDocuments.map((doc: Document) => {
          return <DocFileName doc={doc} key={doc.id} />
        })}
      </Stacked>
    </CardSkeleton>
  )
}
export default CaseDocuments
