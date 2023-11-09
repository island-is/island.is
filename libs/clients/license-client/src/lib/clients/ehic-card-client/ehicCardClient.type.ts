import { BasicCardInfoDTO } from '@island.is/clients/icelandic-health-insurance/rights-portal'

export type EhicCardResponse = BasicCardInfoDTO & {
  tempCardPdf?: string
}
