import { SvaediDTO } from '../../../gen/fetch'
export interface Area {
  id: string
  name: string
  min: number
  max: number
  collectionId?: string
}

export const mapArea = (area: SvaediDTO, collectionId?: string): Area => ({
  id: area?.id?.toString() ?? '',
  name: area?.nafn?.toString() ?? '',
  min: area?.fjoldi ?? 0,
  max: area?.fjoldiMax ?? 0,
  collectionId,
})
