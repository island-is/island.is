import { IsString } from 'class-validator'
import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class GetRegistryPersonInput {
  @Field({ nullable: true })
  @IsString()
  nationalId!: string
}
