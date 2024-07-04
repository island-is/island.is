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
    return await this.validateAllForOperatorChange(auth, permno, null)
  }

  public async validateAllForOperatorChange(
    auth: User,
    permno: string,
    operators: Operator[] | null,
    mileage?: number | null,
  ): Promise<OperatorChangeValidation> {
    let errorList: ReturnTypeMessage[] | undefined

    // In case we dont have the operators selected yet,
    // then we will send in the owner as operator
    // Note: it is not possible to validate application if operators array is empty
    // (even though that is what we might want to do)
    if (!operators || operators.length === 0) {
      operators = [{ ssn: auth.nationalId, isMainOperator: true }]
    }

    try {
      await this.operatorsApiWithAuth(auth).withoutcontractPost({
        apiVersion: '3.0',
        apiVersion2: '3.0',
        postOperatorsWithoutContractModel: {
          permno: permno,
          startDate: new Date(),
          reportingPersonIdNumber: auth.nationalId,
          mileage: mileage,
          operators: operators.map((operator) => ({
            personIdNumber: operator.ssn || '',
            mainOperator: operator.isMainOperator ? 1 : 0,
          })),
          onlyRunFlexibleWarning: true, // to make sure we are only validating
        },
      })
    } catch (e) {
      // Note: We need to wrap in try-catch to get the error messages, because if this action results in error,
      // we get 4xx error (instead of 200 with error messages) with the errorList in this field
      // ("body.Errors" for input validation, and "body" for data validation (in database)),
      // that is of the same class as 200 result schema
      if (e?.body?.Errors && Array.isArray(e.body.Errors)) {
        errorList = e.body.Errors as ReturnTypeMessage[]
      } else if (e?.body && Array.isArray(e.body)) {
        errorList = e.body as ReturnTypeMessage[]
      } else {
        throw e
      }
    }

    const warnSeverityError = 'E'
    const warnSeverityLock = 'L'
    errorList = errorList?.filter(
      (x) =>
        x.errorMess &&
        (x.warnSever === warnSeverityError || x.warnSever === warnSeverityLock),
    )

    return {
      hasError: !!errorList?.length,
      errorMessages: errorList?.map((item) => {
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
    mileage?: number | null,
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
          mileage: mileage,
          operators: operators.map((operator) => ({
            personIdNumber: operator.ssn || '',
            mainOperator: operator.isMainOperator ? 1 : 0,
          })),
        },
      })
    }
  }
}
