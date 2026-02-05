import { useLocale } from '@island.is/localization'
import { DropdownMenu } from '@island.is/island-ui/core'
import { SignatureCollectionSignature as Signature } from '@island.is/api/schema'
import { m } from '../../../lib/messages'

// Icelandic alphabet order for proper sorting
const icelandicOrder =
  '0123456789aAáÁbBcCdDðÐeEéÉfFgGhHiIíÍjJkKlLmMnNoOóÓpPqQrRsStTuUúÚvVwWxXyYýÝzZþÞæÆöÖ'

const charOrder = (char: string) => {
  const ix = icelandicOrder.indexOf(char)
  return ix === -1 ? char.charCodeAt(0) + icelandicOrder.length : ix
}

const compareIcelandic = (s1: string, s2: string): number => {
  for (let i = 0; i < Math.min(s1.length, s2.length); i++) {
    const iA = charOrder(s1[i])
    const iB = charOrder(s2[i])
    if (iA !== iB) {
      return iA - iB
    }
  }
  return s1.length - s2.length
}

const SortSignees = ({
  signees,
  setSignees,
  setPage,
}: {
  signees: Signature[]
  setSignees: (signees: Signature[]) => void
  setPage: (page: number) => void
}) => {
  const { formatMessage } = useLocale()

  const createSortItem = (
    title: string,
    compareFunction: ((a: Signature, b: Signature) => number) | undefined,
  ) => ({
    title,
    onClick: () => {
      const sorted = [...signees]
      sorted.sort(compareFunction)
      setSignees(sorted)
      setPage(1)
    },
  })

  return (
    <DropdownMenu
      title={formatMessage(m.sortBy)}
      icon="swapVertical"
      items={[
        createSortItem(formatMessage(m.sortAlphabeticallyAsc), (a, b) =>
          compareIcelandic(a.signee.name, b.signee.name),
        ),
        createSortItem(formatMessage(m.sortAlphabeticallyDesc), (a, b) =>
          compareIcelandic(b.signee.name, a.signee.name),
        ),
        createSortItem(formatMessage(m.sortDateAsc), (a, b) =>
          a.created.localeCompare(b.created),
        ),
        createSortItem(formatMessage(m.sortDateDesc), (a, b) =>
          b.created.localeCompare(a.created),
        ),
      ]}
    />
  )
}

export default SortSignees
