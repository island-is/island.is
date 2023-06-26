import { Field, ObjectType, ID } from '@nestjs/graphql'

@ObjectType()
export class DiplomaModel {
  @Field(() => [DiplomaItems], { nullable: true })
  items?: Array<DiplomaItems>
}

@ObjectType()
export class DiplomaItems {
  @Field(() => String, { nullable: true })
  diplomaDate?: string

  @Field(() => String, { nullable: true })
  diplomaId?: number

  @Field(() => String, { nullable: true })
  diplomaName?: string

  @Field(() => String, { nullable: true })
  organisation?: string

  @Field(() => String, { nullable: true })
  organisationShort?: string
}
