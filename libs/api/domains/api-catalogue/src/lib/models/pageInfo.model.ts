import { IsString } from 'class-validator'
import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class PageInfo {
  @Field(() => String, { nullable: true })
  @IsString()
  nextCursor!: string | null
}
