import { Field, InputType } from '@nestjs/graphql'
import { ShipRegistrySailorCertificateStatus } from '../models/enums'

@InputType('ShipRegistrySailorsInput')
export class SailorsInput {
  @Field({ nullable: true })
  filterByStatus?: Array<ShipRegistrySailorCertificateStatus>
}
