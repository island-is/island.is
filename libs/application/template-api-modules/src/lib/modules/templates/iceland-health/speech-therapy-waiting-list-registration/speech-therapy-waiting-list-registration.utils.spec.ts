import { YES } from '@island.is/application/core'
import { createApplication } from '@island.is/application/testing'
import {
  transformApplicationToRejectWaitingListEntry,
  transformApplicationToUpdateWaitingListEntry,
} from './speech-therapy-waiting-list-registration.utils'

describe('transformApplicationToUpdateWaitingListEntry', () => {
  it('maps a fully filled in application', () => {
    const application = createApplication({
      answers: {
        otherInformation: {
          languages: [{ language: 'is' }, { language: 'en' }],
          locations: [{ location: '3' }, { location: '7' }],
          chosenSpeechPathologist: '4444444444',
          remoteTherapy: [YES],
        },
      },
    })

    expect(transformApplicationToUpdateWaitingListEntry(application)).toEqual({
      languages: ['is', 'en'],
      locations: [3, 7],
      chosenSpeechPathologistKennitala: '4444444444',
      remote: true,
    })
  })

  it('skips empty and unset location and language rows', () => {
    const application = createApplication({
      answers: {
        otherInformation: {
          languages: [
            { language: 'is' },
            { language: '' },
            {},
            { language: 'pl' },
          ],
          locations: [
            { location: '1' },
            { location: '' },
            {},
            { location: '12' },
          ],
        },
      },
    })

    expect(transformApplicationToUpdateWaitingListEntry(application)).toEqual(
      expect.objectContaining({ languages: ['is', 'pl'], locations: [1, 12] }),
    )
  })

  it('sends empty values when selections have been cleared', () => {
    const application = createApplication({
      answers: {
        otherInformation: { chosenSpeechPathologist: '', remoteTherapy: [] },
      },
    })

    expect(transformApplicationToUpdateWaitingListEntry(application)).toEqual(
      expect.objectContaining({
        chosenSpeechPathologistKennitala: null,
        remote: false,
      }),
    )
  })

  it('maps an application without other information to empty values', () => {
    const application = createApplication()

    expect(transformApplicationToUpdateWaitingListEntry(application)).toEqual({
      languages: [],
      locations: [],
      chosenSpeechPathologistKennitala: null,
      remote: false,
    })
  })
})

describe('transformApplicationToRejectWaitingListEntry', () => {
  it('sends the chosen rejection reason id as a number', () => {
    const application = createApplication({
      answers: { waitingList: { declineReason: '2' } },
    })

    expect(transformApplicationToRejectWaitingListEntry(application)).toEqual({
      reasonId: 2,
    })
  })
})
