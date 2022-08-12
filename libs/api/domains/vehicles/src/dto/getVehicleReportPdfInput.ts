import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class GetVehicleReportPdfInput {
  @Field()
  permno!: string
}
