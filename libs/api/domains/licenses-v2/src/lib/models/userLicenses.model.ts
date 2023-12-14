import { Field, ObjectType } from '@nestjs/graphql'
import { License } from './license.model'

@ObjectType('LicensesResponse')
export class Response {
  @Field({ description: 'National ID of license owner' })
  nationalId!: string

  @Field(() => [License])
  licenses!: Array<License>

  @Field(() => GenericLicenseFetch, { description: 'Info about license fetch' })
  fetch!: GenericLicenseFetch

  @Field(() => Payload, {
    nullable: true,
    description: 'Potential payload of license, both parsed and raw',
  })
  payload?: Payload
}
