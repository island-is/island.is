import { Address } from '@island.is/application/types'

export type Child = {
  nationalId: string
  fullName: string
  address: Address | null
}
