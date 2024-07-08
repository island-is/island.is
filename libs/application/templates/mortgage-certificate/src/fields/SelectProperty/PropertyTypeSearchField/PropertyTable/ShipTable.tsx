import React, { FC } from 'react'
import { FieldBaseProps } from '@island.is/application/types'
import { ShipDetail } from '@island.is/api/schema'
import { FieldArrayWithId } from 'react-hook-form'
import { MortgageCertificate } from '../../../../lib/dataSchema'
import { propertySearch } from '../../../../lib/messages'
import { SelectedProperty } from '../../../../shared'
import format from 'date-fns/format'
import is from 'date-fns/locale/is'
import parseISO from 'date-fns/parseISO'
import { CheckboxTable } from '../../../Components/CheckboxTable'

interface ShipTableProps {
  selectHandler: (property: SelectedProperty, index: number) => void
  ship: ShipDetail | undefined
  checkedProperties: FieldArrayWithId<
    MortgageCertificate,
    'selectedProperties.properties',
    'id'
  >[]
}

export const ShipTable: FC<
  React.PropsWithChildren<FieldBaseProps & ShipTableProps & ShipDetail>
> = ({ selectHandler, ship, checkedProperties, application, field }) => {
  if (!ship) return null
  const {
    shipRegistrationNumber,
    usageType,
    name,
    initialRegistrationDate,
    mainMeasurements,
  } = ship
  const isChecked = checkedProperties?.some(
    (property) => property.propertyNumber === shipRegistrationNumber,
  )
  return (
    <CheckboxTable
      header={[
        propertySearch.labels.propertyNumber,
        propertySearch.labels.usageType,
        propertySearch.labels.bruttoWeightTons,
        propertySearch.labels.length,
        propertySearch.labels.dateOfRegistration,
      ]}
      rows={[
        {
          row: [
            shipRegistrationNumber ?? '',
            usageType ?? '',
            mainMeasurements?.bruttoWeightTons ?? '',
            mainMeasurements?.length ?? '',
            `${format(parseISO(initialRegistrationDate), 'dd.MM.yyyy', {
              locale: is,
            })}`,
          ],
          propertyNumber: shipRegistrationNumber ?? '',
          selectHandler: () =>
            selectHandler(
              {
                propertyNumber: shipRegistrationNumber ?? '',
                propertyName: `${shipRegistrationNumber} - ${name} (${usageType})`,
                propertyType: '',
              },
              checkedProperties?.findIndex(
                (property) =>
                  property.propertyNumber === shipRegistrationNumber,
              ),
            ),
          isChecked: !!isChecked,
        },
      ]}
      application={application}
      field={field}
    />
  )
}
