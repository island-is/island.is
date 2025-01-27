import { FC, useState } from 'react'
import { CustomField, FieldBaseProps } from '@island.is/application/types'
import { AsyncSearch, AsyncSearchOption } from '@island.is/island-ui/core'
import { size } from 'lodash'

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
        propertyId: '2042190',
        size: '174.5',
        propertyType: 'Raðhús',
        merking: '040101',
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
        propertyType: 'Íbúð',
        size: '67.3',
        merking: [
          {
            id: '020102',
            units: [
              {
                unitId: '2383972',
                merking: '0101',
                unitType: 'íbúð',
                size: '67.3',
                numberOfRooms: '2',
              },
              {
                unitId: '2374580',
                merking: 'E035',
                unitType: 'Stæði í bílageymslu',
                size: '0',
                numberOfRooms: undefined,
              },
            ],
          },
        ],
      },
      {
        propertyId: '2507086',
        propertyType: 'Íbúð',
        size: '57.2',
        merking: [
          {
            id: '020103',
            units: [
              {
                unitId: '2383973',
                merking: '0102',
                unitType: 'íbúð',
                size: '57.2',
                numberOfRooms: '2',
              },
              {
                unitId: '2374581',
                merking: 'E036',
                unitType: 'Stæði í bílageymslu',
                size: '0',
                numberOfRooms: undefined,
              },
            ],
          },
        ],
      },
      {
        propertyId: '2507087',
        propertyType: 'Íbúð',
        size: '117.3',
        merking: [
          {
            id: '020201',
            units: [
              {
                unitId: '2383974',
                merking: '0103',
                unitType: 'íbúð',
                size: '117.3',
                numberOfRooms: '3',
              },
              {
                unitId: '2374580',
                merking: 'E025',
                unitType: 'Stæði í bílageymslu',
                size: '0',
                numberOfRooms: undefined,
              },
            ],
          },
        ],
      },
      {
        propertyId: '2507404',
        propertyType: 'Íbúð',
        size: '99.4',
        merking: [
          {
            id: '020202',
            units: [
              {
                unitId: '2383978',
                merking: '0201',
                unitType: 'íbúð',
                size: '99.4',
                numberOfRooms: '3',
              },
              {
                unitId: '2374582',
                merking: 'E037',
                unitType: 'Stæði í bílageymslu',
                size: '0',
                numberOfRooms: undefined,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    streetAddress: 'Eggertsgata 22',
    regionNumber: '112',
    cityName: 'Reykjavík',
    propertyIds: [
      {
        propertyId: '2215524',
        merking: '160003',
        propertyType: 'Íbúð',
        size: '952.8',
        units: [
          {
            unitId: '2215526',
            merking: '0004',
            unitType: 'íbúð',
            size: '36.1',
            numberOfRooms: '1',
          },
          {
            unitId: '2215527',
            merking: '0005',
            unitType: 'íbúð',
            size: '52',
            numberOfRooms: '2',
          },
          {
            unitId: '2215528',
            merking: '0101',
            unitType: 'íbúð',
            size: '53.1',
            numberOfRooms: '2',
          },
          {
            unitId: '2215531',
            merking: '0102',
            unitType: 'íbúð',
            size: '52.6',
            numberOfRooms: '2',
          },
          {
            unitId: '2215532',
            merking: '0103',
            unitType: 'íbúð',
            size: '36.1',
            numberOfRooms: '1',
          },
          {
            unitId: '2215533',
            merking: '0004',
            unitType: 'íbúð',
            size: '36.1',
            numberOfRooms: '1',
          },
          {
            unitId: '2215534',
            merking: '0004',
            unitType: 'íbúð',
            size: '52.6',
            numberOfRooms: '2',
          },
        ],
      },
    ],
  },
]
