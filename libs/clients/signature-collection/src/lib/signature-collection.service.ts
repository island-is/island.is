import { Injectable, NotFoundException } from '@nestjs/common'
import {
  FrambodApi,
  FrambodDTO,
  KosningApi,
  MedmaelalistarApi,
  MedmaelasofnunApi,
  MedmaeliApi,
} from '../../gen/fetch'
import {
  GetListInput,
  CreateListInput,
  ReasonKey,
  CanSignInput,
  AddListsInput,
} from './signature-collection.types'
import { Collection, CollectionType } from './types/collection.dto'
import { List, SignedList, getSlug, mapListBase } from './types/list.dto'
import { Signature, mapSignature } from './types/signature.dto'
import { Signee } from './types/user.dto'
import { Success, mapReasons } from './types/success.dto'
import { mapCandidate } from './types/candidate.dto'
import { Slug } from './types/slug.dto'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { SignatureCollectionSharedClientService } from './signature-collection-shared.service'
import {
  ListSummary,
  mapCandidateSummaryReport,
  mapListSummary,
  SummaryReport,
} from './types/summaryReport.dto'
type Api =
  | MedmaelalistarApi
  | MedmaelasofnunApi
  | MedmaeliApi
  | FrambodApi
  | KosningApi

@Injectable()
export class SignatureCollectionClientService {
  constructor(
    private listsApi: MedmaelalistarApi,
    private collectionsApi: MedmaelasofnunApi,
    private electionsApi: KosningApi,
    private signatureApi: MedmaeliApi,
    private candidateApi: FrambodApi,
    private sharedService: SignatureCollectionSharedClientService,
  ) {}

  getApiWithAuth<T extends Api>(api: T, auth: Auth) {
    return api.withMiddleware(new AuthMiddleware(auth)) as T
  }

  async getLatestCollectionForType(
    collectionType: CollectionType,
  ): Promise<Collection> {
    return await this.sharedService.getLatestCollectionForType(
      this.electionsApi,
      collectionType,
    )
  }

  async getLists(input: GetListInput, auth?: Auth): Promise<List[]> {
    return await this.sharedService.getLists(
      input,
      auth ? this.getApiWithAuth(this.listsApi, auth) : this.listsApi,
      auth ? this.getApiWithAuth(this.electionsApi, auth) : this.electionsApi,
    )
  }

  async getList(listId: string, auth: Auth): Promise<List> {
    const list = await this.sharedService.getList(
      listId,
      this.getApiWithAuth(this.listsApi, auth),
      this.getApiWithAuth(this.candidateApi, auth),
      this.getApiWithAuth(this.collectionsApi, auth),
      this.getApiWithAuth(this.electionsApi, auth),
    )
    if (!list.active) {
      throw new Error('Listi er ekki virkur')
    }
    return list
  }

  async getSignatures(listId: string, auth: Auth): Promise<Signature[]> {
    return await this.sharedService.getSignatures(
      this.getApiWithAuth(this.listsApi, auth),
      listId,
    )
  }

  async getAreas(collectionType: CollectionType, collectionId?: string) {
    if (!collectionId) {
      const { id } = await this.getLatestCollectionForType(collectionType)
      collectionId = id
    }
    const areas = await this.collectionsApi.medmaelasofnunIDSvaediGet({
      iD: parseInt(collectionId),
    })
    return areas.map((area) => ({
      id: area.id ?? 0,
      name: area.nafn ?? '',
    }))
  }

  async createLists(
    { collectionId, owner, areas, collectionType }: CreateListInput,
    auth: User,
  ): Promise<Slug> {
    const {
      id,
      isActive,
      areas: collectionAreas,
    } = await this.getLatestCollectionForType(collectionType)

    // check if collectionId is current collection and current collection is open
    if (collectionId !== id.toString() || !isActive) {
      throw new Error('Collection is not open')
    }
    // check if user is sending in their own nationalId
    if (owner.nationalId !== auth.nationalId) {
      throw new Error('NationalId does not match')
    }
    // check if user is already owner of lists

    const { canCreate, isOwner } = await this.getSignee(auth, collectionType)
    if (!canCreate || isOwner) {
      throw new Error('User is already owner of lists')
    }

    const filteredAreas = areas?.length
      ? collectionAreas.filter((area) =>
          areas.flatMap((a) => a.areaId).includes(area.id),
        )
      : collectionAreas

    const candidacy = await this.getApiWithAuth(
      this.candidateApi,
      auth,
    ).frambodPost({
      frambodRequestDTO: {
        sofnunID: parseInt(id),
        kennitala: owner.nationalId,
        simi: owner.phone,
        netfang: owner.email,
        medmaelalistar: filteredAreas.map((area) => ({
          svaediID: parseInt(area.id),
          listiNafn: `${owner.name} - ${area.name}`,
        })),
      },
    })
    return {
      slug: getSlug(
        candidacy.id ?? '',
        candidacy.medmaelasofnun?.kosningTegund ?? '',
      ),
    }
  }

  async createMunicipalCandidacy(
    { collectionId, owner, areas, collectionType, listName }: CreateListInput,
    auth: User,
  ): Promise<Slug> {
    const currentCollection = await this.getLatestCollectionForType(
      CollectionType.LocalGovernmental,
    )

    const inputAreaId = areas?.[0].areaId
    const currentAreaCollectionId = currentCollection.areas.find(
      (area) => area.id === inputAreaId,
    )?.collectionId

    if (currentAreaCollectionId !== collectionId) {
      throw new Error('Collection not found')
    }

    const { areas: collectionAreas } = currentCollection

    // check if collection is open
    if (!collectionAreas.find((area) => area.id === inputAreaId)?.isActive) {
      // TODO: create ApplicationTemplateError
      throw new Error('Collection is not open')
    }

    const { canCreate, isOwner, partyBallotLetterInfo } = await this.getSignee(
      auth,
      collectionType,
    )
    if (!canCreate || isOwner) {
      // TODO: create ApplicationTemplateError
      throw new Error('User is already owner of lists')
    }

    const filteredAreas = areas?.length
      ? collectionAreas.filter((area) =>
          areas.flatMap((a) => a.areaId).includes(area.id),
        )
      : collectionAreas

    const collectionName = listName ?? partyBallotLetterInfo?.name
    const candidacy = await this.getApiWithAuth(
      this.candidateApi,
      auth,
    ).frambodPost({
      frambodRequestDTO: {
        sofnunID: parseInt(collectionId),
        kennitala: owner.nationalId.replace(/\D/g, ''),
        frambodNafn: collectionName,
        simi: owner.phone,
        netfang: owner.email,
        medmaelalistar: filteredAreas.map((area) => ({
          svaediID: parseInt(area.id),
          listiNafn: `${collectionName}, ${owner.name} - ${area.name}`,
        })),
      },
    })

    return {
      slug: getSlug(
        candidacy.id ?? '',
        candidacy.medmaelasofnun?.kosningTegund ?? '',
      ),
    }
  }

  async createParliamentaryCandidacy(
    { collectionId, owner, areas, collectionType }: CreateListInput,
    auth: User,
  ): Promise<Slug> {
    const {
      id,
      isActive,
      areas: collectionAreas,
    } = await this.getLatestCollectionForType(collectionType)
    // check if collectionId is current collection and current collection is open
    if (collectionId !== id.toString() || !isActive) {
      // TODO: create ApplicationTemplateError
      throw new Error('Collection is not open')
    }

    const { canCreate, isOwner, partyBallotLetterInfo } = await this.getSignee(
      auth,
      collectionType,
    )
    if (!canCreate || isOwner) {
      // TODO: create ApplicationTemplateError
      throw new Error('User is already owner of lists')
    }

    const filteredAreas = areas
      ? collectionAreas.filter((area) =>
          areas.flatMap((a) => a.areaId).includes(area.id),
        )
      : collectionAreas

    const candidacy = await this.getApiWithAuth(
      this.candidateApi,
      auth,
    ).frambodPost({
      frambodRequestDTO: {
        sofnunID: parseInt(id),
        kennitala: owner.nationalId.replace(/\D/g, ''),
        simi: owner.phone,
        netfang: owner.email,
        medmaelalistar: filteredAreas.map((area) => ({
          svaediID: parseInt(area.id),
          listiNafn: `${partyBallotLetterInfo?.name}`,
        })),
      },
    })
    return {
      slug: getSlug(
        candidacy.id ?? '',
        candidacy.medmaelasofnun?.kosningTegund ?? '',
      ),
    }
  }

  async createParliamentaryLists(
    { collectionId, candidateId, areas, collectionType }: AddListsInput,
    auth: User,
  ): Promise<Success> {
    try {
      const {
        id,
        isActive,
        areas: collectionAreas,
      } = await this.getLatestCollectionForType(collectionType)

      // check if collectionId is current collection and current collection is open
      if (collectionId !== id.toString() || !isActive) {
        throw new Error('Collection is not open')
      }
      // check if user is already owner of lists

      const { canCreate, canCreateInfo, name } = await this.getSignee(
        auth,
        collectionType,
      )
      if (!canCreate) {
        // allow parliamentary owners to add more areas to their collection
        const isPresidential = collectionType === CollectionType.Presidential
        if (
          !isPresidential &&
          !(
            canCreateInfo?.length === 1 &&
            canCreateInfo[0] === ReasonKey.AlreadyOwner
          )
        ) {
          return { success: false, reasons: canCreateInfo }
        }
      }

      const filteredAreas = areas
        ? collectionAreas.filter((area) =>
            areas.flatMap((a) => a.areaId).includes(area.id),
          )
        : collectionAreas

      const lists = await this.getApiWithAuth(
        this.listsApi,
        auth,
      ).medmaelalistarPost({
        medmaelalistarRequestDTO: {
          frambodID: parseInt(candidateId),
          medmaelalistar: filteredAreas.map((area) => ({
            svaediID: parseInt(area.id),
            listiNafn: `${name} - ${area.name}`,
          })),
        },
      })

      if (filteredAreas.length !== lists.length) {
        throw new Error('Not all lists created')
      }
      return { success: true }
    } catch {
      return { success: false }
    }
  }

  async signList(
    listId: string,
    collectionType: CollectionType,
    auth: User,
  ): Promise<Signature> {
    const { signatures } = await this.getSignee(auth, collectionType)
    // If user has already signed list be sure to throw error
    if (signatures && signatures?.length > 0) {
      throw new Error('User has already signed a list')
    }

    const newSignature = await this.getApiWithAuth(
      this.listsApi,
      auth,
    ).medmaelalistarIDMedmaeliPost({
      kennitala: auth.nationalId,
      iD: parseInt(listId),
    })

    return mapSignature(newSignature)
  }

  async candidacyUploadPaperSignature(
    auth: User,
    {
      listId,
      nationalId,
      pageNumber,
    }: { listId: string; nationalId: string; pageNumber: number },
  ): Promise<Success> {
    try {
      await this.getApiWithAuth(
        this.listsApi,
        auth,
      ).medmaelalistarIDMedmaeliBulkPost({
        medmaeliBulkRequestDTO: {
          medmaeli: [
            {
              kennitala: nationalId,
              bladsida: pageNumber,
            },
          ],
        },
        iD: parseInt(listId),
      })

      return {
        success: true,
      }
    } catch {
      return {
        success: false,
      }
    }
  }

  async unsignList(
    listId: string,
    collectionType: CollectionType,
    auth: User,
  ): Promise<Success> {
    const isPresidential = collectionType === CollectionType.Presidential

    const { signatures } = await this.getSignee(auth, collectionType)
    const activeSignature = signatures?.find((signature) =>
      isPresidential ? signature.valid : signature.listId === listId,
    )
    if (!signatures || !activeSignature || activeSignature.listId !== listId) {
      return { success: false, reasons: [ReasonKey.SignatureNotFound] }
    }
    const signatureRemoved = await this.getApiWithAuth(
      this.signatureApi,
      auth,
    ).medmaeliIDDelete({
      iD: parseInt(activeSignature.id),
    })
    return { success: !!signatureRemoved }
  }

  async removeLists(
    {
      collectionId,
      listIds,
      collectionType,
    }: {
      collectionId: string
      listIds?: string[]
      collectionType: CollectionType
    },
    auth: User,
  ): Promise<Success> {
    const collection = await this.getLatestCollectionForType(collectionType)
    const { ownedLists, candidate } = await this.getSignee(auth, collectionType)
    const { nationalId } = auth
    if (candidate?.nationalId !== nationalId || !candidate.id) {
      return { success: false, reasons: [ReasonKey.NotOwner] }
    }

    const id =
      collectionType === CollectionType.LocalGovernmental
        ? candidate.collectionId
        : collection.id
    const isActive =
      collectionType === CollectionType.LocalGovernmental
        ? collection.areas.find(
            (area) => area.collectionId === candidate.collectionId,
          )?.isActive
        : collection.isActive

    // Lists can only be removed from current collection if it is open
    if (id !== collectionId || !isActive) {
      return { success: false, reasons: [ReasonKey.CollectionNotOpen] }
    }
    // For presidentail elections remove all lists for owner, else remove selected lists
    if (collectionType === CollectionType.Presidential) {
      await this.getApiWithAuth(this.candidateApi, auth).frambodIDDelete({
        iD: parseInt(candidate.id),
      })

      return { success: true }
    }
    if (!listIds || listIds.length === 0) {
      return { success: false, reasons: [ReasonKey.NoListToRemove] }
    }
    if (!ownedLists || ownedLists.length === 0) {
      return { success: false, reasons: [ReasonKey.NoListToRemove] }
    }
    const listsToRemove = ownedLists.filter((list) => listIds.includes(list.id))
    if (listsToRemove.length === 0) {
      return { success: false, reasons: [ReasonKey.NoListToRemove] }
    }

    await Promise.all(
      listsToRemove.map((list) =>
        this.getApiWithAuth(this.listsApi, auth).medmaelalistarIDDelete({
          iD: parseInt(list.id),
        }),
      ),
    )
    // If no lists remain remove Candidate so that they can start a new collection through applications again
    await this.checkIfRemoveCandidate(candidate.id, collectionType, auth)

    return { success: true }
  }

  private async checkIfRemoveCandidate(
    id: string,
    collectionType: CollectionType,
    auth: User,
  ) {
    const { ownedLists, candidate } = await this.getSignee(auth, collectionType)
    if ((!ownedLists || ownedLists.length === 0) && candidate?.id) {
      await this.getApiWithAuth(this.candidateApi, auth).frambodIDDelete({
        iD: parseInt(id),
      })
    }
  }

  async getSignedList(
    collectionType: CollectionType,
    auth: User,
  ): Promise<SignedList[] | null> {
    const { signatures } = await this.getSignee(auth, collectionType)
    if (!signatures) {
      return null
    }
    return await Promise.all(
      signatures.map(async (signature) => {
        // Get title for list
        const list = await this.sharedService.getList(
          signature.listId,
          this.getApiWithAuth(this.listsApi, auth),
          this.getApiWithAuth(this.candidateApi, auth),
          this.getApiWithAuth(this.collectionsApi, auth),
          this.getApiWithAuth(this.electionsApi, auth),
        )
        return {
          signedDate: signature.created,
          isDigital: signature.isDigital,
          pageNumber: signature.pageNumber,
          isValid: signature.valid,
          // TODO: consider extracting this into a helper function, canUnsign(ctype: CollectionType) => bool
          canUnsign: !signature.locked,
          ...list,
        } as SignedList
      }),
    )
  }

  async canSign({
    requirementsMet = false,
    canSignInfo,
    activeSignature,
    signatures,
  }: CanSignInput): Promise<Success> {
    // User is not allowed to have more than one signature
    // They are marked as invalid but count as participation
    const noInvalidSignature = !signatures?.find((s) => !s.valid)

    const reasons = mapReasons({
      ...canSignInfo,
      notSigned: activeSignature === undefined,
      noInvalidSignature,
    })
    return {
      success: requirementsMet && !activeSignature && noInvalidSignature,
      reasons:
        reasons.length > 1
          ? reasons.filter((r) => r !== ReasonKey.DeniedByService)
          : reasons,
    }
  }

  async getSignee(
    auth: User,
    collectionType: CollectionType,
    nationalId?: string,
  ): Promise<Signee> {
    const collection = await this.getLatestCollectionForType(collectionType)
    const { electionId, isActive, areas } = collection
    try {
      const user = await this.getApiWithAuth(
        this.electionsApi,
        auth,
      ).kosningIDEinsInfoKennitalaGet({
        kennitala: nationalId ?? auth.nationalId,
        iD: parseInt(electionId ?? '0'),
      })

      const candidate = user.frambod ? mapCandidate(user.frambod) : undefined
      const activeSignature = user.medmaeli?.find(
        (signature) => signature.valid,
      )
      const signatures = user.medmaeli?.map((signature) =>
        mapSignature(signature),
      )
      const ownedLists =
        user.medmaelalistar && candidate
          ? user.medmaelalistar?.map((list) =>
              mapListBase(
                list,
                collection.areas.some(
                  (area) => area.id === list.svaedi?.id?.toString(),
                ),
              ),
            )
          : []

      const { success: canCreate, reasons: canCreateInfo } =
        this.sharedService.canCreate({
          requirementsMet: user.maFrambod,
          canCreateInfo: user.maFrambodInfo,
          ownedLists,
          collectionType,
          isActive,
          areas,
        })

      const { success: canSign, reasons: canSignInfo } = await this.canSign({
        requirementsMet: user.maKjosa,
        canSignInfo: user.maKjosaInfo,
        activeSignature,
        signatures,
      })

      return {
        nationalId: user.kennitala ?? '',
        name: user.nafn ?? '',
        electionName: user.kosningNafn ?? '',
        canSign,
        canSignInfo,
        canCreate,
        canCreateInfo,
        area: user.svaedi && {
          id: user.svaedi?.id?.toString() ?? '',
          name: user.svaedi?.nafn?.toString() ?? '',
          isActive:
            collection.areas.find(
              (area) => area.id === user.svaedi?.id?.toString(),
            )?.isActive ?? false,
        },

        signatures,
        ownedLists,
        isOwner: user.medmaelalistar ? user.medmaelalistar?.length > 0 : false,
        candidate,
        hasPartyBallotLetter: !!user.maFrambodInfo?.medListabokstaf,
        partyBallotLetterInfo: {
          letter: user.listabokstafur?.listabokstafur ?? '',
          name: user.listabokstafur?.frambodNafn ?? '',
        },
      }
    } catch (e) {
      throw new NotFoundException('User not found')
    }
  }

  async isCandidateId(candidateId: string, auth: User): Promise<boolean> {
    try {
      const candidate = await this.getApiWithAuth(
        this.candidateApi,
        auth,
      ).frambodIDGet({
        iD: parseInt(candidateId),
      })
      return !!candidate
    } catch (e) {
      return false
    }
  }

  async isCollector(candidateId: number, auth: User): Promise<Success> {
    const collectorNationalId = auth.actor?.nationalId

    if (!collectorNationalId) {
      return { success: false }
    }

    // Helper function to find collector in candidate object
    const findCollector = (nationalId: string, candidate: FrambodDTO) =>
      candidate.umbodList?.find(
        (collector) => collector.kennitala === nationalId,
      )

    // instance of api with auth
    const api = this.getApiWithAuth(this.candidateApi, auth)

    // Check if collector exists in candidate object
    const collector = findCollector(
      collectorNationalId,
      await api.frambodIDGet({
        iD: candidateId,
      }),
    )

    // If collector does not exists add collector to candidate object
    if (!collector) {
      return {
        success: !!findCollector(
          collectorNationalId,
          await api.frambodIDAddUmbodPost({
            iD: candidateId,
            requestBody: [collectorNationalId],
          }),
        ),
      }
    }
    return { success: true }
  }

  async getCollectors(
    auth: User,
    candidateId: string,
  ): Promise<{ name: string; nationalId: string }[]> {
    const candidate = await this.getApiWithAuth(
      this.candidateApi,
      auth,
    ).frambodIDGet({
      iD: parseInt(candidateId),
    })

    return (
      candidate.umbodList?.map((u) => ({
        name: u.nafn ?? '',
        nationalId: u.kennitala ?? '',
      })) ?? []
    )
  }

  async getListOverview(auth: User, listId: string): Promise<ListSummary> {
    const summary = await this.getApiWithAuth(
      this.listsApi,
      auth,
    ).medmaelalistarIDInfoGet({
      iD: parseInt(listId),
    })

    return mapListSummary(summary)
  }

  async updateSignaturePageNumber(
    auth: Auth,
    signatureId: string,
    pageNumber: number,
  ): Promise<Success> {
    try {
      const res = await this.getApiWithAuth(
        this.signatureApi,
        auth,
      ).medmaeliIDUpdateBlsPatch({
        iD: parseInt(signatureId),
        blsNr: pageNumber,
      })
      return { success: res.bladsidaNr === pageNumber }
    } catch {
      return { success: false }
    }
  }

  async getCandidateSummaryReport(
    auth: Auth,
    candidateId: string,
  ): Promise<SummaryReport> {
    try {
      const res = await this.getApiWithAuth(
        this.candidateApi,
        auth,
      ).frambodIDInfoGet({
        iD: parseInt(candidateId, 10),
      })
      return mapCandidateSummaryReport(res)
    } catch {
      return {} as SummaryReport
    }
  }
}
