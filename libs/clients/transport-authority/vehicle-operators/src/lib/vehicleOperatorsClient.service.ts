import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import { OperatorApi } from '../../gen/fetch/apis'
import { ReturnTypeMessage } from '../../gen/fetch/models'
import { Operator } from './vehicleOperatorsClient.types'

@Injectable()
export class VehicleOperatorsClient {
  constructor(private readonly operatorsApi: OperatorApi) {}

  private operatorsApiWithAuth(auth: Auth) {
    return this.operatorsApi.withMiddleware(new AuthMiddleware(auth))
  }

  public async getOperators(auth: User, permno: string): Promise<Operator[]> {
    const result = await this.operatorsApiWithAuth(auth).permnoGet({
      apiVersion: '2.0',
      apiVersion2: '2.0',
      permno: permno,
    })

    return result.map((item) => ({
      startDate: item.startDate,
      endDate: item.endDate,
      ssn: item.persidno,
      name: item.name,
      isMainOperator: item.mainOperator,
      operatorSerialNumber: item.operatorSerialNumber,
    }))
  }

  public async saveOperators(
    auth: User,
    permno: string,
    operators: Operator[],
  ): Promise<void> {
    await this.operatorsApiWithAuth(auth).withoutcontractPost({
      apiVersion: '2.0',
      apiVersion2: '2.0',
      postOperatorsWithoutContractModel: {
        permno: permno,
        reportingPersonIdNumber: auth.nationalId,
        operators: operators.map((operator) => ({
          personIdNumber: operator.ssn || '',
          startDate: operator.startDate || new Date(),
          endDate: operator.endDate || null,
          mainOperator: operator.isMainOperator ? 1 : 0,
        })),
      },
    })
  }
}
