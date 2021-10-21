import { Field, ObjectType } from '@nestjs/graphql'
@ObjectType()
export class OwnerInfoDto {
  @Field()
  fullName!: string
}
