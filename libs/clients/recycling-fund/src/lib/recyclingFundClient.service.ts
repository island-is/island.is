import { Auth, AuthMiddleware, type User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import {
  XRoadApi,
  type CreateXRoadVehicleOwnerDto,
  type XRoadControllerCreateVehicleOwnerRequest,
} from '../../gen/fetch'

@Injectable()
export class RecyclingFundClientService {
  constructor(private readonly api: XRoadApi) {}
  private recyclingFundApiWithAuth = (user: User) =>
    this.api.withMiddleware(new AuthMiddleware(user as Auth))

  healthCheck(user: User): Promise<void> {
    const r = this.recyclingFundApiWithAuth(user).xRoadControllerHealth()
    console.log('HEALTH CHECK RESPONSE-22', r)
    return r
  }

  async createOwner(user: User, applicantName: string): Promise<void> {
    const request: XRoadControllerCreateVehicleOwnerRequest = {
      xRoadClient: 'IS-DEV/GOV/10000/island-is-client',
      createXRoadVehicleOwnerDto: {
        name: applicantName,
      } as CreateXRoadVehicleOwnerDto,
    }

    return this.recyclingFundApiWithAuth(
      {} as User,
    ).xRoadControllerCreateVehicleOwner(request)
  }

  //CreateOwner
  // CreateVehicle
  // RecyclingRequest

  // sendApplication(
  //   user: User,
  //   form: RegistrationApplicationInput,
  // ): Promise<FormSubmitSuccessModel> {
  //   return this.friggApiWithAuth(user).submitForm({
  //     registrationApplicationInput: form,
  //   })
  // }
}
