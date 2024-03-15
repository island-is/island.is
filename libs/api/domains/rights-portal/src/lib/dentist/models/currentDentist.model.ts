import { ObjectType, Field, ID } from '@nestjs/graphql'

@ObjectType('RightsPortalCurrentDentist')
export class CurrentDentist {
  @Field(() => ID)
  id!: number

  @Field(() => String, { nullable: true })
  name?: string | null
}
