import { AidOrNutrition } from '@island.is/api/schema'
import { ExpandRow, amountFormat } from '@island.is/service-portal/core'
import { Table as T, Text } from '@island.is/island-ui/core'
import { FC } from 'react'

interface Props {
  expiring: boolean
  visibleValues: Array<string | number | React.ReactElement>
  foldedValues: {
    columns: Array<string>
    values: Array<string>
  }
}

export const ExpiringExpandedTableRow: FC<Props> = ({
  expiring,
  visibleValues,
  foldedValues,
}) => {
  return (
    <ExpandRow
      forceBackgroundColor={expiring}
      backgroundColor={expiring ? 'yellow' : 'default'}
      data={visibleValues.map((val) => {
        return { value: val }
      })}
    >
      <T.Table>
        <T.Head>
          <T.Row>
            {foldedValues.columns.map((col, idx) => (
              <T.HeadData key={idx}>
                <Text variant="medium" fontWeight="semiBold">
                  {col}
                </Text>
              </T.HeadData>
            ))}
          </T.Row>
        </T.Head>
        <T.Body>
          <T.Row>
            {foldedValues.values.map((val, idx) => (
              <T.Data
                key={idx}
                box={{
                  background: expiring ? 'yellow300' : 'transparent',
                  paddingRight: 2,
                  paddingLeft: 2,
                  position: 'relative',
                }}
              >
                <Text variant="medium">{val}</Text>
              </T.Data>
            ))}
          </T.Row>
        </T.Body>
      </T.Table>
    </ExpandRow>
  )
}
