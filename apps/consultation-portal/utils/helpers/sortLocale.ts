import { RelatedCase, Stakeholder } from '../../types/interfaces'

interface ArrOfValueAndLabel {
  value: string
  label: string
}

interface Props {
  list: Array<Stakeholder> | Array<RelatedCase> | Array<ArrOfValueAndLabel>
  sortOption: 'name' | 'caseNumber' | 'label'
}

export const sortLocale = ({ list, sortOption }: Props) => {
  if (list.length < 1) {
    return []
  }
  return [...list].sort((a, b) =>
    a[sortOption].localeCompare(b[sortOption], 'is'),
  )
}
