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
    return this.ojoiApplicationService.getComments(input)
  }

  async postComment(input: PostCommentInput) {
    return this.ojoiApplicationService.postComment({
      id: input.id,
      postApplicationComment: {
        comment: input.comment,
      },
    })
  }

  async postApplication(input: PostApplicationInput): Promise<boolean> {
    return this.ojoiApplicationService.postApplication(input)
  }

  async getPrice(id: string) {
    return this.ojoiApplicationService.getPrice({
      id,
    })
  }
}
