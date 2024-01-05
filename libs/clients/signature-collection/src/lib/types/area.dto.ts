import { SvaediDTO } from '../../../gen/fetch'
export interface Area {
  id: string
  name: string
  min: number
  max: number
}

export function mapArea(area: SvaediDTO): Area {
  return {
    id: area?.id?.toString() ?? '',
    name: area?.nafn?.toString() ?? '',
    min: area?.fjoldi ?? 0,
    // TODO: update when max is available
    max: area?.fjoldi ?? 0,
  }
}
