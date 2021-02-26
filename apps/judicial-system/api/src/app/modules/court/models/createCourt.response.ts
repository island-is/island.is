import { Field, ObjectType } from '@nestjs/graphql'

import { CreateCustodyCourtCaseResponse as TCreateCustodyCourtCaseResponse } from '@island.is/judicial-system/types'

@ObjectType()
export class CreateCustodyCourtCaseResponse
  implements TCreateCustodyCourtCaseResponse {
  @Field()
  courtCaseNumber!: string
}
