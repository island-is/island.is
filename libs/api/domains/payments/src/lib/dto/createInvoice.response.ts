import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('PaymentsCreateInvoiceResponse')
export class CreateInvoiceResponse {
  @Field(() => Boolean, {
    description: 'Indicates if invoice creation was successful',
  })
  isSuccess!: boolean

  @Field(() => String, {
    description: 'Code of what went wrong',
    nullable: true,
  })
  responseCode?: string

  @Field(() => String, { description: 'Unique id for the event' })
  correlationId!: string
}
