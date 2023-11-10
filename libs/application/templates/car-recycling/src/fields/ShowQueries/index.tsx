import React, { FC } from 'react'
import gql from 'graphql-tag'

import { Application, RecordObject, Field } from '@island.is/application/types'
import { GridColumn, GridRow, Text } from '@island.is/island-ui/core'
import { DataValue } from '@island.is/application/ui-components'

import { useQuery } from '@apollo/client'

export const query = gql`
  query GetVehicles {
    findAllWithPermno {
      vehicleId
      recyclingPartnerId
      vehicle {
        vehicleOwner
        vinNumber
      }
    }
  }
`

type permoVehicle = {
  findAllWithPermno?: Array<{
    vehicleId: string
    recyclingPartnerId: string
    vehicle: {
      vehicleOwner: string
      vinNumber: string
    }
  }>
}

export const useGetVehicles = () => {
  const { data } =
    useQuery<permoVehicle>(query)

  return (
    data?.findAllWithPermno?.map(({ vehicleId, recyclingPartnerId }) => ({
      label: vehicleId,
      value: recyclingPartnerId,
    })) ?? []
  )
}

type SelectOption = {
  label: string
  value: string
}

function getSelectOptionLabel(options: SelectOption[], id?: string) {
  if (id === undefined) {
    return undefined
  }

  return options.find((option) => option.value === id)?.label
}

interface ScreenProps {
  application: Application
  field: Field
  errors?: RecordObject
}

const ShowQueries: FC<
  React.PropsWithChildren<ScreenProps>
> = ({ application }) => {
  const pensionFundOptions = useGetVehicles()

  return (
    <GridRow marginTop={2}>
      <Text> There is something here</Text>
      <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
        <DataValue
          label='testing'
          value={getSelectOptionLabel(pensionFundOptions, 'pensionFund')}
        />
      </GridColumn>
    </GridRow>
  )
}

export default ShowQueries
