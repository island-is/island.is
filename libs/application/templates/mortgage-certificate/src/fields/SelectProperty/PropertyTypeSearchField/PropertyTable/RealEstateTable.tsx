import React, { FC } from 'react'
import { Table as T, Checkbox } from '@island.is/island-ui/core'
import { FieldBaseProps } from '@island.is/application/types'
import { RealEstateDetail } from '@island.is/api/schema'
import { useLocale } from '@island.is/localization'
import { FieldArrayWithId } from 'react-hook-form'
import { MortgageCertificate } from '../../../../lib/dataSchema'
import { propertySearch } from '../../../../lib/messages'
import { SelectedProperty } from '../../../../shared'
import { TableHeadText } from './TableHeadText'

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
> = ({ selectHandler, realEstate, checkedProperties }) => {
  const { formatMessage } = useLocale()
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
              text={formatMessage(propertySearch.labels.propertyAddress)}
            />
          </T.HeadData>
          <T.HeadData
            box={{
              textAlign: 'right',
            }}
          >
            <TableHeadText
              text={formatMessage(propertySearch.labels.propertyDescription)}
            />
          </T.HeadData>
        </T.Row>
      </T.Head>
      <T.Body>
        {realEstate?.map((propertyDetail) => {
          const { usage, propertyNumber, defaultAddress } = propertyDetail
          const isChecked = checkedProperties?.find(
            (property) => property.propertyNumber === propertyNumber,
          )
          return (
            propertyNumber && (
              <T.Row key={propertyNumber}>
                <T.Data>
                  <Checkbox
                    id={propertyNumber}
                    name={propertyNumber}
                    checked={!!isChecked}
                    onChange={() => {
                      selectHandler(
                        {
                          propertyNumber,
                          propertyName: `F${propertyDetail.propertyNumber} - ${propertyDetail.defaultAddress}`,
                          propertyType: '',
                        },
                        checkedProperties?.findIndex(
                          (property) =>
                            property.propertyNumber === propertyNumber,
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
                  F{propertyNumber}
                </T.Data>
                <T.Data
                  text={{
                    fontWeight: isChecked ? 'semiBold' : 'regular',
                  }}
                >
                  {defaultAddress}
                </T.Data>
                <T.Data
                  text={{
                    fontWeight: isChecked ? 'semiBold' : 'regular',
                  }}
                  box={{
                    textAlign: 'right',
                  }}
                >
                  {usage}
                </T.Data>
              </T.Row>
            )
          )
        })}
      </T.Body>
    </>
  )
}
