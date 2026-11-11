import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import type {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize'
import {
  Column,
  CreatedAt,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'

import { DeviceRegistrationDto } from './dto/device-registration.dto'

/**
 * One app login: a person's install of a native app, identified by its
 * hardware-bound install key. At most one per person per client.
 */
@Table({
  tableName: 'device_registration',
  indexes: [
    { unique: true, fields: ['national_id', 'client_id'] },
    { unique: true, fields: ['client_id', 'install_key_thumbprint'] },
  ],
})
export class DeviceRegistration extends Model<
  InferAttributes<DeviceRegistration>,
  InferCreationAttributes<DeviceRegistration>
> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, allowNull: false })
  @ApiProperty()
  id!: CreationOptional<string>

  @Column({ type: DataType.STRING, allowNull: false })
  @ApiProperty()
  nationalId!: string

  @Column({ type: DataType.STRING, allowNull: false })
  @ApiProperty()
  userSub!: string

  @Column({ type: DataType.STRING, allowNull: false })
  @ApiProperty()
  clientId!: string

  /** Public JWK of the install key, as JSON. */
  @Column({ type: DataType.TEXT, allowNull: false })
  @ApiProperty()
  installKeyJwk!: string

  @Column({ type: DataType.STRING, allowNull: false })
  @ApiProperty()
  installKeyThumbprint!: string

  /** Public JWK of the biometric key, as JSON. Null when biometric unlock is off. */
  @Column({ type: DataType.TEXT, allowNull: true })
  @ApiPropertyOptional({ nullable: true, type: String })
  biometricKeyJwk!: string | null

  @Column({ type: DataType.STRING, allowNull: true })
  @ApiPropertyOptional({ nullable: true, type: String })
  biometricKeyThumbprint!: string | null

  @Column({ type: DataType.STRING, allowNull: false })
  @ApiProperty()
  platform!: string

  @Column({ type: DataType.STRING, allowNull: true })
  @ApiPropertyOptional({ nullable: true, type: String })
  appAttestKeyId!: string | null

  /** The App Attest key's SubjectPublicKeyInfo, base64. */
  @Column({ type: DataType.TEXT, allowNull: true })
  @ApiPropertyOptional({ nullable: true, type: String })
  appAttestPublicKey!: string | null

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
    get() {
      const value = this.getDataValue('appAttestCounter')
      return value === null || value === undefined ? null : Number(value)
    },
  })
  @ApiPropertyOptional({ nullable: true, type: Number })
  appAttestCounter!: number | null

  @Column({ type: DataType.STRING, allowNull: true })
  @ApiPropertyOptional({ nullable: true, type: String })
  deviceName!: string | null

  /** How the person logged in, e.g. audkenni_sim. Unlock and step-up use the same method. */
  @Column({ type: DataType.STRING, allowNull: false })
  @ApiProperty()
  loginIdp!: string

  /** SIM logins: the number logged in with. Electronic ID unlocks go there. */
  @Column({ type: DataType.STRING, allowNull: true })
  @ApiPropertyOptional({ nullable: true, type: String })
  audkenniSimNumber!: string | null

  /** Attested as a development build, so it stops working where those aren't allowed. */
  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  @ApiProperty()
  developmentBuild!: boolean

  @Column({ type: DataType.DATE, allowNull: false })
  @ApiProperty()
  lastUsed!: Date

  @CreatedAt
  @ApiProperty()
  readonly created!: CreationOptional<Date>

  @UpdatedAt
  readonly modified?: CreationOptional<Date>

  toDto(): DeviceRegistrationDto {
    return {
      id: this.id,
      nationalId: this.nationalId,
      userSub: this.userSub,
      clientId: this.clientId,
      installKeyJwk: this.installKeyJwk,
      installKeyThumbprint: this.installKeyThumbprint,
      biometricKeyJwk: this.biometricKeyJwk,
      biometricKeyThumbprint: this.biometricKeyThumbprint,
      platform: this.platform,
      appAttestKeyId: this.appAttestKeyId,
      appAttestPublicKey: this.appAttestPublicKey,
      appAttestCounter: this.appAttestCounter,
      deviceName: this.deviceName,
      loginIdp: this.loginIdp,
      audkenniSimNumber: this.audkenniSimNumber,
      developmentBuild: this.developmentBuild,
      lastUsed: this.lastUsed,
      created: this.created,
    }
  }
}
