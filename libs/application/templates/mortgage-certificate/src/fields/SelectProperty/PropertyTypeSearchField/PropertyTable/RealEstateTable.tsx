import React, { FC } from 'react'
import { FieldBaseProps } from '@island.is/application/types'
import { RealEstateDetail } from '@island.is/api/schema'
import { FieldArrayWithId } from 'react-hook-form'
import { MortgageCertificate } from '../../../../lib/dataSchema'
import { propertySearch } from '../../../../lib/messages'
import { SelectedProperty } from '../../../../shared'
import { CheckboxTable } from '../../../Components/CheckboxTable'

interface RealEstateTableProps {
  selectHandler: (property: SelectedProperty, index: number) => void
  realEstate: RealEstateDetail[] | undefined
  checkedProperties: FieldArrayWithId<
    MortgageCertificate,
    'selectedProperties.properties',
    'id'
  >[]
}

export const RealEstateTable: FC<
  React.PropsWithChildren<
    FieldBaseProps & RealEstateTableProps & RealEstateDetail
  >
> = ({ selectHandler, realEstate, checkedProperties, application, field }) => {
  return (
    <CheckboxTable
      header={[
        propertySearch.labels.propertyNumber,
        propertySearch.labels.propertyAddress,
        propertySearch.labels.propertyDescription,
      ]}
      rows={
        realEstate?.map((propertyDetail) => {
          const { usage, propertyNumber, defaultAddress } = propertyDetail
          const isChecked = checkedProperties?.find(
            (property) => property.propertyNumber === propertyNumber,
          )
          return {
            row: [`F${propertyNumber}`, defaultAddress ?? '', usage ?? ''],
            propertyNumber: propertyNumber ?? '',
            selectHandler: () =>
              selectHandler(
                {
                  propertyNumber: propertyNumber ?? '',
                  propertyName: `F${propertyNumber} - ${defaultAddress}`,
                  propertyType: '',
                },
                checkedProperties?.findIndex(
                  (property) => property.propertyNumber === propertyNumber,
                ),
              ),
            isChecked: !!isChecked,
          }
        }) ?? []
      }
      application={application}
      field={field}
    />
  )
}
