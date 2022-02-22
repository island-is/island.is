import React, { FC, useState } from 'react'
import { FieldBaseProps, formatText } from '@island.is/application/core'
import { Box, Text, Table as T, RadioButton } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { RealEstate, SelectedProperty } from '../PropertiesManager'
import { PropertyTable } from '../PropertyTable'

interface RegisteredPropertiesProps {
  selectHandler: (property: RealEstate) => void
  activePropertyNumber: string
}

export const RegisteredProperties: FC<
  FieldBaseProps & RegisteredPropertiesProps
> = ({ application, selectHandler, activePropertyNumber }) => {
  const { externalData } = application
  const properties = externalData.nationalRegistryRealEstate.data.properties

  return properties.map((p: RealEstate) => {
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
