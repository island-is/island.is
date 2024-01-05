import React, { FC } from 'react'
import { Box, Text, Table as T, RadioButton } from '@island.is/island-ui/core'
import { FieldBaseProps } from '@island.is/application/types'
import { PropertyDetail } from '@island.is/api/schema'
import { useLocale } from '@island.is/localization'
import { m } from '../../../../lib/messages'

interface PropertyTableProps {
  selectHandler: (property: PropertyDetail | undefined) => void
  propertyInfo: PropertyDetail | undefined
  selectedPropertyNumber: string | undefined
}

export const PropertyTable: FC<
  React.PropsWithChildren<FieldBaseProps & PropertyTableProps & PropertyDetail>
> = ({ selectHandler, propertyInfo, selectedPropertyNumber }) => {
  const unitOfUse = (propertyInfo?.unitsOfUse?.unitsOfUse || [])[0]

  const propertyNumber = propertyInfo?.propertyNumber || ''

  const { formatMessage } = useLocale()

  return (
    <>
      <Box paddingY={2}>
        <T.Table>
          <T.Head>
            <T.Row>
              <T.HeadData></T.HeadData>
              <T.HeadData>
                <TableHeadText text={formatMessage(m.propertyNumber)} />
              </T.HeadData>
              <T.HeadData>
                <TableHeadText text={formatMessage(m.propertyDescription)} />
              </T.HeadData>
              <T.HeadData>
                <TableHeadText text={formatMessage(m.propertyAddress)} />
              </T.HeadData>
            </T.Row>
          </T.Head>
          <T.Body>
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
              <T.Data>{unitOfUse?.explanation}</T.Data>
              <T.Data>{propertyInfo?.defaultAddress?.display}</T.Data>
            </T.Row>
          </T.Body>
        </T.Table>
      </Box>
    </>
  )
}

const TableHeadText: FC<React.PropsWithChildren<{ text: string }>> = ({
  text,
}) => {
  return (
    <Text variant={'small'} as={'p'} fontWeight={'semiBold'}>
      {text}
    </Text>
  )
}
