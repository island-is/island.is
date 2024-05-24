import { OfficialJournalOfIcelandApplicationClientService } from '@island.is/clients/official-journal-of-iceland/application'
import { Injectable } from '@nestjs/common'
import { PostCommentInput } from '../models/postComment.input'
import { PostApplicationInput } from '../models/postApplication.input'
import { GetCommentsInput } from '../models/getComments.input'

@Injectable()
export class OfficialJournalOfIcelandApplicationService {
  constructor(
    private readonly ojoiApplicationService: OfficialJournalOfIcelandApplicationClientService,
  ) {}

  async getComments(input: GetCommentsInput) {
    return await this.ojoiApplicationService.getComments(input)
  }

  async postComment(input: PostCommentInput) {
    return await this.ojoiApplicationService.postComment({
      id: input.id,
      postApplicationComment: {
        comment: input.comment,
      },
    })
  }

  async postApplication(input: PostApplicationInput): Promise<boolean> {
    return await this.ojoiApplicationService.postApplicaton(input)
  }
}
