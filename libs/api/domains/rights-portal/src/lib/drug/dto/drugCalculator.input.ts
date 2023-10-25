import { Field, InputType } from '@nestjs/graphql'

@InputType('RightsPortalCalculatorRequest')
export class CalculatorRequest {
  @Field(() => [CalculatorRequestInput], { nullable: true })
  drugs?: CalculatorRequestInput[] | null
}

@InputType('RightsPortalCalculatorRequestInput')
export class CalculatorRequestInput {
  @Field(() => Number, { nullable: true })
  lineNumber?: number

  @Field(() => String, { nullable: true })
  nordicCode?: string | null

  @Field(() => Number, { nullable: true })
  units?: number

  @Field(() => Number, { nullable: true })
  price?: number
}

@InputType('RightsPortalDrugCalculatorInput')
export class DrugCalculatorInput {
  @Field(() => CalculatorRequest)
  drugCalculatorRequestDTO!: CalculatorRequest
}
