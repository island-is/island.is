import { FC, useState } from 'react'
import { CustomField, FieldBaseProps } from '@island.is/application/types'
import { AsyncSearch, AsyncSearchOption } from '@island.is/island-ui/core'

interface Props extends FieldBaseProps {
  field: CustomField
}

export const PropertySearch: FC<React.PropsWithChildren<Props>> = ({
  application,
}) => {
  const { answers: formValue } = application
  const [options, setOptions] = useState<AsyncSearchOption[]>([])

  return (
    <AsyncSearch
      options={[]}
      placeholder="Leitaðu eftir heimiisfangi"
      closeMenuOnSubmit
    />
  )
}

const properties = [
  {
    streetAddress: 'Jöklafold 5',
    regionNumber: '112',
    cityName: 'Reykjavík',
    propertyIds: [
      {
        propertyId: 'P67890',
        unit: ['U125'],
        size: '150 sqm',
        numberOfRooms: 4,
      },
    ],
  },
  {
    streetAddress: 'Valshlíð 6',
    regionNumber: '102',
    cityName: 'Reykjavik',
    propertyIds: [
      {
        propertyId: '2507085',
        unit: ['020101'],
        size: '67.3',
        numberOfRooms: 3,
      },
      {
        propertyId: '2507086',
        unit: ['020101'],
        size: '120 sqm',
        numberOfRooms: 3,
      },
      {
        propertyId: '2507087',
        unit: ['020101'],
        size: '120 sqm',
        numberOfRooms: 3,
      },
      {
        propertyId: '2507404',
        unit: ['020101'],
        size: '120 sqm',
        numberOfRooms: 3,
      },
      {
        propertyId: '2507405',
        unit: ['020101'],
        size: '120 sqm',
        numberOfRooms: 3,
      },
      {
        propertyId: '2507405',
        unit: ['020101'],
        size: '120 sqm',
        numberOfRooms: 3,
      },
      {
        propertyId: '2507406',
        unit: ['020101'],
        size: '120 sqm',
        numberOfRooms: 3,
      },
      {
        propertyId: '2507410',
        unit: ['020101'],
        size: '120 sqm',
        numberOfRooms: 3,
      },
      {
        propertyId: '2507411',
        unit: ['020101'],
        size: '120 sqm',
        numberOfRooms: 3,
      },
      {
        propertyId: '2507412',
        unit: ['020101'],
        size: '120 sqm',
        numberOfRooms: 3,
      },
      {
        propertyId: '2507416',
        unit: ['020101'],
        size: '120 sqm',
        numberOfRooms: 3,
      },
      {
        propertyId: '2507417',
        unit: ['020101'],
        size: '120 sqm',
        numberOfRooms: 3,
      },
      {
        propertyId: '2507418',
        unit: ['020101'],
        size: '120 sqm',
        numberOfRooms: 3,
      },
      {
        propertyId: '2507422',
        unit: ['020101'],
        size: '120 sqm',
        numberOfRooms: 3,
      },
      {
        propertyId: '2507423',
        unit: ['020101'],
        size: '120 sqm',
        numberOfRooms: 3,
      },
    ],
  },
  {
    streetAddress: '456 Elm St',
    houseNumber: '2B',
    regionNumber: '102',
    cityName: 'Akureyri',
    propertyIds: [
      {
        propertyId: 'P67890',
        unitIds: ['U125'],
        size: '150 sqm',
        numberOfRooms: 4,
      },
    ],
  },
  {
    streetAddress: '789 Oak St',
    houseNumber: '3C',
    regionNumber: '103',
    cityName: 'Kopavogur',
    propertyIds: [
      {
        propertyId: 'P54321',
        unitIds: ['U126', 'U127'],
        size: '100 sqm',
        numberOfRooms: 2,
      },
    ],
  },
  {
    streetAddress: '101 Pine St',
    houseNumber: '4D',
    regionNumber: '104',
    cityName: 'Hafnarfjordur',
    propertyIds: [
      {
        propertyId: 'P98765',
        unitIds: ['U128'],
        size: '130 sqm',
        numberOfRooms: 3,
      },
    ],
  },
  {
    streetAddress: '202 Birch St',
    houseNumber: '5E',
    regionNumber: '105',
    cityName: 'Selfoss',
    propertyIds: [
      {
        propertyId: 'P11223',
        unitIds: ['U129', 'U130'],
        size: '140 sqm',
        numberOfRooms: 4,
      },
    ],
  },
]
