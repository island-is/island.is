import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import { PermitApplicationApi } from '../../gen/fetch/apis'
import {
  ExemptionRules,
  ExemptionValidation,
} from './exemptionForTransportationClient.types'

@Injectable()
export class ExemptionForTransportationClient {
  constructor(private readonly permitApplicationApi: PermitApplicationApi) {}

  private permitApplicationApiWithAuth(auth: Auth) {
    return this.permitApplicationApi.withMiddleware(new AuthMiddleware(auth))
  }

  public async getRules(): Promise<ExemptionRules> {
    const result = await this.permitApplicationApi.applicationsRulesGet({
      apiVersion: '1.0',
      apiVersion2: '1.0',
    })

    return {
      policeEscort: {
        maxHeight: result.policeEscort?.height || 0,
        maxWidth: result.policeEscort?.width || 0,
        maxLength: result.policeEscort?.length || 0,
      },
      shortTermMeasurementLimitations: {
        maxHeight: result.measurementLimitations?.maxHeight || 0,
        maxWidth: result.measurementLimitations?.maxWidth || 0,
        maxLength: result.measurementLimitations?.maxLength || 0,
        maxWeight: result.measurementLimitations?.maxWeight || 0,
        maxTotalLength:
          result.measurementLimitations?.maxCombinedLengthOfVehicles || 0,
      },
      longTermMeasurementLimitations: {
        maxHeight: result.longTermMeasurementLimitations?.maxHeight || 0,
        maxWidth: result.longTermMeasurementLimitations?.maxWidth || 0,
        maxLength: result.longTermMeasurementLimitations?.maxLength || 0,
        maxWeight: result.longTermMeasurementLimitations?.maxWeight || 0,
        maxTotalLength:
          result.longTermMeasurementLimitations?.maxCombinedLengthOfVehicles ||
          0,
      },
    }
  }

  public async validateForExemption(
    auth: User,
    permno: string,
    shouldBeTrailer: boolean,
  ): Promise<ExemptionValidation> {
    try {
      const result = await this.permitApplicationApiWithAuth(
        auth,
      ).applicationsVehiclesPermnoStatusGet({
        apiVersion: '1.0',
        apiVersion2: '1.0',
        permno,
        shouldBeTrailer,
      })
      return {
        isInspected: true, //TODOx is always false ??? result.inspected || false,
        isInOrder: result.isInOrder || false,
        errorMessages: [],
      }
    } catch (e) {
      if (e?.body?.detail && typeof e.body.detail === 'string') {
        return {
          isInspected: true,
          isInOrder: true,
          errorMessages: [{ defaultMessage: e.body.detail }],
        }
      } else {
        throw e
      }
    }
  }

  public async submitApplication() {
    // TODO
  }
}
