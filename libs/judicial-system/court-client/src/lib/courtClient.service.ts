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
  abstract createCase(clientId: string, args: CreateCaseArgs): Promise<string>
  abstract createDocument(
    clientId: string,
    args: CreateDocumentArgs,
  ): Promise<string>
  abstract createThingbok(
    clientId: string,
    args: CreateThingbokArgs,
  ): Promise<string>
  abstract createEmail(clientId: string, args: CreateEmailArgs): Promise<string>
  abstract uploadStream(
    clientId: string,
    args: UploadStreamArgs,
  ): Promise<string>
}
