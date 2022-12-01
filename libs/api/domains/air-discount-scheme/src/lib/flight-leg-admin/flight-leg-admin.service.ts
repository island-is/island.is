import { Injectable } from '@nestjs/common'
import { AdminApi, FlightLeg } from '@island.is/clients/air-discount-scheme'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { FlightLegsInput } from './dto/flight-leg.input'
import { ConfirmInvoiceInput } from './dto/confirm-invoice.input'

@Injectable()
export class FlightLegAdminService {
  constructor(private adsAdminApi: AdminApi) {}

  private adsAdminApiWithAuth(auth: Auth) {
    return this.adsAdminApi.withMiddleware(new AuthMiddleware(auth))
  }

  flightLegs(user: User, input: FlightLegsInput): Promise<FlightLeg[]> {
    return this.adsAdminApiWithAuth(user).privateFlightControllerGetFlightLegs({
      getFlightLegsBody: input,
    })
  }

  confirmInvoice(user: User, input: ConfirmInvoiceInput): Promise<FlightLeg[]> {
    return this.adsAdminApiWithAuth(user).privateFlightControllerConfirmInvoice(
      {
        confirmInvoiceBody: input,
      },
    )
  }
}
