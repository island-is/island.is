import { Field, ObjectType } from '@nestjs/graphql'

import { CaseType } from '@island.is/judicial-system/types'

@ObjectType()
class SearchCasesRow {
  @Field(() => String, { description: 'The case id' })
  readonly caseId!: string

  @Field(() => CaseType, { description: 'The case type' })
  readonly caseType!: CaseType

  @Field(() => String, { description: 'The matched field' })
  readonly matchedField!: string

  @Field(() => String, { description: 'The matched value' })
  readonly matchedValue!: string

  @Field(() => [String], { description: 'The police case numbers' })
  readonly policeCaseNumbers!: string[]

  @Field(() => String, { description: 'The court case number', nullable: true })
  readonly courtCaseNumber!: string | null

  @Field(() => String, {
    description: 'The appeal case number',
    nullable: true,
  })
  readonly appealCaseNumber!: string | null

  @Field(() => String, {
    description: 'The defendant national id',
    nullable: true,
  })
  readonly defendantNationalId!: string | null

  @Field(() => String, { description: 'The defendant name', nullable: true })
  readonly defendantName!: string | null
}

@ObjectType()
export class SearchCasesResponse {
  @Field(() => Number, { description: 'The total number of search results' })
  readonly rowCount!: number

  @Field(() => [SearchCasesRow], { description: 'The search results' })
  readonly rows!: SearchCasesRow[]
}
