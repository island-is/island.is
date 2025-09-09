import { Field, ID, Int, ObjectType, registerEnumType } from '@nestjs/graphql'

import { CourtSessionDocumentType } from '@island.is/judicial-system/types'

registerEnumType(CourtSessionDocumentType, {
  name: 'CourtSessionDocumentType',
})

@ObjectType()
export class CourtSessionDocumentResponse {
  @Field(() => ID)
  readonly id!: string

  @Field(() => String)
  readonly created!: string

  @Field(() => String)
  readonly modified!: string

  @Field(() => ID)
  readonly caseId!: string

  @Field(() => ID)
  readonly courtSessionId!: string

  @Field(() => CourtSessionDocumentType)
  readonly documentType!: CourtSessionDocumentType

  @Field(() => Int)
  readonly documentOrder!: number

  @Field(() => String)
  readonly name!: string

  @Field(() => String, { nullable: true })
  readonly caseFileId?: string

  @Field(() => String, { nullable: true })
  readonly generatedPdfUri?: string
}
