import React, { FC, useState } from 'react'
import { FieldBaseProps, formatText } from '@island.is/application/core'
import { Box, Text, Table as T, RadioButton } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { RealEstate, SelectedProperty } from '../PropertiesManager'
import { PropertyTable } from '../PropertyTable'
import { PropertyOverviewWithDetail, PropertyDetail } from '../../types/schema'

interface RegisteredPropertiesProps {
  selectHandler: (property: RealEstate) => void
  activePropertyNumber: string
}

export const RegisteredProperties: FC<
  FieldBaseProps & RegisteredPropertiesProps
> = ({ application, selectHandler, activePropertyNumber }) => {
  const { externalData } = application
  const properties =
    (externalData.nationalRegistryRealEstate
      ?.data as PropertyOverviewWithDetail)?.properties || []

  return properties.map((p: PropertyDetail) => {
    const unitsOfUseList = p.unitsOfUse?.unitsOfUse
    const unitOfUse =
      unitsOfUseList && unitsOfUseList[unitsOfUseList.length - 1]
    return (
      <PropertyTable
        key={p.propertyNumber}
        selectHandler={selectHandler}
        activePropertyNumber={activePropertyNumber}
        {...p}
      />
    )
  })
}
