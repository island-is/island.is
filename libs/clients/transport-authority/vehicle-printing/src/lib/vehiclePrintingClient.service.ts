import { Injectable } from '@nestjs/common'
import { RegistrationApi } from '../../gen/fetch/apis'

@Injectable()
export class VehiclePrintingClient {
  constructor(private readonly registrationApi: RegistrationApi) {}

  public async RequestRegistrationCardPrint(permno: string): Promise<void> {
    await this.registrationApi.registrationRequestregistrationcardprintPost({
      permno: permno,
    })
  }
}
