import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'

import { Payload } from './payload.model'

import {
  GenericLicenseType,
  GenericUserLicenseStatus,
  GenericUserLicenseFetchStatus,
  GenericLicenseProviderId,
  GenericUserLicensePkPassStatus,
} from '../licenceService.type'

registerEnumType(GenericLicenseType, {
  name: 'GenericLicenseType',
  description: 'Exhaustive list of license types',
})

registerEnumType(GenericLicenseProviderId, {
  name: 'GenericLicenseProviderId',
  description: 'Exhaustive list of license provider IDs',
})

registerEnumType(GenericUserLicenseStatus, {
  name: 'GenericUserLicenseStatus',
  description: 'Possible license statuses for user',
})

registerEnumType(GenericUserLicenseFetchStatus, {
  name: 'GenericUserLicenseFetchStatus',
  description: 'Possible license fetch statuses',
})

registerEnumType(GenericUserLicensePkPassStatus, {
  name: 'GenericUserLicensePkPassStatus',
  description: 'Possible license pkpass statuses',
})

@ObjectType()
export class GenericLicenseProvider {
  @Field(() => GenericLicenseProviderId, {
    description: 'ID of license provider',
  })
  id!: GenericLicenseProviderId
}

@ObjectType()
export class GenericUserLicenseMetaLinks {
  @Field(() => String, { nullable: true })
  label?: string

  @Field(() => String)
  value?: string
}
@ObjectType()
export class GenericUserLicenseMetadata {
  @Field(() => [GenericUserLicenseMetaLinks], { nullable: true })
  links?: Array<GenericUserLicenseMetaLinks>

  @Field(() => String)
  licenseNumber?: string

  @Field(() => Boolean, { nullable: true })
  expired?: boolean | null

  @Field(() => String, { nullable: true })
  expireDate?: string | null

  @Field(() => String)
  title?: string

  @Field(() => String)
  logo?: string
}

@ObjectType()
export class GenericLicense {
  @Field(() => GenericLicenseType, {
    description: 'Type of license from an exhaustive list',
  })
  type!: GenericLicenseType

  @Field(() => GenericLicenseProvider, {
    description: 'Provider of the license',
  })
  provider!: GenericLicenseProvider

  @Field({ description: 'Display name of license' })
  name?: string

  @Field({ description: 'Does the license support pkpass?' })
  pkpass!: boolean

  @Field({ description: 'Does the license support verification of pkpass?' })
  pkpassVerify!: boolean

  @Field({
    description:
      'How long the data about the license should be treated as fresh',
  })
  timeout!: number

  @Field(() => GenericUserLicenseStatus, { description: 'Status of license' })
  status!: GenericUserLicenseStatus

  @Field(() => GenericUserLicensePkPassStatus, {
    description: 'Status of pkpass availablity of license',
  })
  pkpassStatus!: GenericUserLicensePkPassStatus
}

@ObjectType()
export class GenericLicenseFetch {
  @Field(() => GenericUserLicenseFetchStatus, {
    description: 'Status of license fetch',
  })
  status!: GenericUserLicenseFetchStatus

  @Field({ description: 'Datetime of last update of fetch status' })
  updated!: string
}

@ObjectType()
export class GenericUserLicense {
  @Field({ description: 'National ID of license owner' })
  nationalId!: string

  @Field(() => GenericLicense, { description: 'License info' })
  license!: GenericLicense

  @Field(() => GenericLicenseFetch, { description: 'Info about license fetch' })
  fetch!: GenericLicenseFetch

  @Field(() => Payload, {
    nullable: true,
    description: 'Potential payload of license, both parsed and raw',
  })
  payload?: Payload
}

@ObjectType()
export class GenericPkPass {
  @Field(() => String)
  pkpassUrl!: string
}

@ObjectType()
export class GenericPkPassQrCode {
  @Field(() => String)
  pkpassQRCode!: string
}

@ObjectType()
export class GenericPkPassVerificationError {
  @Field(() => String, {
    nullable: true,
    description:
      'pkpass verification error code, depandant on origination service, "0" for unknown error',
  })
  status?: string

  @Field(() => String, {
    nullable: true,
    description:
      'pkpass verification error message, depandant on origination service',
  })
  message?: string

  @Field(() => String, {
    nullable: true,
    description: 'Optional data related to the error',
  })
  data?: string
}

@ObjectType()
export class GenericPkPassVerification {
  @Field(() => String, {
    nullable: true,
    description: 'Optional data related to the pkpass verification',
  })
  data?: string

  @Field(() => GenericPkPassVerificationError, {
    nullable: true,
    description: 'Optional error related to the pkpass verification',
  })
  error?: GenericPkPassVerificationError

  @Field({ description: 'Is the pkpass valid?' })
  valid!: boolean
}
