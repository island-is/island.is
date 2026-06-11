import { Inject, Injectable } from '@nestjs/common'
import { ApplicationTypes } from '@island.is/application/types'
import { HmsService } from '@island.is/clients/hms'

import { TemplateApiModuleActionProps } from '../../../../types'
import { BaseTemplateApiService } from '../../../base-template-api.service'

type SearchAnswer = {
  query?: string
  value?: string
  label?: string
}

type AddressOption = {
  label: string
  value: string
  addressCode?: number
  selectedPropertyCode?: number
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const cleanupSearch = (search: string): number | undefined => {
  const normalized = search.replace(/\D/g, '')
  if (normalized.length !== 7) return undefined
  const parsed = Number(normalized)
  return Number.isFinite(parsed) ? parsed : undefined
}

const getPropertySearchAnswer = (answers: unknown): SearchAnswer => {
  if (!isRecord(answers)) return {}
  const value = answers.propertySearch
  return isRecord(value) ? (value as SearchAnswer) : {}
}

const getLabel = (address: {
  address?: string
  postalCode?: number
  municipalityName?: string
}): string =>
  [address.address, address.postalCode, address.municipalityName]
    .filter((value) => value !== undefined && value !== null && value !== '')
    .join(' ')

@Injectable()
export class RentalAgreementSdfService extends BaseTemplateApiService {
  constructor(@Inject(HmsService) private readonly hmsService: HmsService) {
    super(ApplicationTypes.RENTAL_AGREEMENT_SDF)
  }

  async searchAddresses({ application, auth }: TemplateApiModuleActionProps) {
    const search = getPropertySearchAnswer(application.answers)
    const query = search.query?.trim() ?? ''
    if (query.length < 3) {
      return { options: [] }
    }

    const selectedPropertyCode = cleanupSearch(query)
    if (selectedPropertyCode !== undefined) {
      const address = await this.hmsService.hmsPropertyCodeInfo(auth, {
        fasteignNr: selectedPropertyCode,
      })
      const option: AddressOption = {
        ...address,
        label: getLabel(address),
        value: String(address.addressCode ?? ''),
        selectedPropertyCode,
      }
      const propertiesByAddressCode = address.addressCode
        ? await this.hmsService.hmsPropertyInfo(auth, {
            stadfangNr: address.addressCode,
            fasteignNr: selectedPropertyCode,
          })
        : []
      return { options: [option], propertiesByAddressCode }
    }

    const addresses = await this.hmsService.hmsSearch(auth, {
      partialStadfang: query,
    })
    const options: AddressOption[] = addresses.map((address) => ({
      ...address,
      label: getLabel(address),
      value: String(address.addressCode ?? ''),
    }))
    return { options }
  }

  async getPropertyInfo({ application, auth }: TemplateApiModuleActionProps) {
    const search = getPropertySearchAnswer(application.answers)
    const stadfangNr = Number(search.value)
    if (!Number.isFinite(stadfangNr)) {
      return { propertiesByAddressCode: [] }
    }

    const selectedPropertyCode = cleanupSearch(search.query ?? '')
    const propertiesByAddressCode = await this.hmsService.hmsPropertyInfo(auth, {
      stadfangNr,
      fasteignNr: selectedPropertyCode,
    })

    return { propertiesByAddressCode }
  }
}
