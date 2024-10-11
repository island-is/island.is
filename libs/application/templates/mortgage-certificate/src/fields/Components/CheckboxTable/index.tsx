import React, { FC } from 'react'
import { Table as T, Checkbox } from '@island.is/island-ui/core'
import { FieldBaseProps, StaticText } from '@island.is/application/types'
import { ShipDetail } from '@island.is/api/schema'
import { useLocale } from '@island.is/localization'
import { TableHeadText } from './TableHeadText'
import { formatText } from '@island.is/application/core'

interface CheckboxTableProps {
  header: StaticText[]
  rows: {
    row: string[]
    propertyNumber: string
    selectHandler: () => void
    isChecked: boolean
  }[]
}

export const CheckboxTable: FC<
  React.PropsWithChildren<FieldBaseProps & CheckboxTableProps & ShipDetail>
> = ({ header, application, rows }) => {
  const { formatMessage } = useLocale()
  return (
    <>
      <T.Head>
        <T.Row>
          <T.HeadData></T.HeadData>
          {header.map((cell, index) => (
            <T.HeadData
              key={`${cell}-${index}`}
              box={{
                textAlign: index === header.length - 1 ? 'right' : 'left',
              }}
            >
              <TableHeadText
                text={formatText(cell, application, formatMessage)}
              />
            </T.HeadData>
          ))}
        </T.Row>
      </T.Head>
      <T.Body>
        {rows.map(
          ({ row, propertyNumber, selectHandler, isChecked }, rowIndex) => (
            <T.Row key={`row-${rowIndex}`}>
              <T.Data>
                <Checkbox
                  id={propertyNumber}
                  name={propertyNumber}
                  checked={!!isChecked}
                  onChange={selectHandler.bind(null)}
                />
              </T.Data>
              {row.map((cell, cellIndex) => (
                <T.Data
                  key={`row-${rowIndex}-cell-${cellIndex}`}
                  text={{
                    fontWeight: isChecked ? 'semiBold' : 'regular',
                  }}
                  box={{
                    textAlign: cellIndex === row.length - 1 ? 'right' : 'left',
                  }}
                >
                  {formatText(cell, application, formatMessage)}
                </T.Data>
              ))}
            </T.Row>
          ),
        )}
      </T.Body>
    </>
  )
}
