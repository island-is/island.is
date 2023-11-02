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

  getDraftRegulations(auth: Auth, page?: number) {
    return this.draftRegulationsApiWithAuth(
      auth,
    ).draftRegulationControllerGetAll({
      page: page ?? 0,
    })
  }

  getShippedRegulations(auth: Auth) {
    return this.draftRegulationsApiWithAuth(
      auth,
    ).draftRegulationControllerGetAllShipped()
  }

  getDraftRegulation(draftId: string, auth: Auth) {
    return this.draftRegulationsApiWithAuth(
      auth,
    ).draftRegulationControllerGetById({
      id: draftId,
    }) as unknown as RegulationDraft | null
  }

  getImpactsByName(name: string, auth: Auth) {
    return this.draftRegulationsApiWithAuth(
      auth,
    ).draftRegulationControllerGetImpactsByName({
      name,
    }) as unknown as DraftImpact[] | null
  }

  create(auth: Auth, input: CreateDraftRegulationDto) {
    return this.draftRegulationsApiWithAuth(
      auth,
    ).draftRegulationControllerCreate({
      createDraftRegulationDto: {
        type: input.type || 'base',
      },
    })
  }

  updateById(draftId: string, body: UpdateDraftRegulationDto, auth: Auth) {
    return this.draftRegulationsApiWithAuth(
      auth,
    ).draftRegulationControllerUpdate({
      updateDraftRegulationDto: body,
      id: draftId,
    })
  }

  deleteById(draftId: string, auth: Auth) {
    return this.draftRegulationsApiWithAuth(
      auth,
    ).draftRegulationControllerDelete({
      id: draftId,
    })
  }

  createDraftRegulationCancel(
    input: CreateDraftRegulationCancelDto,
    auth: Auth,
  ) {
    return this.draftRegulationCancelApiWithAuth(
      auth,
    ).draftRegulationCancelControllerCreate({
      createDraftRegulationCancelDto: input,
    })
  }

  updateDraftRegulationCancel(
    update: UpdateDraftRegulationCancelDto & { id: string },
    auth: Auth,
  ) {
    const { id, ...input } = update
    return this.draftRegulationCancelApiWithAuth(
      auth,
    ).draftRegulationCancelControllerUpdate({
      updateDraftRegulationCancelDto: input,
      id,
    })
  }

  deleteDraftRegulationCancel(input: { id: string }, auth: Auth) {
    return this.draftRegulationCancelApiWithAuth(
      auth,
    ).draftRegulationCancelControllerDelete({
      id: input.id,
    })
  }

  createDraftRegulationChange(
    input: CreateDraftRegulationChangeDto,
    auth: Auth,
  ) {
    return this.draftRegulationChangeApiWithAuth(
      auth,
    ).draftRegulationChangeControllerCreate({
      createDraftRegulationChangeDto: input,
    }) as unknown as DraftRegulationChange
  }

  updateDraftRegulationChange(
    update: UpdateDraftRegulationChangeDto,
    id: string,
    auth: Auth,
  ) {
    return this.draftRegulationChangeApiWithAuth(
      auth,
    ).draftRegulationChangeControllerUpdate({
      id,
      updateDraftRegulationChangeDto: update,
    }) as unknown as DraftRegulationChange
  }

  deleteDraftRegulationChange(id: string, auth: Auth): Promise<any> {
    return this.draftRegulationChangeApiWithAuth(
      auth,
    ).draftRegulationChangeControllerDelete({
      id,
    })
  }
}
