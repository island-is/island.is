import { Auth } from '@island.is/auth-nest-tools'
import {
  GetListInput,
  CreateListInput,
  BulkUploadInput,
} from '../signature-collection.types'
import { AreaSummaryReport } from './areaSummaryReport.dto'
import { BulkUpload } from './bulkUpload.dto'
import { CollectionType, Collection } from './collection.dto'
import { ListStatus, List } from './list.dto'
import { Slug } from './slug.dto'
import { Success } from './success.dto'
import { CandidateLookup } from './user.dto'
import { Signature } from './signature.dto'

export interface SignatureCollectionAdminClient {
  getLatestCollectionForType(
    auth: Auth,
    collectionType: CollectionType,
  ): Promise<Collection>

  listStatus(listId: string, auth: Auth): Promise<ListStatus>

  toggleListStatus(listId: string, auth: Auth): Promise<Success>

  processCollection(collectionId: string, auth: Auth): Promise<Success>

  getLists(input: GetListInput, auth: Auth): Promise<List[]>

  getList(listId: string, auth: Auth): Promise<List>

  getSignatures(listId: string, auth: Auth): Promise<Signature[]>

  createListsAdmin(input: CreateListInput, auth: Auth): Promise<Slug & Success>

  unsignListAdmin(signatureId: string, auth: Auth): Promise<Success>

  candidateLookup(
    nationalId: string,
    collectionType: CollectionType,
    auth: Auth,
  ): Promise<CandidateLookup>

  compareBulkSignaturesOnList(
    listId: string,
    nationalIds: string[],
    auth: Auth,
  ): Promise<Signature[]>

  compareBulkSignaturesOnAllLists(
    nationalIds: string[],
    collectionId: string,
    auth: Auth,
  ): Promise<Signature[]>

  extendDeadline(listId: string, newEndDate: Date, auth: Auth): Promise<Success>

  bulkUploadSignatures(input: BulkUploadInput, auth: Auth): Promise<BulkUpload>

  removeCandidate(candidateId: string, auth: Auth): Promise<Success>

  removeList(listId: string, auth: Auth): Promise<Success>

  updateSignaturePageNumber(
    auth: Auth,
    signatureId: string,
    pageNumber: number,
  ): Promise<Success>

  getAreaSummaryReport(
    auth: Auth,
    collectionId: string,
    areaId: string,
  ): Promise<AreaSummaryReport>

  signatureLookup(
    auth: Auth,
    collectionId: string,
    nationalId: string,
  ): Promise<Signature[]>

  lockList(auth: Auth, listId: string): Promise<Success>

  uploadPaperSignature(
    auth: Auth,
    input: { listId: string; nationalId: string; pageNumber: number },
  ): Promise<Success>

  startMunicipalityCollection(
    auth: Auth,
    areaId?: string | undefined,
  ): Promise<Success>

  getMunicipalityAreaId(auth: Auth): Promise<string>
}
