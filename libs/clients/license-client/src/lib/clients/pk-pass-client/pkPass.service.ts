import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import { VerifyPassData, VerifyPkPassDataInput } from './pkPass.types'
import { Inject } from '@nestjs/common'
import { SmartSolutionsApi } from '@island.is/clients/smartsolutions'
import { SmartSolutionsService } from '@island.is/clients/smart-solutions-v2'
import { FeatureFlagService, Features } from '@island.is/nest/feature-flags'
import {
  PassData,
  PassDataInput,
  PassRevocationData,
  Result,
} from '../../licenseClient.type'
import { mapPassData } from './pkPass.mapper'

export class PkPassService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
    private readonly featureFlagService: FeatureFlagService,
    private readonly newSmartService: SmartSolutionsService,
    /** DEPRECATED */
    private readonly oldSmartService: SmartSolutionsApi,
  ) {}

  async getService(): Promise<SmartSolutionsService | SmartSolutionsApi> {
    const v2Enabled = await this.featureFlagService.getValue(
      Features.licensesV2,
      false,
    )

    return v2Enabled ? this.newSmartService : this.oldSmartService
  }

  async verifyPkPass(
    payload: VerifyPkPassDataInput,
    requestId?: string,
  ): Promise<Result<VerifyPassData>> {
    const service = await this.getService()

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
  ): Promise<Result<PassData>> {
    const service = await this.getService()
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
  ): Promise<Result<PassData>> {
    const service = await this.getService()
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
  ): Promise<Result<PassRevocationData>> {
    const service = await this.getService()
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
