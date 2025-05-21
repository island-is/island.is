import { Field, ObjectType } from '@nestjs/graphql'
import { Waitlist } from './waitlists.model'

@ObjectType('HealthDirectorateWaitlistDetail')
export class WaitlistDetail {
  @Field(() => Waitlist, { nullable: true })
  data?: Waitlist
}
