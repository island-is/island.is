import { useLocale } from '@island.is/localization'
import { DropdownMenu } from '@island.is/island-ui/core'
import { m } from '../../../../lib/messages'
import { SignatureCollectionSignature as Signature } from '@island.is/api/schema'

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
          a.signee.name.localeCompare(b.signee.name),
        ),
        createSortItem(formatMessage(m.sortAlphabeticallyDesc), (a, b) =>
          b.signee.name.localeCompare(a.signee.name),
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
