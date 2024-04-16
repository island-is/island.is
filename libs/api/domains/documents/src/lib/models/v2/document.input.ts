import { InputType, Field } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType('DocumentInput')
export class DocumentInput {
  @Field()
  @IsString()
  readonly id!: string

  @Field({ defaultValue: 10 })
  readonly pageSize!: number
}
