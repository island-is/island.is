import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class VistaSkjalModel {
  @Field(() => Boolean)
  isSucceeded!: boolean

  @Field(() => Number)
  caseId?: number

  @Field(() => String)
  comment?: string
}
