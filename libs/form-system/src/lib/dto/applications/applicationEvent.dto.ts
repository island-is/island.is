import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { ApiPropertyOptional } from '@nestjs/swagger'

@ObjectType('FormSystemApplicationEvent')
@InputType('FormSystemApplicationEventInput')
export class ApplicationEventDto {
  @ApiPropertyOptional({ type: Date })
  @Field(() => Date, { nullable: true })
  created?: Date

  @ApiPropertyOptional()
  @Field(() => String, { nullable: true })
  eventType?: string

  @ApiPropertyOptional()
  @Field(() => Boolean, { nullable: true })
  isFileEvent?: boolean
}
