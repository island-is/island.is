import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class VistaSkjalModel {
  @Field(() => Boolean)
  isSucceeded!: boolean

  @Field(() => Number, { nullable: true })
  caseId?: number

  @Field(() => String, { nullable: true })
  comment?: string
}
