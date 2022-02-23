import React, { FC, useState } from 'react'
import { FieldBaseProps, formatText } from '@island.is/application/core'
import { Box, Text, Input, Button } from '@island.is/island-ui/core'
import { PropertyTable } from '../PropertyTable'
import { PropertyDetail, PropertyOverviewWithDetail } from '../../types/schema'
import { gql, useLazyQuery } from '@apollo/client'

interface SearchPropertiesProps {
  selectHandler: (property: PropertyDetail) => void
  activePropertyNumber: string | null | undefined
}

export const searchRealEstateMutation = gql`
  query SearchRealEstateQuery($input: GetRealEstateInput!) {
    assetsDetail(input: $input) {
      propertyNumber
      defaultAddress {
        locationNumber
        postNumber
        municipality
        propertyNumber
        display
        displayShort
      }
      appraisal {
        activeAppraisal
        plannedAppraisal
        activeStructureAppraisal
        plannedStructureAppraisal
        activePlotAssessment
        plannedPlotAssessment
        activeYear
        plannedYear
      }
      registeredOwners {
        registeredOwners {
          name
          ssn
          ownership
          purchaseDate
          grantDisplay
        }
      }
      unitsOfUse {
        unitsOfUse {
          propertyNumber
          unitOfUseNumber
          marking
          usageDisplay
          displaySize
          buildYearDisplay
          fireAssessment
          explanation
          appraisal {
            activeAppraisal
            plannedAppraisal
            activeStructureAppraisal
            plannedStructureAppraisal
            activePlotAssessment
            plannedPlotAssessment
            activeYear
            plannedYear
          }
          address {
            locationNumber
            postNumber
            municipality
            propertyNumber
            display
            displayShort
          }
        }
      }
    }
  }
`

export const SearchProperties: FC<FieldBaseProps & SearchPropertiesProps> = ({
  application,
  selectHandler,
  activePropertyNumber,
}) => {
  const [propertyNumber, setPropertyNumber] = useState('')
  const [foundProperty, setFoundProperty] = useState<
    PropertyDetail | undefined
  >(undefined)

  const [searching, setSearching] = useState<boolean>(false)

  const [runQuery] = useLazyQuery(searchRealEstateMutation, {
    variables: {
      input: {
        assetId: propertyNumber,
      },
    },
    onCompleted(result) {
      setFoundProperty(result.assetsDetail)
      setSearching(false)
    },
    onError() {
      setSearching(false)
    },
  })

  const handleClickSearch = () => {
    setFoundProperty(undefined)
    setSearching(true)
    runQuery()
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
            name="propertyNumber"
            onChange={(e) => setPropertyNumber(e.target.value)}
          />
        </Box>
        <Box>
          <Button
            disabled={searching}
            onClick={() => handleClickSearch()}
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
          activePropertyNumber={activePropertyNumber || ''}
          {...foundProperty}
        />
      )}
    </Box>
  )
}
