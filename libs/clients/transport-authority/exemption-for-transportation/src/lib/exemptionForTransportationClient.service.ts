import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import { PermitApplicationApi } from '../../gen/fetch/apis'
import {
  ExemptionApplicationValidation,
  ExemptionRules,
  ExemptionVehicleValidation,
} from './exemptionForTransportationClient.types'
import { RouteApplicationAddModel } from '../../gen/fetch'
import { logger } from '@island.is/logging'
import { getErrorMessagesFromTryCatch } from './exemptionForTransportationClient.utils'

@Injectable()
export class ExemptionForTransportationClient {
  constructor(private readonly permitApplicationApi: PermitApplicationApi) {}

  private permitApplicationApiWithAuth(auth: Auth) {
    return this.permitApplicationApi.withMiddleware(new AuthMiddleware(auth))
  }

  public async getRules(auth: User): Promise<ExemptionRules> {
    const result = await this.permitApplicationApiWithAuth(
      auth,
    ).applicationsRulesGet({
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
  ): Promise<ExemptionVehicleValidation> {
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
        isInspected: result.inspected || false,
        isInOrder: result.isInOrder || false,
        errorMessages: [],
      }
    } catch (e) {
      if (e?.body?.detail && typeof e.body.detail === 'string') {
        return {
          isInspected: true,
          isInOrder: true,
          errorMessages: [
            { errorNo: e.body.title, defaultMessage: e.body.detail },
          ],
        }
      } else {
        throw e
      }
    }
  }

  public async submitApplication(
    auth: User,
    application: RouteApplicationAddModel,
  ): Promise<ExemptionApplicationValidation> {
    try {
      await this.permitApplicationApiWithAuth(auth).applicationsRoutePost({
        apiVersion: '1.0',
        apiVersion2: '1.0',
        routeApplicationAddModel: application,
      })
      return { hasError: false }
    } catch (e) {
      logger.error(`Failed to submit application for exemption: ${e.message}`)
      const errorMessages = getErrorMessagesFromTryCatch(e)
      return { hasError: true, errorMessages }
    }
  }
}
