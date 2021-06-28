import { downloadCSV } from './downloadFile'
import flatten from 'lodash/flatten'
import {
  FinanceStatusDataType,
  FinanceStatusOrganizationType,
} from '../screens/FinanceStatus/FinanceStatusData.types'
import { greidsluStadaHeaders } from './dataHeaders'

const getDataArray = (data: FinanceStatusDataType) =>
  data.organizations.map((org: FinanceStatusOrganizationType) =>
    org.chargeTypes.map((chargeType) => [
      chargeType.name,
      chargeType.totals.toString(),
      org.name,
      org.homepage,
      org.phone,
      org.email,
    ]),
  )

export const exportGreidslustadaCSV = async (data: FinanceStatusDataType) => {
  const name = 'Staða ríkissjóður stofnanir'
  const dataArrays = getDataArray(data)

  await downloadCSV(name, greidsluStadaHeaders, flatten(dataArrays))
}

export const exportGreidslustadaXSLX = (data: FinanceStatusDataType) => {
  const dataArrays = getDataArray(data)

  return flatten(dataArrays)
}
