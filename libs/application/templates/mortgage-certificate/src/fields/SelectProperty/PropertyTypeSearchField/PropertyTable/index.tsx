import React, { FC } from 'react'
import { Box, Table as T } from '@island.is/island-ui/core'
import { FieldBaseProps } from '@island.is/application/types'
import { ManyPropertyDetail } from '@island.is/api/schema'
import { FieldArrayWithId } from 'react-hook-form'
import { MortgageCertificate } from '../../../../lib/dataSchema'
import { SelectedProperty } from '../../../../shared'
import { RealEstateTable } from './RealEstateTable'
import { VehicleTable } from './VehicleTable'
import { ShipTable } from './ShipTable'

interface PropertyTableProps {
  selectHandler: (property: SelectedProperty, index: number) => void
  propertyInfo: ManyPropertyDetail | undefined
  checkedProperties: FieldArrayWithId<
    MortgageCertificate,
    'selectedProperties.properties',
    'id'
  >[]
}

export const PropertyTable: FC<
  React.PropsWithChildren<
    FieldBaseProps & PropertyTableProps & ManyPropertyDetail
  >
> = ({
  application,
  field,
  selectHandler,
  propertyInfo,
  checkedProperties,
}) => {
  return (
    <>
      <Box paddingY={2}>
        <T.Table>
          {propertyInfo?.propertyType === 'Fasteign' &&
            propertyInfo?.realEstate && (
              <RealEstateTable
                application={application}
                field={field}
                selectHandler={selectHandler}
                realEstate={propertyInfo?.realEstate}
                checkedProperties={checkedProperties}
              />
            )}
          {propertyInfo?.propertyType === 'Ökutæki' &&
            propertyInfo?.vehicle && (
              <VehicleTable
                application={application}
                field={field}
                selectHandler={selectHandler}
                vehicle={propertyInfo?.vehicle}
                checkedProperties={checkedProperties}
              />
            )}
          {propertyInfo?.propertyType === 'Skip' && propertyInfo?.ship && (
            <ShipTable
              application={application}
              field={field}
              selectHandler={selectHandler}
              ship={propertyInfo?.ship}
              checkedProperties={checkedProperties}
            />
          )}
        </T.Table>
      </Box>
    </>
  )
}
