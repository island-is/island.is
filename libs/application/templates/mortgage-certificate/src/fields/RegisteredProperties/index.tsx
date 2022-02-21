import React, { FC } from 'react'
import { FieldBaseProps, formatText } from '@island.is/application/core'
import { Box, Text, Table as T, RadioButton } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'

interface RealEstateData {
  display: string
  displayShort: string
  locationNumber: number
  municipality: string
  postNumber: number
  propertyNumber: number
}

interface RealEstate {
  defaultAddress: RealEstateData
  propertyNumber: string
}

export const RegisteredProperties: FC<FieldBaseProps> = ({ application }) => {
  const { externalData } = application
  const properties = externalData.nationalRegistryRealEstate.data.properties

  return properties.map((p: RealEstate) => {
    return (
      <Box paddingY={2} key={p.propertyNumber}>
        <Text paddingY={2} variant={'h4'}>
          {p.defaultAddress.display}
        </Text>
        <T.Table>
          <T.Head>
            <T.Row>
              <T.HeadData></T.HeadData>
              <T.HeadData>
                <Text variant={'small'} as={'p'} fontWeight={'semiBold'}>
                  Fasteignarnúmer
                </Text>
              </T.HeadData>
              <T.HeadData>
                <Text variant={'small'} as={'p'} fontWeight={'semiBold'}>
                  Merking
                </Text>
              </T.HeadData>
              <T.HeadData>
                <Text variant={'small'} as={'p'} fontWeight={'semiBold'}>
                  Lýsing
                </Text>
              </T.HeadData>
              <T.HeadData>
                <Text variant={'small'} as={'p'} fontWeight={'semiBold'}>
                  Byggingarár
                </Text>
              </T.HeadData>
              <T.HeadData>
                <Text variant={'small'} as={'p'} fontWeight={'semiBold'}>
                  Birt stærð
                </Text>
              </T.HeadData>
            </T.Row>
          </T.Head>
          <T.Body>
            <T.Row>
              <T.Data>
                <RadioButton />
              </T.Data>
              <T.Data>{p.propertyNumber}</T.Data>
              <T.Data>01 0001</T.Data>
              <T.Data>Íbúð</T.Data>
              <T.Data>1965</T.Data>
              <T.Data>57.1m2</T.Data>
            </T.Row>
          </T.Body>
        </T.Table>
      </Box>
    )
  })
}
