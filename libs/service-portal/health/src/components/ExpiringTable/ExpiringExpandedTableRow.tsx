import { ExpandRow, NestedTable } from '@island.is/service-portal/core'

interface Props {
  expiring: boolean
  visibleValues: Array<string | number | React.ReactElement>
  foldedValues: Array<{ title: string; value?: string | number }>
}

export const ExpiringExpandedTableRow = ({
  expiring,
  visibleValues,
  foldedValues,
}: Props) => {
  return (
    <ExpandRow
      forceBackgroundColor={expiring}
      backgroundColor={expiring ? 'yellow' : 'default'}
      data={visibleValues.map((val) => {
        return { value: val }
      })}
    >
      <NestedTable data={foldedValues} />
    </ExpandRow>
  )
}
