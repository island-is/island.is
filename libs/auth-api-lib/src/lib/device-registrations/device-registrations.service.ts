import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Op } from 'sequelize'

import { DeviceRegistration } from './device-registration.model'
import {
  DeviceRegistrationDto,
  SaveDeviceRegistrationDto,
  UpdateDeviceRegistrationDto,
} from './dto/device-registration.dto'

@Injectable()
export class DeviceRegistrationsService {
  constructor(
    @InjectModel(DeviceRegistration)
    private readonly deviceRegistrationModel: typeof DeviceRegistration,
  ) {}

  async findByInstallKey(
    clientId: string,
    installKeyThumbprint: string,
  ): Promise<DeviceRegistrationDto | null> {
    const registration = await this.deviceRegistrationModel.findOne({
      where: { clientId, installKeyThumbprint },
    })

    return registration?.toDto() ?? null
  }

  /**
   * Creates or replaces the person's registration for the client: one app
   * login per person. A login on another install replaces the old one, and an
   * install key can only belong to one person.
   */
  async save(input: SaveDeviceRegistrationDto): Promise<DeviceRegistrationDto> {
    return this.deviceRegistrationModel.sequelize!.transaction(
      async (transaction) => {
        await this.deviceRegistrationModel.destroy({
          where: {
            clientId: input.clientId,
            installKeyThumbprint: input.installKeyThumbprint,
            nationalId: { [Op.ne]: input.nationalId },
          },
          transaction,
        })

        const values = {
          ...input,
          biometricKeyJwk: input.biometricKeyJwk ?? null,
          biometricKeyThumbprint: input.biometricKeyThumbprint ?? null,
          appAttestKeyId: input.appAttestKeyId ?? null,
          appAttestPublicKey: input.appAttestPublicKey ?? null,
          appAttestCounter: input.appAttestCounter ?? null,
          deviceName: input.deviceName ?? null,
        }

        const existing = await this.deviceRegistrationModel.findOne({
          where: { nationalId: input.nationalId, clientId: input.clientId },
          transaction,
        })

        const registration = existing
          ? await existing.update(values, { transaction })
          : await this.deviceRegistrationModel.create(values, { transaction })

        return registration.toDto()
      },
    )
  }

  /**
   * Updates last use and, when given, the biometric key (null clears it), only
   * while the registration still has the install key the caller read. False when
   * a login on another install replaced it, or it was removed, so a stale write
   * can't bring it back. Leaving the biometric fields out leaves the key alone.
   */
  async update(
    id: string,
    input: UpdateDeviceRegistrationDto,
  ): Promise<boolean> {
    const changeBiometricKey = input.biometricKeyJwk !== undefined
    const [updated] = await this.deviceRegistrationModel.update(
      {
        lastUsed: input.lastUsed,
        ...(changeBiometricKey && {
          biometricKeyJwk: input.biometricKeyJwk ?? null,
          biometricKeyThumbprint: input.biometricKeyThumbprint ?? null,
        }),
      },
      { where: { id, installKeyThumbprint: input.installKeyThumbprint } },
    )

    return updated > 0
  }

  async delete(id: string): Promise<void> {
    await this.deviceRegistrationModel.destroy({ where: { id } })
  }
}
