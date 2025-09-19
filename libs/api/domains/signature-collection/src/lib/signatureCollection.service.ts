import {
  Injectable,
  MethodNotAllowedException,
  NotFoundException,
} from '@nestjs/common'
import { SignatureCollectionSuccess } from './models/success.model'
import { SignatureCollection } from './models/collection.model'
import {
  SignatureCollectionList,
  SignatureCollectionSignedList,
} from './models/signatureList.model'
import { SignatureCollectionSignature } from './models/signature.model'
import { SignatureCollectionSignee } from './models/signee.model'
import {
  CollectionType,
  ReasonKey,
  SignatureCollectionClientService,
} from '@island.is/clients/signature-collection'
import { User } from '@island.is/auth-nest-tools'
import { SignatureCollectionCancelListsInput } from './dto/cencelLists.input'
import { SignatureCollectionIdInput } from './dto/collectionId.input'
import { SignatureCollectionAddListsInput } from './dto/addLists.input'
import { SignatureCollectionUploadPaperSignatureInput } from './dto/uploadPaperSignature.input'
import { SignatureCollectionCanSignFromPaperInput } from './dto/canSignFromPaper.input'
import { SignatureCollectionCollector } from './models/collector.model'
import {
  SignatureCollectionListSummary,
  SignatureCollectionSummaryReport,
} from './models/summaryReport.model'
import { SignatureCollectionSignatureUpdateInput } from './dto/signatureUpdate.input'
import { SignatureCollectionCandidateIdInput } from './dto'

@Injectable()
export class SignatureCollectionService {
  constructor(
    private signatureCollectionClientService: SignatureCollectionClientService,
  ) {}

  private checkListAccess(listId: string, signee: SignatureCollectionSignee) {
    if (!signee.ownedLists?.some((list) => list.id === listId)) {
      throw new NotFoundException('List not found')
    }
  }

  async getLatestCollectionForType(
    collectionType: CollectionType,
  ): Promise<SignatureCollection> {
    return await this.signatureCollectionClientService.getLatestCollectionForType(
      collectionType,
    )
  }

  async allOpenLists({
    collectionId,
  }: SignatureCollectionIdInput): Promise<SignatureCollectionList[]> {
    return await this.signatureCollectionClientService.getLists({
      collectionId,
      onlyActive: true,
    })
  }

  async isCollector(candidateId: string, auth: User) {
    // Checks if actor is collector else adds actor as collector
    const res = await this.signatureCollectionClientService.isCollector(
      parseInt(candidateId),
      auth,
    )
    return res.success
  }

  async listsForUser(
    { collectionId, collectionType }: SignatureCollectionIdInput,
    signee: SignatureCollectionSignee,
    user: User,
  ): Promise<SignatureCollectionList[]> {
    if (!signee.area || signee.canSignInfo?.includes(ReasonKey.UnderAge)) {
      return []
    }
    return await this.signatureCollectionClientService.getLists(
      {
        collectionId: collectionId,
        areaId: signee.area?.id,
        onlyActive: true,
        collectionType,
      },
      user,
    )
  }

  async listsForOwner(
    { collectionId }: SignatureCollectionIdInput,
    signee: SignatureCollectionSignee,
    user: User,
  ): Promise<SignatureCollectionList[]> {
    return await this.signatureCollectionClientService.getLists(
      {
        collectionId: collectionId,
        candidateId: signee.candidate?.id,
      },
      user,
    )
  }

  async list(
    listId: string,
    user: User,
    signee: SignatureCollectionSignee,
  ): Promise<SignatureCollectionList> {
    this.checkListAccess(listId, signee)
    try {
      return await this.signatureCollectionClientService.getList(listId, user)
    } catch (e) {
      throw new MethodNotAllowedException((e as Error).message)
    }
  }

  async signedList(
    user: User,
    collectionType: CollectionType,
  ): Promise<SignatureCollectionSignedList[] | null> {
    return await this.signatureCollectionClientService.getSignedList(
      collectionType,
      user,
    )
  }

  async signatures(
    listId: string,
    user: User,
  ): Promise<SignatureCollectionSignature[]> {
    return await this.signatureCollectionClientService.getSignatures(
      listId,
      user,
    )
  }

  async signee(
    user: User,
    collectionType: CollectionType,
    nationalId?: string,
  ): Promise<SignatureCollectionSignee> {
    return await this.signatureCollectionClientService.getSignee(
      user,
      collectionType,
      nationalId,
    )
  }

  async unsign(
    listId: string,
    user: User,
    collectionType: CollectionType,
  ): Promise<SignatureCollectionSuccess> {
    return await this.signatureCollectionClientService.unsignList(
      listId,
      collectionType,
      user,
    )
  }

  async cancel(
    input: SignatureCollectionCancelListsInput,
    user: User,
  ): Promise<SignatureCollectionSuccess> {
    return await this.signatureCollectionClientService.removeLists(input, user)
  }

  async add(
    input: SignatureCollectionAddListsInput,
    user: User,
  ): Promise<SignatureCollectionSuccess> {
    return await this.signatureCollectionClientService.createParliamentaryLists(
      { ...input, areas: input.areaIds?.map((area) => ({ areaId: area })) },
      user,
    )
  }

  async candidacyUploadPaperSignature(
    input: SignatureCollectionUploadPaperSignatureInput,
    user: User,
  ): Promise<SignatureCollectionSuccess> {
    return await this.signatureCollectionClientService.candidacyUploadPaperSignature(
      user,
      input,
    )
  }

  async canSignFromPaper(
    user: User,
    input: SignatureCollectionCanSignFromPaperInput,
    signee: SignatureCollectionSignee,
  ): Promise<boolean> {
    const signatureSignee =
      await this.signatureCollectionClientService.getSignee(
        user,
        input.collectionType,
        input.signeeNationalId,
      )
    const list = await this.list(input.listId, user, signee)
    // Current signatures should not prevent paper signatures
    const canSign =
      signatureSignee.canSign ||
      (signatureSignee.canSignInfo?.length === 1 &&
        (signatureSignee.canSignInfo[0] === ReasonKey.AlreadySigned ||
          signatureSignee.canSignInfo[0] === ReasonKey.noInvalidSignature))

    return canSign && list.area.id === signatureSignee.area?.id
  }

  async collectors(
    user: User,
    candidateId: string | undefined,
  ): Promise<SignatureCollectionCollector[]> {
    if (!candidateId) {
      return []
    }
    return await this.signatureCollectionClientService.getCollectors(
      user,
      candidateId,
    )
  }

  async listOverview(
    user: User,
    listId: string,
  ): Promise<SignatureCollectionListSummary> {
    return await this.signatureCollectionClientService.getListOverview(
      user,
      listId,
    )
  }

  async updateSignaturePageNumber(
    user: User,
    input: SignatureCollectionSignatureUpdateInput,
  ): Promise<SignatureCollectionSuccess> {
    return await this.signatureCollectionClientService.updateSignaturePageNumber(
      user,
      input.signatureId,
      input.pageNumber,
    )
  }

  async getCandidateSummaryReport(
    input: SignatureCollectionCandidateIdInput,
    user: User,
  ): Promise<SignatureCollectionSummaryReport> {
    return await this.signatureCollectionClientService.getCandidateSummaryReport(
      user,
      input.candidateId,
    )
  }
}
