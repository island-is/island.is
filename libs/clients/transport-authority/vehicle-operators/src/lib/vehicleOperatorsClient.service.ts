import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import { ReturnTypeMessage } from '../../gen/fetch'
import { OperatorApi } from '../../gen/fetch/apis'
import {
  Operator,
  OperatorChangeValidation,
} from './vehicleOperatorsClient.types'

@Injectable()
export class VehicleOperatorsClient {
  constructor(private readonly operatorsApi: OperatorApi) {}

  private operatorsApiWithAuth(auth: Auth) {
    return this.operatorsApi.withMiddleware(new AuthMiddleware(auth))
  }

  public async getOperators(auth: User, permno: string): Promise<Operator[]> {
    const result = await this.operatorsApiWithAuth(auth).permnoGet({
      apiVersion: '3.0',
      apiVersion2: '3.0',
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

  public async validateVehicleForOperatorChange(
    auth: User,
    permno: string,
  ): Promise<OperatorChangeValidation> {
    // Since we don't have operators selected yet, we will send in empty array
    return await this.validateAllForOperatorChange(auth, permno, [])
  }

  public async validateAllForOperatorChange(
    auth: User,
    permno: string,
    operators: Operator[],
  ): Promise<OperatorChangeValidation> {
    let errorList: ReturnTypeMessage[] = []

    try {
      await this.operatorsApiWithAuth(auth).withoutcontractPost({
        apiVersion: '3.0',
        apiVersion2: '3.0',
        postOperatorsWithoutContractModel: {
          permno: permno,
          startDate: new Date(),
          reportingPersonIdNumber: auth.nationalId,
          operators: operators.map((operator) => ({
            personIdNumber: operator.ssn || '',
            mainOperator: operator.isMainOperator ? 1 : 0,
          })),
          onlyRunFlexibleWarning: true,
        },
      })
    } catch (e) {
      // TODOx this will probably throw an error if operators is empty, maybe catch that?

      // Note: We need to wrap in try-catch to get the error messages, because if this action results in error,
      // we get 400 error (instead of 200 with error messages) with the errorList in this field (problem.Errors),
      // that is of the same class as 200 result schema
      if (e?.problem?.Errors) {
        errorList = e.problem.Errors as ReturnTypeMessage[]
      } else {
        throw e
      }
    }

    const warnSeverityError = 'E'
    errorList = errorList.filter((x) => x.warnSever === warnSeverityError)

    return {
      hasError: errorList.length > 0,
      errorMessages: errorList.map((item) => {
        return {
          errorNo: (item.warnSever || '_') + item.warningSerialNumber,
          defaultMessage: item.errorMess,
        }
      }),
    }
  }

  // Note: When calling this endpoint we should make sure that the person that
  // created the application (and chose the new operators), is the current owner
  // of the vehicle (since the API does not do any such validation)
  public async saveOperators(
    auth: User,
    permno: string,
    operators: Operator[],
  ): Promise<void> {
    if (operators.length === 0) {
      await this.operatorsApiWithAuth(auth).closeWithoutcontractPost({
        apiVersion: '3.0',
        apiVersion2: '3.0',
        postCloseOperatorsWithoutContractModel: {
          permno: permno,
          endDate: new Date(),
          reportingPersonIdNumber: auth.nationalId,
        },
      })
    } else {
      await this.operatorsApiWithAuth(auth).withoutcontractPost({
        apiVersion: '3.0',
        apiVersion2: '3.0',
        postOperatorsWithoutContractModel: {
          permno: permno,
          startDate: new Date(),
          reportingPersonIdNumber: auth.nationalId,
          onlyRunFlexibleWarning: false,
          operators: operators.map((operator) => ({
            personIdNumber: operator.ssn || '',
            mainOperator: operator.isMainOperator ? 1 : 0,
          })),
        },
      })
    }
  }
}
