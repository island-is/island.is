import { InputType } from '@nestjs/graphql'

import { FlightLegsInput } from '.'

@InputType()
export class ConfirmInvoiceInput extends FlightLegsInput {}
