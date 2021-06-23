import {
  BasicDataProvider,
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
} from '@island.is/application/core'
import { PartyLetterRegistry } from '../types/schema'

export type PartyLetterRegistryPartyLetter = Pick<
  PartyLetterRegistry,
  'partyName' | 'partyLetter'
>

type PartyLetterRegistryResponse = {
  partyLetterRegistryFindLetter: PartyLetterRegistryPartyLetter
}

export class PartyLetterRegistryProvider extends BasicDataProvider {
  type = 'PartyLetterRegistry'

  async provide(): Promise<PartyLetterRegistryPartyLetter> {
    const FIND_PARTY_LETTER_QUERY = `
    query {
      partyLetterRegistryFindLetter {
        partyName
        partyLetter
      }
    }
    `

    return this.useGraphqlGateway<PartyLetterRegistryResponse>(
      FIND_PARTY_LETTER_QUERY,
    ).then(async (res) => {
      const response = await res.json()

      // service should always return data even when requested entry does not exist, this is here to flag missing data on critical failures
      if (!response.data || 'errors' in response) {
        // we return empty party letter response to be able to handle it in a later step
        return {
          partyLetter: '',
          partyName: '',
        }
      }
      return {
        partyLetter: response.data.partyLetterRegistryFindLetter.partyLetter,
        partyName: response.data.partyLetterRegistryFindLetter.partyName,
      }
    })
  }

  onProvideError(result: string): FailedDataProviderResult {
    return {
      date: new Date(),
      reason:
        'Sambandi við vefþjónustu náðist ekki, vinsamlegast reynið aftur síðar',
      status: 'failure',
      data: result,
    }
  }

  onProvideSuccess(result: object): SuccessfulDataProviderResult {
    return { date: new Date(), status: 'success', data: result }
  }
}
