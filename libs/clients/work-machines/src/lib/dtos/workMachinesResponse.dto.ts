import { LabelDto } from './label.dto'
import { LinkDto } from './link.dto'
import { PaginationDto } from './pagination.dto'
import { WorkMachinesCollectionItem } from './workMachineItem.dto'

export interface WorkMachineResponseDto {
  machines: Array<WorkMachinesCollectionItem>
  links: Array<LinkDto>
  labels: Array<LabelDto>
  pagination?: PaginationDto
}
