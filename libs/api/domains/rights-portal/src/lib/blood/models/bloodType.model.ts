import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('RightsPortalBloodType')
export class BloodType {
  @Field()
  type!: string

  @Field({ nullable: true })
  registered?: string

  @Field({ nullable: true })
  description?: string

  @Field({ nullable: true })
  link?: string
}
