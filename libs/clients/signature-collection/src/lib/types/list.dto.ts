import { Area } from './area.dto'
import { UserBase } from './user.dto'
import { MedmaelalistiDTO } from '../../../gen/fetch'

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
}

export function getLink(id: string): string {
  // TODO: create hash function
  return `https://island.is/umsoknir/maela-med-lista/?collector=${id}`
}

export function mapList(list: MedmaelalistiDTO): List {
  return {
    id: list.id?.toString() ?? '',
    collectionId: list.medmaelasofnun?.id?.toString() ?? '',
    title: list.listiNafn ?? '',
    startTime: list.medmaelasofnun?.sofnunStart ?? new Date(),
    endTime: list.medmaelasofnun?.sofnunEnd ?? new Date(),
    area: {
      id: list.svaedi?.id?.toString() ?? '',
      name: list.svaedi?.nafn?.toString() ?? '',
      min: list.svaedi?.fjoldi ?? 0,
    },
    owner: {
      nationalId: list.frambod?.kennitala ?? '',
      name: list.frambod?.nafn ?? '',
    },
    active: true,
    numberOfSignatures: list.fjoldiMedmaela ?? 0,
    link: getLink(list.frambod?.kennitala ?? ''),
  }
}
