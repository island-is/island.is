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

  async doGet(restURL: string, queryParams: { [key: string]: string }) {
    const { restAuthUrl, restUsername, restPassword } =
      environment.samgongustofa

    const jwtToken = await this.authenticate(
      restAuthUrl,
      restUsername,
      restPassword,
    )

    // Convert the query parameters to a query string
    const queryString = Object.entries(queryParams)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
      )
      .join('&')

    // Concatenate the URL with the query string
    const fullUrl = `${restURL}?${queryString}`

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

      const queryParams = {
        permno,
      }

      return this.doGet(
        this.getInformationURL(restDeRegUrl) + 'basic',
        queryParams,
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
    const result = await this.getVehicleInformation(permno)

    if (result && result.data) {
      const currentOwnerInfo = result.data.owners.find((owner) => {
        return owner.current
      })

      // If current owner hasn't sent in an car-recycling application, then he is not registered in Vehicle_Owner and therefore he needs to be registered.
      const owner = new VehicleOwnerModel()
      owner.nationalId = currentOwnerInfo.persidno
      owner.personname = currentOwnerInfo.fullname

      const isOwner = await this.ownerService.create(owner)

      // If the owner has been found or created in the database, then we can create the vehicle
      if (isOwner) {
        const vehicle = new VehicleModel()
        vehicle.vehicleId = permno

        vehicle.ownerNationalId = owner.nationalId

        await this.vehicleService.create(vehicle)
      }
      return true
    }
    throw new Error(
      'car-recycling: Failed to get current owner info in checkIfCurrentUser when deregistering vehicle',
    )
  }
}
