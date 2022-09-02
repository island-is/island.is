import { Field, ObjectType } from '@nestjs/graphql'
import { IslykillErrorResult } from './islykillErrorResult.model'

@ObjectType()
export class CreateIslykillSettings {
  @Field(() => String)
  nationalId!: string

  @Field(() => String)
  valid!: boolean

  @Field(() => IslykillErrorResult, { nullable: true })
  error?: IslykillErrorResult
}
