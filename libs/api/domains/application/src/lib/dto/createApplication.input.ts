import { Field, InputType, registerEnumType } from '@nestjs/graphql'
import { IsEnum, IsOptional, IsString } from 'class-validator'
import { CreateApplicationDtoTypeIdEnum } from '../../../gen/fetch'

registerEnumType(CreateApplicationDtoTypeIdEnum, {
  name: 'CreateApplicationDtoTypeIdEnum',
})

@InputType()
export class CreateApplicationInput {
  @Field(() => CreateApplicationDtoTypeIdEnum)
  @IsEnum(CreateApplicationDtoTypeIdEnum)
  typeId!: CreateApplicationDtoTypeIdEnum

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  initialQuery?: string
}
