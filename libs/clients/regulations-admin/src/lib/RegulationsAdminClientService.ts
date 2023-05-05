import { Inject } from '@nestjs/common'
import {
  DraftImpact,
  DraftRegulationChange,
  RegulationDraft,
} from '@island.is/regulations/admin'
import {
  DraftAuthorApi,
  DraftRegulationCancelApi,
  DraftRegulationChangeApi,
  DraftRegulationsApi,
} from '../../gen/fetch/apis'
import { Auth, AuthMiddleware } from '@island.is/auth-nest-tools'
import { RegulationsAdminClientConfig } from './RegulationsAdminClientConfig'
import { ConfigType } from '@nestjs/config'
import {
  CreateDraftRegulationCancelDto,
  CreateDraftRegulationChangeDto,
  CreateDraftRegulationDto,
  DraftRegulationCancelModel,
  UpdateDraftRegulationCancelDto,
  UpdateDraftRegulationChangeDto,
  UpdateDraftRegulationDto,
} from '../../gen/fetch/models'

export class RegulationsAdminClientService {
  constructor(
    @Inject(RegulationsAdminClientConfig.KEY)
    private readonly config: ConfigType<typeof RegulationsAdminClientConfig>,
    private draftAuthorApi: DraftAuthorApi,
    private draftRegulationCancelApi: DraftRegulationCancelApi,
    private draftRegulationChangeApi: DraftRegulationChangeApi,
    private draftRegulationsApi: DraftRegulationsApi,
  ) {}

  draftAuthorApiWithAuth(auth: Auth) {
    return this.draftAuthorApi.withMiddleware(new AuthMiddleware(auth))
  }

  draftRegulationCancelApiWithAuth(auth: Auth) {
    return this.draftRegulationCancelApi.withMiddleware(
      new AuthMiddleware(auth),
    )
  }

  draftRegulationChangeApiWithAuth(auth: Auth) {
    return this.draftRegulationChangeApi.withMiddleware(
      new AuthMiddleware(auth),
    )
  }

  draftRegulationsApiWithAuth(auth: Auth) {
    return this.draftRegulationsApi.withMiddleware(new AuthMiddleware(auth))
  }

  async getDraftRegulations(auth: Auth, page?: number) {
    const allDrafts = await this.draftRegulationsApiWithAuth(
      auth,
    ).draftRegulationControllerGetAll({
      page: page ?? 0,
    })
    return allDrafts
  }

  async getShippedRegulations(auth: Auth) {
    return await this.draftRegulationsApiWithAuth(
      auth,
    ).draftRegulationControllerGetAllShipped()
  }

  async getDraftRegulation(
    draftId: string,
    auth: Auth,
  ): Promise<RegulationDraft | null> {
    const draftRegulation = ((await this.draftRegulationsApiWithAuth(
      auth,
    ).draftRegulationControllerGetById({
      id: draftId,
    })) as unknown) as RegulationDraft

    return draftRegulation
  }

  async getImpactsByName(
    name: string,
    auth: Auth,
  ): Promise<DraftImpact[] | null> {
    const res = ((await this.draftRegulationsApiWithAuth(
      auth,
    ).draftRegulationControllerGetImpactsByName({
      name,
    })) as unknown) as DraftImpact[]

    return res
  }

  async create(auth: Auth, input: CreateDraftRegulationDto): Promise<any> {
    return await this.draftRegulationsApiWithAuth(
      auth,
    ).draftRegulationControllerCreate({
      createDraftRegulationDto: {
        type: input.type || 'base',
      },
    })
  }

  async updateById(
    draftId: string,
    body: UpdateDraftRegulationDto,
    auth: Auth,
  ): Promise<any> {
    return await this.draftRegulationsApiWithAuth(
      auth,
    ).draftRegulationControllerUpdate({
      updateDraftRegulationDto: body,
      id: draftId,
    })
  }

  async deleteById(draftId: string, auth: Auth): Promise<void> {
    return await this.draftRegulationsApiWithAuth(
      auth,
    ).draftRegulationControllerDelete({
      id: draftId,
    })
  }

  async createDraftRegulationCancel(
    input: CreateDraftRegulationCancelDto,
    auth: Auth,
  ): Promise<DraftRegulationCancelModel> {
    return await this.draftRegulationCancelApiWithAuth(
      auth,
    ).draftRegulationCancelControllerCreate({
      createDraftRegulationCancelDto: input,
    })
  }

  async updateDraftRegulationCancel(
    update: UpdateDraftRegulationCancelDto & { id: string },
    auth: Auth,
  ): Promise<DraftRegulationCancelModel> {
    const { id, ...input } = update
    return await this.draftRegulationCancelApiWithAuth(
      auth,
    ).draftRegulationCancelControllerUpdate({
      updateDraftRegulationCancelDto: input,
      id,
    })
  }

  async deleteDraftRegulationCancel(
    input: { id: string },
    auth: Auth,
  ): Promise<void> {
    return await this.draftRegulationCancelApiWithAuth(
      auth,
    ).draftRegulationCancelControllerDelete({
      id: input.id,
    })
  }

  async createDraftRegulationChange(
    input: CreateDraftRegulationChangeDto,
    auth: Auth,
  ): Promise<DraftRegulationChange> {
    return ((await this.draftRegulationChangeApiWithAuth(
      auth,
    ).draftRegulationChangeControllerCreate({
      createDraftRegulationChangeDto: input,
    })) as unknown) as DraftRegulationChange
  }

  async updateDraftRegulationChange(
    update: UpdateDraftRegulationChangeDto,
    id: string,
    auth: Auth,
  ): Promise<DraftRegulationChange> {
    return ((await this.draftRegulationChangeApiWithAuth(
      auth,
    ).draftRegulationChangeControllerUpdate({
      id,
      updateDraftRegulationChangeDto: update,
    })) as unknown) as DraftRegulationChange
  }

  async deleteDraftRegulationChange(id: string, auth: Auth): Promise<any> {
    return await this.draftRegulationChangeApiWithAuth(
      auth,
    ).draftRegulationChangeControllerDelete({
      id,
    })
  }
}
