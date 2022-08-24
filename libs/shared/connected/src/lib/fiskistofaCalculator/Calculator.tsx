import { useQuery } from '@apollo/client'
import { GET_SHIP_STATUS_INFORMATION } from './queries'
import {
  GetShipStatusInformationInput,
  ShipStatusInformation,
} from '@island.is/api/domains/fiskistofa'

export const Calculator = ({}) => {
  const { data } = useQuery<
    ShipStatusInformation,
    GetShipStatusInformationInput
  >(GET_SHIP_STATUS_INFORMATION, {
    variables: {
      shipNumber: 1281,
      timePeriod: '1920',
    },
  })

  return <div>{JSON.stringify(data)}</div>
}

export default Calculator
