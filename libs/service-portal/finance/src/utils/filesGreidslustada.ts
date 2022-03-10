import { downloadFile } from './downloadFile'
import flatten from 'lodash/flatten'
import {
  FinanceStatusDataType,
  FinanceStatusOrganizationType,
} from '../screens/FinanceStatus/FinanceStatusData.types'
import { greidsluStadaHeaders } from './dataHeaders'
const name = 'Staða ríkissjóður stofnanir'

const getDataArray = (data: FinanceStatusDataType) =>
  data?.organizations?.map((org: FinanceStatusOrganizationType) =>
    org?.chargeTypes?.map((chargeType) => [
      chargeType.name,
      chargeType.totals,
      org.name,
      org.homepage,
      org.phone,
      org.email,
    ]),
  )

export const exportGreidslustadaFile = async (
  data: FinanceStatusDataType,
  type: 'xlsx' | 'csv',
) => {
  const dataArrays = getDataArray(data)

  await downloadFile(name, greidsluStadaHeaders, flatten(dataArrays), type)
}
