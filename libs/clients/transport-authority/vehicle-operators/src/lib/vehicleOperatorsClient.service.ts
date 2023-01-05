import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import { OperatorApi } from '../../gen/fetch/apis'
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

  // Note: When calling this endpoint we should make sure that the person that
  // created the application (and chose the new operators), is the current owner
  // of the vehicle (since the API does not do any such validation)
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
          endDate: null,
          mainOperator: operator.isMainOperator ? 1 : 0,
        })),
      },
    })
  }
}
