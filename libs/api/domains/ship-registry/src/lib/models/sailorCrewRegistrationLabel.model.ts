import { Field, ObjectType } from '@nestjs/graphql'
import { ShipRegistrySailorCrewRegistrationField } from './enums'

@ObjectType()
export class ShipRegistrySailorCrewRegistrationLabel {
  @Field(() => ShipRegistrySailorCrewRegistrationField)
  entryField!: ShipRegistrySailorCrewRegistrationField

  @Field()
  label!: string
}
