import React, { FC, useState } from 'react'
import { FieldBaseProps, formatText } from '@island.is/application/core'
import { Box, Text, Input, Button } from '@island.is/island-ui/core'
import { RealEstate } from '../PropertiesManager'
import { PropertyTable } from '../PropertyTable'

interface SearchPropertiesProps {
  selectHandler: (property: RealEstate) => void
  activePropertyNumber: string
}

export const SearchProperties: FC<FieldBaseProps & SearchPropertiesProps> = ({
  application,
  selectHandler,
  activePropertyNumber,
}) => {
  // Replace this mock functionality with skra api calls inside PropertyManager component
  const { externalData } = application
  const mockProperties = externalData.nationalRegistryRealEstate.data.properties

  const [propertyNumber, setPropertyNumber] = useState('')
  const [foundProperty, setFoundProperty] = useState<RealEstate | undefined>(
    undefined,
  )
  const [searching, setSearching] = useState<boolean>(false)

  const handleSearch = () => {
    setSearching(true)
    setTimeout(() => {
      const property = mockProperties.filter(
        (p: RealEstate) => p.propertyNumber === propertyNumber,
      )[0]
      setFoundProperty(property)
      setSearching(false)
    }, 2500)
  }

  return (
    <Box paddingY={2}>
      <Text paddingY={2} variant={'h4'}>
        Hér að neðan getur þú einnig leitað í fasteignanúmerum annarra eigna
      </Text>
      <Box display="flex" flexDirection="row">
        <Box width="full" marginRight={2}>
          <Input
            size="sm"
            label="Fasteignarnúmer"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPropertyNumber(e.target.value)
            }
          />
        </Box>
        <Box>
          <Button
            disabled={searching}
            onClick={() => handleSearch()}
            variant="ghost"
            style={{ width: 146, paddingLeft: 20, paddingRight: 20 }}
          >
            Leita að eign
          </Button>
        </Box>
      </Box>
      {foundProperty !== undefined && (
        <PropertyTable
          key={foundProperty.propertyNumber}
          selectHandler={selectHandler}
          activePropertyNumber={activePropertyNumber}
          {...foundProperty}
        />
      )}
    </Box>
  )
}
