import React, { FC } from 'react'
import { Table as T, RadioButton } from '@island.is/island-ui/core'
import { FieldBaseProps } from '@island.is/application/types'
import { PropertyDetail } from '@island.is/api/schema'

interface PropertyTableRowProps {
  selectHandler: (property: PropertyDetail | undefined) => void
  propertyInfo: PropertyDetail | undefined
  selectedPropertyNumber: string | undefined
}

export const PropertyTableRow: FC<
  React.PropsWithChildren<
    FieldBaseProps & PropertyTableRowProps & PropertyDetail
  >
> = ({ selectHandler, propertyInfo, selectedPropertyNumber }) => {
  const unitOfUse = (propertyInfo?.unitsOfUse?.unitsOfUse || [])[0]

  const propertyNumber = propertyInfo?.propertyNumber || ''

  return (
    <T.Row>
      <T.Data>
        <RadioButton
          id={propertyNumber}
          name={propertyNumber}
          checked={propertyNumber === selectedPropertyNumber}
          onChange={() => {
            selectHandler(propertyInfo)
          }}
        />
      </T.Data>
      <T.Data>{propertyNumber}</T.Data>
      <T.Data>{unitOfUse?.marking}</T.Data>
      <T.Data>{unitOfUse?.explanation}</T.Data>
      <T.Data>{propertyInfo?.defaultAddress?.display}</T.Data>
    </T.Row>
  )
}
