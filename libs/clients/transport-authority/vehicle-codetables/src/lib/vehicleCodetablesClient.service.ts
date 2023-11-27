import { Injectable } from '@nestjs/common'
import { CodeTableApi } from '../../gen/fetch/apis'
import {
  FuelType,
  InsuranceCompany,
  PlateType,
} from './vehicleCodetablesClient.types'

@Injectable()
export class VehicleCodetablesClient {
  constructor(private readonly codetablesApi: CodeTableApi) {}

  public async getInsuranceCompanies(): Promise<InsuranceCompany[]> {
    const result = await this.codetablesApi.insurancecompaniesGet({
      apiVersion: '2.0',
      apiVersion2: '2.0',
    })

    return result.map((item) => ({
      code: item.code,
      name: item.name,
    }))
  }

  public async getPlateTypes(): Promise<PlateType[]> {
    const result = await this.codetablesApi.platetypesAllGet({
      apiVersion: '2.0',
      apiVersion2: '2.0',
    })

    return result.map((item) => ({
      code: item.code,
      name: item.name,
      plateHeight: item.plateHeight,
      plateWidth: item.plateWidth,
    }))
  }

  public async getFuelTypes(): Promise<FuelType[]> {
    const result = await this.codetablesApi.fuelAllGet({
      apiVersion: '2.0',
      apiVersion2: '2.0',
    })

    return result.map((item) => ({
      code: item.code,
      name: item.name,
      valid: item.valid,
    }))
  }

  public async getImportCodes(): Promise<FuelType[]> {
    const result = await this.codetablesApi.importcodesAllGet({
      apiVersion: '2.0',
      apiVersion2: '2.0',
    })

    return result.map((item) => ({
      code: item.code,
      name: item.name,
      valid: item.valid,
    }))
  }
}
