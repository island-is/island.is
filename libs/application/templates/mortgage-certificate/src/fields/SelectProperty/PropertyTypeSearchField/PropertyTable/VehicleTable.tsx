import React, { FC } from 'react'
import { Table as T, Checkbox } from '@island.is/island-ui/core'
import { FieldBaseProps } from '@island.is/application/types'
import { VehicleDetail } from '@island.is/api/schema'
import { useLocale } from '@island.is/localization'
import { FieldArrayWithId } from 'react-hook-form'
import { MortgageCertificate } from '../../../../lib/dataSchema'
import { propertySearch } from '../../../../lib/messages'
import { SelectedProperty } from '../../../../shared'
import format from 'date-fns/format'
import is from 'date-fns/locale/is'
import parseISO from 'date-fns/parseISO'
import { TableHeadText } from './TableHeadText'

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
> = ({ selectHandler, vehicle, checkedProperties }) => {
  const { formatMessage } = useLocale()
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
    <>
      <T.Head>
        <T.Row>
          <T.HeadData></T.HeadData>
          <T.HeadData>
            <TableHeadText
              text={formatMessage(propertySearch.labels.vehicleNumber)}
            />
          </T.HeadData>
          <T.HeadData>
            <TableHeadText
              text={formatMessage(propertySearch.labels.propertyNumber)}
            />
          </T.HeadData>
          <T.HeadData>
            <TableHeadText text={formatMessage(propertySearch.labels.color)} />
          </T.HeadData>
          <T.HeadData>
            <TableHeadText
              text={formatMessage(propertySearch.labels.manufacturer)}
            />
          </T.HeadData>
          <T.HeadData
            box={{
              textAlign: 'right',
            }}
          >
            <TableHeadText
              text={formatMessage(propertySearch.labels.dateOfRegistration)}
            />
          </T.HeadData>
        </T.Row>
      </T.Head>
      <T.Body>
        {licencePlate && (
          <T.Row key={licencePlate}>
            <T.Data>
              <Checkbox
                id={licencePlate}
                name={licencePlate}
                checked={!!isChecked}
                onChange={() => {
                  selectHandler(
                    {
                      propertyNumber: propertyNumber ?? '',
                      propertyName: `${licencePlate} - ${manufacturer} ${manufacturerType} ${color}`,
                      propertyType: '',
                    },
                    checkedProperties?.findIndex(
                      (property) => property.propertyNumber === licencePlate,
                    ),
                  )
                }}
              />
            </T.Data>
            <T.Data
              text={{
                fontWeight: isChecked ? 'semiBold' : 'regular',
              }}
            >
              {licencePlate}
            </T.Data>
            <T.Data
              text={{
                fontWeight: isChecked ? 'semiBold' : 'regular',
              }}
            >
              {propertyNumber}
            </T.Data>
            <T.Data
              text={{
                fontWeight: isChecked ? 'semiBold' : 'regular',
              }}
            >
              {color}
            </T.Data>
            <T.Data
              text={{
                fontWeight: isChecked ? 'semiBold' : 'regular',
              }}
            >
              {manufacturer} {manufacturerType}
            </T.Data>
            <T.Data
              text={{
                fontWeight: isChecked ? 'semiBold' : 'regular',
              }}
              box={{
                textAlign: 'right',
              }}
            >
              {format(parseISO(dateOfRegistration), 'dd.MM.yyyy', {
                locale: is,
              })}
            </T.Data>
          </T.Row>
        )}
      </T.Body>
    </>
  )
}
