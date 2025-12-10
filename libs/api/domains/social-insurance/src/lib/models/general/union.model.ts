import { Field, ObjectType } from '@nestjs/graphql'
import { IsNotEmpty, IsString } from 'class-validator'

@ObjectType('SocialInsuranceGeneralUnion')
export class Union {
  @Field()
  @IsNotEmpty()
  @IsString()
  nationalId!: string

  @Field()
  @IsNotEmpty()
  @IsString()
  name!: string
}
