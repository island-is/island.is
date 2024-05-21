import { OfficialJournalOfIcelandApplicationClientService } from '@island.is/clients/official-journal-of-iceland/application'
import { Injectable } from '@nestjs/common'
import { PostCommentInput } from '../models/postComment.input'
import { SubmitApplicationInput } from '../models/submitApplication.input'

@Injectable()
export class OfficialJournalOfIcelandApplicationService {
  constructor(
    private readonly ojoiApplicationService: OfficialJournalOfIcelandApplicationClientService,
  ) {}

  async getComments(applicationId: string) {
    return await this.ojoiApplicationService.getComments(applicationId)
  }

  async postComment(input: PostCommentInput) {
    return await this.ojoiApplicationService.postComment(input)
  }

  async submitApplication(input: SubmitApplicationInput) {
    return await this.ojoiApplicationService.submitApplication(input)
  }
}
