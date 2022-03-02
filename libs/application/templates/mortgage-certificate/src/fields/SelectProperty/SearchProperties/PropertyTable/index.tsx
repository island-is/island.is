import React, { FC } from 'react'
import { Box, Text, Table as T, RadioButton } from '@island.is/island-ui/core'
import { FieldBaseProps } from '@island.is/application/core'
import { PropertyDetail } from '../../../../types/schema'
import { useLocale } from '@island.is/localization'
import { m } from '../../../../lib/messages'

interface PropertyTableProps {
  selectHandler: (property: PropertyDetail | undefined) => void
  propertyInfo: PropertyDetail | undefined
  selectedPropertyNumber: string | undefined
}

export const PropertyTable: FC<
  FieldBaseProps & PropertyTableProps & PropertyDetail
> = ({
  application,
  field,
  selectHandler,
  propertyInfo,
  selectedPropertyNumber,
}) => {
  const { id } = field

  const unitOfUse = (propertyInfo?.unitsOfUse?.unitsOfUse || [])[0]

  const { formatMessage } = useLocale()

  return (
    <>
      <Box paddingY={2}>
        <Text paddingY={2} variant={'h4'}>
          {propertyInfo?.defaultAddress?.display}
        </Text>
        <T.Table>
          <T.Head>
            <T.Row>
              <T.HeadData></T.HeadData>
              <T.HeadData>
                <TableHeadText text={formatMessage(m.propertyNumber)} />
              </T.HeadData>
              <T.HeadData>
                <TableHeadText text={formatMessage(m.propertyMarking)} />
              </T.HeadData>
              <T.HeadData>
                <TableHeadText text={formatMessage(m.propertyDescription)} />
              </T.HeadData>
              <T.HeadData>
                <TableHeadText
                  text={formatMessage(m.propertyConstructionYear)}
                />
              </T.HeadData>
              <T.HeadData>
                <TableHeadText text={formatMessage(m.propertyShownSize)} />
              </T.HeadData>
            </T.Row>
          </T.Head>
          <T.Body>
            <T.Row>
              <T.Data>
                <RadioButton
                  id={id}
                  name={`${id}`}
                  checked={
                    propertyInfo?.propertyNumber === selectedPropertyNumber
                      ? true
                      : false
                  }
                  onChange={() => {
                    selectHandler(propertyInfo)
                  }}
                />
              </T.Data>
              <T.Data>{propertyInfo?.propertyNumber}</T.Data>
              <T.Data>{unitOfUse?.marking}</T.Data>
              <T.Data>{unitOfUse?.explanation}</T.Data>
              <T.Data>{unitOfUse?.buildYearDisplay}</T.Data>
              <T.Data>
                {unitOfUse?.displaySize ? unitOfUse.displaySize + 'm2' : ''}
              </T.Data>
            </T.Row>
          </T.Body>
        </T.Table>
      </Box>
    </>
  )
}

const TableHeadText: FC<{ text: string }> = ({ text }) => {
  return (
    <Text variant={'small'} as={'p'} fontWeight={'semiBold'}>
      {text}
    </Text>
  )
}
