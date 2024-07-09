import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'
import { AlertType } from '../licenceService.type'

registerEnumType(AlertType, {
  name: 'GenericUserLicenseAlertType',
})

@ObjectType('GenericUserLicenseAlert')
export class GenericUserLicenseAlert {
  @Field()
  title!: string

  @Field(() => AlertType, { defaultValue: AlertType.WARNING })
  type?: AlertType

  @Field({ nullable: true })
  message?: string
}
