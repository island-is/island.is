import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { DatabaseError, Op, UniqueConstraintError } from 'sequelize'

import { DeviceRegistration } from './device-registration.model'
import {
  DeviceRegistrationDto,
  SaveDeviceRegistrationDto,
  UpdateDeviceRegistrationDto,
} from './dto/device-registration.dto'

const SAVE_ATTEMPTS = 3
const DEADLOCK_DETECTED = '40P01'

const isConflict = (error: unknown): boolean =>
  error instanceof UniqueConstraintError ||
  (error instanceof DatabaseError &&
    (error.original as { code?: string })?.code === DEADLOCK_DETECTED)

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
    // Two logins racing for the same person or install key: the loser starts over.
    for (let attempt = 1; ; attempt++) {
      try {
        return await this.saveOnce(input)
      } catch (error) {
        if (attempt >= SAVE_ATTEMPTS || !isConflict(error)) throw error
      }
    }
  }

  private saveOnce(
    input: SaveDeviceRegistrationDto,
  ): Promise<DeviceRegistrationDto> {
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
          audkenniSimNumber: input.audkenniSimNumber ?? null,
          developmentBuild: input.developmentBuild ?? false,
        }

        const existing = await this.deviceRegistrationModel.findOne({
          where: { nationalId: input.nationalId, clientId: input.clientId },
          transaction,
          lock: transaction.LOCK.UPDATE,
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

  /**
   * Only while the registration still has the install key the caller read: a
   * login on another install reuses the row, and a stale delete must not remove it.
   */
  async delete(id: string, installKeyThumbprint?: string): Promise<void> {
    await this.deviceRegistrationModel.destroy({
      where: { id, ...(installKeyThumbprint && { installKeyThumbprint }) },
    })
  }
}
