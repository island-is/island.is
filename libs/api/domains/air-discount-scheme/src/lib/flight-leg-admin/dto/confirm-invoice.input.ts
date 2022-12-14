import { InputType } from '@nestjs/graphql'

import { FlightLegsInput } from './flight-leg.input'

@InputType('AirDiscountSchemeConfirmInvoiceInput')
export class ConfirmInvoiceInput extends FlightLegsInput {}
