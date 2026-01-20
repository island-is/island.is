import { SvaediDTO } from '../../../gen/fetch'
import { CollectionStatus } from './collection.dto'
export interface Area {
  id: string
  name: string
  min: number
  max: number
  collectionId?: string
  isActive: boolean
  collectionStatus?: CollectionStatus
}

export const mapArea = (
  area: SvaediDTO,
  isActive: boolean,
  collectionId?: string,
  collectionStatus?: CollectionStatus,
): Area => ({
  id: area?.id?.toString() ?? '',
  name: area?.nafn?.toString() ?? '',
  min: area?.fjoldi ?? 0,
  max: area?.fjoldiMax ?? 0,
  collectionId,
  isActive,
  collectionStatus,
})
