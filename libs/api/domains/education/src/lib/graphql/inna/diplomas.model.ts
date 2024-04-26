import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class DiplomaModel {
  @Field(() => [DiplomaItems], { nullable: true })
  items?: Array<DiplomaItems>
}

@ObjectType()
export class DiplomaItems {
  @Field(() => String, { nullable: true })
  diplomaDate?: string

  @Field(() => Number, { nullable: true })
  diplomaId?: number

  @Field(() => String, { nullable: true })
  diplomaName?: string

  @Field(() => String, { nullable: true })
  diplomaLongName?: string

  @Field(() => String, { nullable: true })
  diplomaCode?: string

  @Field(() => Number, { nullable: true })
  diplomaCreditsTotal?: number

  @Field(() => Number, { nullable: true })
  diplomaCredits?: number

  @Field(() => String, { nullable: true })
  organisation?: string

  @Field(() => Number, { nullable: true })
  organisationId?: number

  @Field(() => String, { nullable: true })
  organisationShort?: string
}
