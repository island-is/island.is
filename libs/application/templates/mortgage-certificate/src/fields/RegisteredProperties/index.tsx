import React, { FC } from 'react'
import { FieldBaseProps, formatText } from '@island.is/application/core'
import { Box, Text, Table as T, RadioButton } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { PropertyOverviewWithDetail, PropertyDetail } from '../../types/schema'

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
  const properties = (externalData.nationalRegistryRealEstate?.data as PropertyOverviewWithDetail)?.properties || []

  return properties.map((p: PropertyDetail) => {
    const unitsOfUseList = p.unitsOfUse?.unitsOfUse;
    const unitOfUse = unitsOfUseList && unitsOfUseList[unitsOfUseList.length - 1]
    return (
      <Box paddingY={2} key={p.propertyNumber}>
        <Text paddingY={2} variant={'h4'}>
          {p.defaultAddress?.display}
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
              <T.Data>{unitOfUse?.marking}</T.Data>
              <T.Data>{unitOfUse?.explanation}</T.Data>
              <T.Data>{unitOfUse?.buildYearDisplay}</T.Data>
              <T.Data>{unitOfUse?.displaySize ? unitOfUse.displaySize + 'm2' : ''}</T.Data>
            </T.Row>
          </T.Body>
        </T.Table>
      </Box>
    )
  })
}
