import { VehicleSearchDto } from '@island.is/clients/vehicles'
import { OperatorAnonymityStatus } from './models/getVehicleSearch.model'

export interface VehicleSearchOperatorDto {
  operatorNames?: Array<string> | null
  operatorAnonymityStatus?: OperatorAnonymityStatus
}

export interface VehicleSearchCustomDto
  extends VehicleSearchDto,
    VehicleSearchOperatorDto {}

export enum LocaleEnum {
  En = 'en',
  Is = 'is',
}
