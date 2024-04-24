import { Injectable } from '@nestjs/common'
import {
  AddCommentRequest,
  CaseComment,
  DefaultApi as OfficialJournalOfIcelandApplicationApi,
  SubmitApplicationRequest,
  Application as OJOIApplication,
} from '../../gen/fetch'

@Injectable()
export class OfficialJournalOfIcelandApplicationClientService {
  constructor(
    private readonly ojoiApplicationApi: OfficialJournalOfIcelandApplicationApi,
  ) {}

  async getComments(applicationId: string): Promise<CaseComment[]> {
    return await this.ojoiApplicationApi.getComments({
      id: applicationId,
    })
  }

  async postComment(body: AddCommentRequest): Promise<CaseComment[]> {
    return await this.ojoiApplicationApi.addComment(body)
  }

  async submitApplication(
    body: SubmitApplicationRequest,
  ): Promise<OJOIApplication> {
    return await this.ojoiApplicationApi.submitApplication(body)
  }
}
