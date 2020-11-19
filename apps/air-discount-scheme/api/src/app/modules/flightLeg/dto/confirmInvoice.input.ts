import { InputType } from '@nestjs/graphql'

import { FlightLegsInput } from './flightLeg.input'

@InputType()
export class ConfirmInvoiceInput extends FlightLegsInput {}
