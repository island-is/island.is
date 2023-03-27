import { Field, ObjectType } from '@nestjs/graphql'
import { Environment } from 'environment'

@ObjectType('AuthAdminCreateApplicationResponseDto')
export class CreateApplicationResponseDto {
  @Field(() => String, { nullable: false })
  applicationId!: string

  @Field(() => Environment, { nullable: false })
  environment!: Environment
}
