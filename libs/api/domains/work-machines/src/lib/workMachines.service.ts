import { WorkMachinesClientService } from '@island.is/clients/work-machines'
import { User } from '@island.is/auth-nest-tools'
import {
  WorkMachine,
  PaginatedCollectionResponse,
} from './models/getWorkMachines'
import { Inject, Injectable } from '@nestjs/common'
import { Action, ExternalLink } from './workMachines.types'
import { GetWorkMachineCollectionInput } from './dto/getWorkMachineCollection.input'
import { GetWorkMachineInput } from './dto/getWorkMachine.input'
import { GetDocumentsInput } from './dto/getDocuments.input'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
@Injectable()
export class WorkMachinesService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private readonly machineService: WorkMachinesClientService,
  ) {}

  private mapRelToAction = (rel?: string) => {
    switch (rel) {
      case 'requestInspection':
        return Action.REQUEST_INSPECTION
      case 'changeStatus':
        return Action.CHANGE_STATUS
      case 'ownerChange':
        return Action.OWNER_CHANGE
      case 'supervisorChange':
        return Action.SUPERVISOR_CHANGE
      case 'registerForTraffic':
        return Action.REGISTER_FOR_TRAFFIC
      default:
        return null
    }
  }

  private mapRelToCollectionLink = (rel?: string) => {
    switch (rel) {
      case 'self':
        return ExternalLink.SELF
      case 'nextPage':
        return ExternalLink.NEXT_PAGE
      case 'excel':
        return ExternalLink.EXCEL
      case 'csv':
        return ExternalLink.CSV
      default:
        return null
    }
  }

  async getWorkMachines(
    user: User,
    input: GetWorkMachineCollectionInput,
  ): Promise<PaginatedCollectionResponse> {
    const data = await this.machineService.getWorkMachines(user, input)

    if (!data.links || !data.pagination || !data.labels) {
      this.logger.warn(
        'No links, labels or pagination data in work machines collection response',
      )
    }

    const value = data.value?.map(
      (v) =>
        ({
          ...v,
          ownerName: v.owner,
          supervisorName: v.supervisor,
        } as WorkMachine),
    ) as Array<WorkMachine>

    const links = data.links?.length
      ? data.links.map((l) => {
          return {
            ...l,
            rel: this.mapRelToCollectionLink(l.rel ?? ''),
          }
        })
      : null

    return {
      data: value,
      links,
      labels: data.labels,
      totalCount: data.pagination?.totalCount ?? 0,
      pageInfo: {
        hasNextPage:
          data.pagination?.currentPage && data.pagination.totalPages
            ? data.pagination.currentPage < data.pagination.totalPages
            : false,
      },
    }
  }

  async getWorkMachineById(
    user: User,
    input: GetWorkMachineInput,
  ): Promise<WorkMachine | null> {
    const data = await this.machineService.getWorkMachineById(user, input)

    if (!data.links || !data.labels) {
      this.logger.warn('No links or label in work machine response')
    }

    const links = data.links?.length
      ? data.links.map((l) => {
          return {
            ...l,
            rel: this.mapRelToAction(l.rel ?? ''),
          }
        })
      : null

    return {
      ...data,
      links,
    }
  }

  getDocuments = (user: User, input: GetDocumentsInput): Promise<Blob> =>
    this.machineService.getDocuments(user, input)
}
