import { GenericLicenseDataField } from '../../../types'

export type MockProps = {
  number: string
  name: string
  expires: string
  dataFields?: Array<GenericLicenseDataField>
}
