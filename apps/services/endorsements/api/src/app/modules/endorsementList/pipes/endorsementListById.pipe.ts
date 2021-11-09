import {
  Inject,
  Injectable,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { EndorsementList } from '../endorsementList.model'
import { EndorsementListService } from '../endorsementList.service'
import type { EndorsementRequest } from '../../../../../types'

@Injectable()
export class EndorsementListByIdPipe
  implements PipeTransform<string, Promise<EndorsementList>> {
  constructor(
    @Inject(REQUEST) private request: EndorsementRequest,
    private readonly endorsementListService: EndorsementListService,
  ) {}

  async transform(id: string): Promise<EndorsementList> {
    const endorsementList = await this.endorsementListService.findSingleList(id)
    if (!endorsementList) {
      throw new NotFoundException(
        `An endorsement list with the id ${id} does not exist`,
      )
    }
    return endorsementList
  }
}
