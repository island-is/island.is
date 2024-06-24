import React, { FC } from 'react'
import { Table as T, Checkbox } from '@island.is/island-ui/core'
import { FieldBaseProps } from '@island.is/application/types'
import { ShipDetail } from '@island.is/api/schema'
import { useLocale } from '@island.is/localization'
import { FieldArrayWithId } from 'react-hook-form'
import { MortgageCertificate } from '../../../../lib/dataSchema'
import { propertySearch } from '../../../../lib/messages'
import { SelectedProperty } from '../../../../shared'
import format from 'date-fns/format'
import is from 'date-fns/locale/is'
import parseISO from 'date-fns/parseISO'
import { TableHeadText } from './TableHeadText'

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
> = ({ selectHandler, ship, checkedProperties }) => {
  const { formatMessage } = useLocale()
  if (!ship) return null
  const {
    shipRegistrationNumber,
    usageType,
    name,
    initialRegistrationDate,
    mainMeasurements,
  } = ship
  const isChecked = checkedProperties?.find(
    (property) => property.propertyNumber === shipRegistrationNumber,
  )
  return (
    <>
      <T.Head>
        <T.Row>
          <T.HeadData></T.HeadData>
          <T.HeadData>
            <TableHeadText
              text={formatMessage(propertySearch.labels.propertyNumber)}
            />
          </T.HeadData>
          <T.HeadData>
            <TableHeadText
              text={formatMessage(propertySearch.labels.usageType)}
            />
          </T.HeadData>
          <T.HeadData>
            <TableHeadText
              text={formatMessage(propertySearch.labels.bruttoWeightTons)}
            />
          </T.HeadData>
          <T.HeadData>
            <TableHeadText text={formatMessage(propertySearch.labels.length)} />
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
        {shipRegistrationNumber && (
          <T.Row key={shipRegistrationNumber}>
            <T.Data>
              <Checkbox
                id={shipRegistrationNumber}
                name={shipRegistrationNumber}
                checked={!!isChecked}
                onChange={() => {
                  selectHandler(
                    {
                      propertyNumber: shipRegistrationNumber,
                      propertyName: `${shipRegistrationNumber} - ${name} (${usageType})`,
                      propertyType: '',
                    },
                    checkedProperties?.findIndex(
                      (property) =>
                        property.propertyNumber === shipRegistrationNumber,
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
              {shipRegistrationNumber}
            </T.Data>
            <T.Data
              text={{
                fontWeight: isChecked ? 'semiBold' : 'regular',
              }}
            >
              {usageType}
            </T.Data>
            <T.Data
              text={{
                fontWeight: isChecked ? 'semiBold' : 'regular',
              }}
            >
              {mainMeasurements?.length}
            </T.Data>
            <T.Data
              text={{
                fontWeight: isChecked ? 'semiBold' : 'regular',
              }}
            >
              {mainMeasurements?.bruttoWeightTons}
            </T.Data>
            <T.Data
              text={{
                fontWeight: isChecked ? 'semiBold' : 'regular',
              }}
              box={{
                textAlign: 'right',
              }}
            >
              {format(parseISO(initialRegistrationDate), 'dd.MM.yyyy', {
                locale: is,
              })}
            </T.Data>
          </T.Row>
        )}
      </T.Body>
    </>
  )
}
