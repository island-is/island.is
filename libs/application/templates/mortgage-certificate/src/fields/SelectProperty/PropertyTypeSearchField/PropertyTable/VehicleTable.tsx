import React, { FC } from 'react'
import { FieldBaseProps } from '@island.is/application/types'
import { VehicleDetail } from '@island.is/api/schema'
import { FieldArrayWithId } from 'react-hook-form'
import { MortgageCertificate } from '../../../../lib/dataSchema'
import { propertySearch } from '../../../../lib/messages'
import { SelectedProperty } from '../../../../shared'
import format from 'date-fns/format'
import is from 'date-fns/locale/is'
import parseISO from 'date-fns/parseISO'
import { CheckboxTable } from '../../../Components/CheckboxTable'

interface VehicleTableProps {
  selectHandler: (property: SelectedProperty, index: number) => void
  vehicle: VehicleDetail | undefined
  checkedProperties: FieldArrayWithId<
    MortgageCertificate,
    'selectedProperties.properties',
    'id'
  >[]
}

export const VehicleTable: FC<
  React.PropsWithChildren<FieldBaseProps & VehicleTableProps & VehicleDetail>
> = ({ selectHandler, vehicle, checkedProperties, application, field }) => {
  if (!vehicle) return null
  const {
    licencePlate,
    propertyNumber,
    manufacturer,
    manufacturerType,
    color,
    dateOfRegistration,
  } = vehicle
  const isChecked = checkedProperties?.find(
    (property) => property.propertyNumber === licencePlate,
  )
  return (
    <CheckboxTable
      header={[
        propertySearch.labels.vehicleNumber,
        propertySearch.labels.propertyNumber,
        propertySearch.labels.color,
        propertySearch.labels.manufacturer,
        propertySearch.labels.dateOfRegistration,
      ]}
      rows={[
        {
          row: [
            licencePlate ?? '',
            propertyNumber ?? '',
            color ?? '',
            `${manufacturer} ${manufacturerType}`,
            `${format(parseISO(dateOfRegistration), 'dd.MM.yyyy', {
              locale: is,
            })}`,
          ],
          propertyNumber: propertyNumber ?? '',
          selectHandler: () =>
            selectHandler(
              {
                propertyNumber: propertyNumber ?? '',
                propertyName: `${licencePlate} - ${manufacturer} ${manufacturerType} ${color}`,
                propertyType: '',
              },
              checkedProperties?.findIndex(
                (property) => property.propertyNumber === licencePlate,
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
