import {
  CreateCaseData,
  CreateDocumentData,
  CreateThingbokRequest,
  CreateEmailData,
} from '../../gen/fetch'
import { UploadFile } from './uploadStreamApi'

export type CreateCaseArgs = Omit<CreateCaseData, 'authenticationToken'>
export type CreateDocumentArgs = Omit<CreateDocumentData, 'authenticationToken'>
export type CreateThingbokArgs = Omit<
  CreateThingbokRequest,
  'authenticationToken'
>
export type CreateEmailArgs = Omit<CreateEmailData, 'authenticationToken'>
export type UploadStreamArgs = UploadFile

export abstract class CourtClientService {
  abstract createCase(courtId: string, args: CreateCaseArgs): Promise<string>
  abstract createDocument(
    courtId: string,
    args: CreateDocumentArgs,
  ): Promise<string>
  abstract createThingbok(
    courtId: string,
    args: CreateThingbokArgs,
  ): Promise<string>
  abstract createEmail(courtId: string, args: CreateEmailArgs): Promise<string>
  abstract uploadStream(
    courtId: string,
    args: UploadStreamArgs,
  ): Promise<string>
}
