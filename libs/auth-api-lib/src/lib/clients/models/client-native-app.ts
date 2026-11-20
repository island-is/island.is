import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class ClientNativeAppRequirements {
  /** Android: the lowest keystore level accepted. */
  @ApiProperty({ enum: ['Software', 'TrustedEnvironment', 'StrongBox'] })
  androidMinimumSecurityLevel!: 'Software' | 'TrustedEnvironment' | 'StrongBox'

  /** Android: refuse devices without verified boot and a locked bootloader. */
  @ApiProperty()
  androidRequireVerifiedBoot!: boolean

  /** Android: the biometric key must need a biometric on every use. */
  @ApiProperty()
  androidRequireBiometricOnlyKey!: boolean
}

export class ClientNativeAppAppleIdentity {
  @ApiProperty()
  teamId!: string

  @ApiProperty()
  bundleId!: string

  /** Accept App Attest's development environment, i.e. builds installed from Xcode. */
  @ApiPropertyOptional()
  allowDevelopmentEnvironment?: boolean

  /** Accepted only where IdentityServer allows development builds. */
  @ApiPropertyOptional()
  developmentBuild?: boolean
}

export class ClientNativeAppAndroidIdentity {
  @ApiProperty()
  packageName!: string

  /** SHA-256 digests of the certificates the app is signed with. */
  @ApiProperty({ type: [String] })
  signingCertificateDigests!: string[]

  /** Accepted only where IdentityServer allows development builds. */
  @ApiPropertyOptional()
  developmentBuild?: boolean
}

/**
 * What IdentityServer needs to accept a native app as this client: the builds
 * that may authenticate as it and what it demands of a device.
 */
export class ClientNativeApp {
  /** An app login not used for this many days no longer unlocks the app. */
  @ApiProperty()
  registrationIdleLifetimeInDays!: number

  @ApiProperty({ type: ClientNativeAppRequirements })
  requirements!: ClientNativeAppRequirements

  @ApiProperty({ type: [ClientNativeAppAppleIdentity] })
  apple!: ClientNativeAppAppleIdentity[]

  @ApiProperty({ type: [ClientNativeAppAndroidIdentity] })
  android!: ClientNativeAppAndroidIdentity[]
}
