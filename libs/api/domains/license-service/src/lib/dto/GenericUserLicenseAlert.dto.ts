import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'
import { AlertType } from '../licenseService.constants'

registerEnumType(AlertType, { name: 'GenericUserLicenseAlertType' })

@ObjectType()
export class GenericUserLicenseAlert {
  @Field()
  title!: string

  @Field(() => AlertType, { defaultValue: AlertType.WARNING })
  type?: AlertType

  @Field({ nullable: true })
  message?: string
}
