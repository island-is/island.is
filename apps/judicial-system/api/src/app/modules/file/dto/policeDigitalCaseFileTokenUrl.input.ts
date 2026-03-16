import { Allow } from 'class-validator'

import { Field, ID, InputType } from '@nestjs/graphql'

@InputType()
export class PoliceDigitalCaseFileTokenUrlInput {
  @Allow()
  @Field(() => ID)
  readonly caseId!: string

  @Allow()
  @Field()
  readonly rafraennGagnId!: string
}
