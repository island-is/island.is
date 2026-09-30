import { Field, ID, Int, ObjectType, registerEnumType } from '@nestjs/graphql'

import { CourtDocumentType } from '@island.is/judicial-system/types'

registerEnumType(CourtDocumentType, {
  name: 'CourtDocumentType',
})

@ObjectType()
export class CourtDocumentResponse {
  @Field(() => ID)
  readonly id!: string

  @Field(() => String)
  readonly created!: string

  @Field(() => String)
  readonly modified!: string

  @Field(() => ID)
  readonly caseId!: string

  @Field(() => ID, { nullable: true })
  readonly courtSessionId?: string

  @Field(() => ID, { nullable: true })
  readonly mergedCourtSessionId?: string

  // Set when the document was copied into this case from a case merged into
  // it, naming that case. The court record groups the copies of each merged
  // case together under their own heading.
  @Field(() => ID, { nullable: true })
  readonly mergedFromCaseId?: string

  @Field(() => CourtDocumentType)
  readonly documentType!: CourtDocumentType

  @Field(() => Int)
  readonly documentOrder!: number

  @Field(() => Int, { nullable: true })
  readonly mergedDocumentOrder?: number

  @Field(() => String)
  readonly name!: string

  @Field(() => String, { nullable: true })
  readonly caseFileId?: string

  @Field(() => String, { nullable: true })
  readonly generatedPdfUri?: string

  @Field(() => String, { nullable: true })
  readonly submittedBy?: string
}
