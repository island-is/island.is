import { useQuery } from '@apollo/client'
import { GET_SHIP_STATUS_INFORMATION } from './queries'
import {
  GetShipStatusInformationInput,
  ShipStatusInformation,
} from '@island.is/api/domains/fiskistofa'
import { Table as T } from '@island.is/island-ui/core'

export const Calculator = ({}) => {
  const { data } = useQuery<
    { getShipStatusInformation: ShipStatusInformation },
    { input: GetShipStatusInformationInput }
  >(GET_SHIP_STATUS_INFORMATION, {
    variables: {
      input: {
        shipNumber: 1281,
        timePeriod: '1920',
      },
    },
  })

  return (
    <T.Table>
      <T.Head>
        <T.Row>
          <T.HeadData>Reiknivél</T.HeadData>
        </T.Row>
      </T.Head>
      <T.Body>
        {data?.getShipStatusInformation?.allowedCatchCategories?.map(
          (category) => (
            <T.Row>
              <T.Data>{category}</T.Data>
            </T.Row>
          ),
        )}
        <T.Row>
          <T.Data>Data</T.Data>
        </T.Row>
      </T.Body>
      <T.Foot>
        <T.Row>
          <T.Data>Foot</T.Data>
        </T.Row>
      </T.Foot>
    </T.Table>
  )
}

export default Calculator
