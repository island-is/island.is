import { SmartSolutionsApi } from '@island.is/clients/smartsolutions'
import { SmartSolutionsService } from '@island.is/clients/smart-solutions-v2'
import { FeatureFlagService, Features } from '@island.is/nest/feature-flags'
import {
  PassData,
  PassDataInput,
  PassRevocationData,
  Result,
} from '../../licenseClient.type'
import { VerifyPassData, VerifyPkPassDataInput } from './pkPass.types'
import { mapPassData } from './pkPass.mapper'
import { Inject, Injectable } from '@nestjs/common'
import { User } from '@island.is/auth-nest-tools'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'

@Injectable()
export class PkPassService {
  constructor(
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
    private readonly featureFlagService: FeatureFlagService,
    private readonly newSmartService: SmartSolutionsService,
    /** @deprecated */
    private readonly oldSmartService: SmartSolutionsApi,
  ) {}

  async getService(
    user?: User,
    version?: 'v1' | 'v2',
  ): Promise<SmartSolutionsService | SmartSolutionsApi> {
    if (!user) {
      return version === 'v2' ? this.newSmartService : this.oldSmartService
    }
    const v2Enabled = await this.featureFlagService.getValue(
      Features.licensesV2,
      false,
      user,
    )

    return v2Enabled ? this.newSmartService : this.oldSmartService
  }

  //cant feature flag this, no user object available
  async verifyPkPass(
    payload: VerifyPkPassDataInput,
    requestId?: string,
    version?: 'v1' | 'v2',
  ): Promise<Result<VerifyPassData>> {
    const service = await this.getService(undefined, version)
    const pass = await service.verifyPkPass(payload, requestId)

    if (!pass.ok) {
      return pass
    }

    return {
      ok: true,
      data: {
        valid: pass.data.valid,
        pass: pass.data.pass ? mapPassData(pass.data.pass) : undefined,
      },
    }
  }

  async updatePkPass(
    payload: PassDataInput,
    requestId?: string,
    user?: User,
    version?: 'v1' | 'v2',
  ): Promise<Result<PassData>> {
    const service = await this.getService(user, version)
    const pass = await service.updatePkPass(payload, requestId)
    if (!pass.ok) {
      return pass
    }

    return {
      ok: true,
      data: mapPassData(pass.data),
    }
  }

  async generatePkPass(
    payload: PassDataInput,
    onCreateCallback?: () => Promise<void>,
    requestId?: string,
    user?: User,
    version?: 'v1' | 'v2',
  ): Promise<Result<PassData>> {
    const service = await this.getService(user, version)
    const pass = await service.generatePkPass(
      payload,
      onCreateCallback,
      requestId,
    )

    if (!pass.ok) {
      return pass
    }

    return {
      ok: true,
      data: mapPassData(pass.data),
    }
  }

  async revokePkPass(
    passTemplateId: string,
    payload: PassDataInput,
    requestId?: string,
    user?: User,
    version?: 'v1' | 'v2',
  ): Promise<Result<PassRevocationData>> {
    const service = await this.getService(user, version)
    const pass = await service.revokePkPass(passTemplateId, payload, requestId)
    if (!pass.ok) {
      return pass
    }
    return {
      ok: true,
      data: {
        success: pass.data.success,
      },
    }
  }
}
