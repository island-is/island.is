import { NationalRegistryIndividual } from '@island.is/application/types'

export interface ExternalData {
  nationalRegistry: {
    data: NationalRegistryIndividual
    date: string
    status: StatusProvider
  }
}

export type StatusProvider = 'failure' | 'success'

// interface for property search data
export interface FasteignByStadfangNrProps {
  fastnum: number
  fasteign_nr: number
  landeign_nr: number
  stadfang_nr: number
  heimilisfang: string
  postnumer: number
  sveitarfelag: string
  merking: string
  lysing: string
  flatarmal: number
  fasteignamat_nuverandi: number
  fasteignamat_naesta_ar: number
  lodamat_nuverandi: number
  lodaamat_naesta_ar: number
  brunabotamat: number
  tengd_stadfang_nr: number[]
}
export interface AdalmatseiningProps {
  fastnum: number
  fasteignanumer: number
  fasteignamat: number
  brunabotamat: number
  notkun: string
  stadfang_nr: number
  stadfang_birting: string
  merking: string
  matseiningar: MatseiningProps[]
}
export interface MatseiningProps {
  fnum: number
  fasteignamat: number
  fastnum: number
  notkun: string
  merking: string
  stadfang_nr: number
  stadfang_birting: string | null
  brunabotamat: number
  eining: string
  einflm: number
}
