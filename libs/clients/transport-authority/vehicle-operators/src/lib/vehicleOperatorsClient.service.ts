import { Injectable } from '@nestjs/common'
import { OperatorApi } from '../../gen/fetch/apis'
import { ReturnTypeMessage } from '../../gen/fetch/models'
import { Operator } from './vehicleOperatorsClient.types'

@Injectable()
export class VehicleOperatorsClient {
  constructor(private readonly operatorsApi: OperatorApi) {}

  public async getOperators(permno: string): Promise<Operator[]> {
    // const result = await this.operatorsApi.permnoGet({ permno: permno })

    return []
    /* result.map((item) => ({
      startDate: item.startDate,
      endDate: item.endDate,
      ssn: item.persidno,
      name: item.name,
      isMainOperator: item.mainOperator,
      operatorSerialNumber: item.operatorSerialNumber,
    })) */
  }

  public async saveOperators(
    currentUserSsn: string,
    permno: string,
    operators: Operator[],
  ): Promise<ReturnTypeMessage[] | null> {
    //TODOx waiting for new endpoint without contract
    throw Error('Not implemented')
    return null
    // const result = await this.operatorsApi.post({
    //   json: {
    //     permno: permno,
    //     reportingPersonIdNumber: currentUserSsn,
    //     operators: operators.map((operator) => ({
    //       personIdNumber: operator.ssn || '',
    //       // startDate: operator.startDate || new Date(),
    //       // endDate: operator.endDate || null,
    //       mainOperator: operator.isMainOperator ? 1 : 0,
    //     })),
    //     contract: new Blob(),
    //   },
    // })

    // return result
  }
}
