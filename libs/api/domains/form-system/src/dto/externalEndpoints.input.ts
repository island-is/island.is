import { Field, Int, InputType, registerEnumType, ID } from '@nestjs/graphql'
import {
  EExternalEndpointType,
  EExternalEndpointEnvironment,
} from '@island.is/clients/form-system'

registerEnumType(EExternalEndpointType, {
  name: 'FormSystemExternalEndpointType',
})

registerEnumType(EExternalEndpointEnvironment, {
  name: 'FormSystemExternalEndpointEnvironment',
})

@InputType('FormSystemExternalEndpointsInput')
export class ExternalEndpointsInput {
  @Field(() => Int, { nullable: true })
  id?: number

  @Field(() => String, { nullable: true })
  url?: string | null

  @Field(() => EExternalEndpointType, { nullable: true })
  type?: EExternalEndpointType

  @Field(() => EExternalEndpointEnvironment, { nullable: true })
  environment?: EExternalEndpointEnvironment

  @Field(() => ID, { nullable: true })
  guid?: string
}
