import { Injectable } from '@nestjs/common/decorators/core'
import { lastValueFrom } from 'rxjs'
import { HttpService } from '@nestjs/axios/dist'
import { environment } from '../../environments'
import { logger } from '@island.is/logging'
import { VehicleModel, VehicleService } from '../modules/vehicle'
import { VehicleOwnerModel } from '../modules/vehicleOwner'
import { VehicleOwnerService } from '../modules/vehicleOwner/vehicleOwner.service'

@Injectable()
export class IcelandicTransportAuthorityServices {
  constructor(
    private http: HttpService,
    private vehicleService: VehicleService,
    private ownerService: VehicleOwnerService,
  ) {}

  // Hack to re-use the url from the secret
  private getInformationURL(restURL: string): string {
    const restInformationURL = restURL.replace(
      '/registrations/',
      '/information/',
    )
    const positionOfChar = restInformationURL.lastIndexOf('/')
    return restInformationURL.substring(0, positionOfChar) + '/'
  }

  async authenticate(authURL: string, userName: string, password: string) {
    try {
      const jsonObj = {
        username: userName,
        password: password,
      }
      const jsonAuthBody = JSON.stringify(jsonObj)

      const headerAuthRequest = {
        'Content-Type': 'application/json',
      }

      const authRes = await lastValueFrom(
        this.http.post(
          this.getInformationURL(authURL) + 'authenticate',
          jsonAuthBody,
          {
            headers: headerAuthRequest,
          },
        ),
      )

      if (authRes.status > 299 || authRes.status < 200) {
        const errorMessage = `Authentication failed: ${authRes.statusText}`
        logger.error(`car-recycling: ${errorMessage}`)
        throw new Error(errorMessage)
      }

      return authRes.data['jwtToken']
    } catch (error) {
      logger.error('car-recycling: Authentication failed', error)
      throw error
    }
  }

  async doGet(
    restURL: string,
    queryParams: { [key: string]: string } | undefined,
  ) {
    const { restAuthUrl, restUsername, restPassword } =
      environment.samgongustofa

    const jwtToken = await this.authenticate(
      restAuthUrl,
      restUsername,
      restPassword,
    )

    let fullUrl = restURL

    if (queryParams) {
      const searchParams = new URLSearchParams(queryParams)

      // Concatenate the URL with the query string
      fullUrl = `${restURL}?${searchParams.toString()}`
    }

    const headers = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + jwtToken,
    }

    const result = await lastValueFrom(
      this.http.get(fullUrl, {
        headers: headers,
      }),
    )

    if (result.status < 300 && result.status >= 200) {
      return result
    } else {
      throw new Error(
        `car-recycling: Failed on doGet with status: ${result.statusText}`,
      )
    }
  }

  // Get the Vehicle information from Icelandic Transport Authority (Samgöngustofa)
  async getVehicleInformation(permno: string) {
    try {
      const { restDeRegUrl } = environment.samgongustofa

      return this.doGet(
        this.getInformationURL(restDeRegUrl) +
          'vehicleinformationmini/' +
          permno,
        undefined,
      )
    } catch (err) {
      throw new Error(
        `car-recycling: Failed on getVehicleInformation vehicle ${permno.slice(
          -3,
        )} because: ${err}`,
      )
    }
  }

  async checkIfCurrentUser(permno: string): Promise<boolean> {
    //Get the latest vehicle information from Samgongustofa
    const result = await this.getVehicleInformation(permno)

    if (result && result.data) {
      const ownerSocialSecurityNumber = result.data.ownerSocialSecurityNumber

      if (!ownerSocialSecurityNumber) {
        logger.error(
          `car-recycling: Didnt find the current owner in the vehicleinformationmini ${permno.slice(
            -3,
          )}`,
        )
        throw new Error(
          'car-recycling: Didnt find the current owner in the vehicleinformationmini',
        )
      }

      // If current owner hasn't sent in an car-recycling application, then he is not registered in Vehicle_Owner and therefore he needs to be registered.
      const owner = new VehicleOwnerModel()
      owner.nationalId = ownerSocialSecurityNumber
      owner.personname = ownerSocialSecurityNumber //Samgongustofa REST endpoint doesn't have owner name

      const isOwner = await this.ownerService.create(owner)

      // If the owner has been found or created in the database, then we can update the vehicle owner if needed
      if (isOwner) {
        const vehicle = new VehicleModel()
        vehicle.vehicleId = permno

        vehicle.ownerNationalId = owner.nationalId

        await this.vehicleService.create(vehicle)
      }
      return true
    }

    logger.error(
      `car-recycling: Failed to get current owner info in checkIfCurrentUser when deregistering vehicle  ${permno.slice(
        -3,
      )}`,
    )

    throw new Error(
      'car-recycling: Failed to get current owner info in checkIfCurrentUser when deregistering vehicle',
    )
  }
}
