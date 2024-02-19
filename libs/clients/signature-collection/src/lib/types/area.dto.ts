import { SvaediDTO } from '../../../gen/fetch'
export interface Area {
  id: string
  name: string
  min: number
  max: number
}

export const mapArea = (area: SvaediDTO): Area => ({
  id: area?.id?.toString() ?? '',
  name: area?.nafn?.toString() ?? '',
  min: area?.fjoldi ?? 0,
  // TODO: update when max is available
  max: area?.fjoldiMax ?? 0,
})
