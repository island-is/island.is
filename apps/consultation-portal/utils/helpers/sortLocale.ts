import { RelatedCase, Stakeholder } from '../../types/interfaces'

interface Props {
  list: Array<Stakeholder> | Array<RelatedCase>
  sortOption: 'name' | 'caseNumber'
}

export const sortLocale = ({ list, sortOption }: Props) => {
  if (list.length < 1) {
    return []
  }
  return [...list].sort((a, b) => a[sortOption].localeCompare(b[sortOption]))
}
