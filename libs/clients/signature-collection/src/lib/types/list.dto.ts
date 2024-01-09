import { Area, mapArea } from './area.dto'
import { UserBase } from './user.dto'
import { MedmaelalistiDTO } from '../../../gen/fetch'
import { logger } from '@island.is/logging'

export interface List {
  id: string
  title: string
  owner: UserBase
  area: Area
  active: boolean
  startTime: Date
  endTime: Date
  collectionId: string
  collectors?: UserBase[]
  numberOfSignatures: number
  link?: string
  maxReached: boolean
}

export function mapList(list: MedmaelalistiDTO): List {
  if (list.svaedi === undefined) {
    logger.warn(
      'Received partial collection information from the national registry.',
      list,
    )
    throw new Error('List has no area')
  }
  const area = mapArea(list.svaedi)
  const numberOfSignatures = list.fjoldiMedmaela ?? 0
  return {
    id: list.id?.toString() ?? '',
    collectionId: list.medmaelasofnun?.id?.toString() ?? '',
    title: list.listiNafn ?? '',
    startTime: list.medmaelasofnun?.sofnunStart ?? new Date(),
    endTime: list.medmaelasofnun?.sofnunEnd ?? new Date(),
    area,
    owner: {
      nationalId: list.frambod?.kennitala ?? '',
      name: list.frambod?.nafn ?? '',
    },
    active: true,
    numberOfSignatures,
    link: '',
    maxReached: area.max <= numberOfSignatures,
  }
}
