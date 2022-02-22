import React, { FC } from 'react'
import { Box, Text, Table as T, RadioButton } from '@island.is/island-ui/core'
import { RealEstate } from '../PropertiesManager'

interface PropertyTableProps {
  selectHandler: (property: RealEstate) => void
  activePropertyNumber: string
}

export const PropertyTable: FC<RealEstate & PropertyTableProps> = ({
  defaultAddress,
  propertyNumber,
  selectHandler,
  activePropertyNumber,
}) => (
  <>
    <Box paddingY={2}>
      <Text paddingY={2} variant={'h4'}>
        {defaultAddress.display}
      </Text>
      <T.Table>
        <T.Head>
          <T.Row>
            <T.HeadData></T.HeadData>
            <T.HeadData>
              <TableHeadText text="Fasteignarnúmer" />
            </T.HeadData>
            <T.HeadData>
              <TableHeadText text="Merking" />
            </T.HeadData>
            <T.HeadData>
              <TableHeadText text="Lýsing" />
            </T.HeadData>
            <T.HeadData>
              <TableHeadText text="Byggingarár" />
            </T.HeadData>
            <T.HeadData>
              <TableHeadText text="Birt stærð" />
            </T.HeadData>
          </T.Row>
        </T.Head>
        <T.Body>
          <T.Row>
            <T.Data>
              <RadioButton
                checked={propertyNumber === activePropertyNumber ? true : false}
                onChange={() =>
                  selectHandler({ defaultAddress, propertyNumber })
                }
              />
            </T.Data>
            <T.Data>{propertyNumber}</T.Data>
            <T.Data>01 0001</T.Data>
            <T.Data>Íbúð</T.Data>
            <T.Data>1965</T.Data>
            <T.Data>57.1m2</T.Data>
          </T.Row>
        </T.Body>
      </T.Table>
    </Box>
  </>
)

const TableHeadText: FC<{ text: string }> = ({ text }) => {
  return (
    <Text variant={'small'} as={'p'} fontWeight={'semiBold'}>
      {text}
    </Text>
  )
}
