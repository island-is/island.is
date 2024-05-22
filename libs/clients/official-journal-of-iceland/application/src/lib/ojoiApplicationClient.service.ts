import { Injectable } from '@nestjs/common'
import {
  DefaultApi as OfficialJournalOfIcelandApplicationApi,
  GetCommentsRequest,
  PostCommentRequest,
  PostApplicationRequest,
  GetCaseCommentsResponse,
} from '../../gen/fetch'

@Injectable()
export class OfficialJournalOfIcelandApplicationClientService {
  constructor(
    private readonly ojoiApplicationApi: OfficialJournalOfIcelandApplicationApi,
  ) {}

  async getComments(
    params: GetCommentsRequest,
  ): Promise<GetCaseCommentsResponse> {
    return await this.ojoiApplicationApi.getComments(params)
  }

  async postComment(params: PostCommentRequest): Promise<void> {
    await this.ojoiApplicationApi.postComment(params)
  }

  async postApplicaton(params: PostApplicationRequest): Promise<void> {
    await this.ojoiApplicationApi.postApplication(params)
  }
}
