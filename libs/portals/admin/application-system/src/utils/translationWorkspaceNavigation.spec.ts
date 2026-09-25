import type { ScreenIntrospection } from '../types/translationWorkspace'
import {
  countTranslationsForScreens,
  descriptorsForSectionNavigation,
} from './translationWorkspaceNavigation'

const sharedFieldScreen = {
  id: 'applicant',
  type: 'MULTI_FIELD',
  title: 'Upplýsingar um þig',
  description: null,
  pageTitle: null,
  subTitle: null,
  subDescription: null,
  checkboxLabel: null,
  width: null,
  space: null,
  messageDescriptors: [
    {
      id: 'uiForms.application:applicantInfo.general.title',
      defaultMessage: 'Upplýsingar um þig',
    },
    {
      id: 'uiForms.application:applicantInfo.labels.name',
      defaultMessage: 'Fullt nafn',
    },
  ],
} as ScreenIntrospection

describe('descriptorsForSectionNavigation', () => {
  it('includes the section title together with screen strings', () => {
    const descriptors = descriptorsForSectionNavigation(
      {
        id: 'hb.application:draft.title',
        defaultMessage: 'Persónuupplýsingar',
      },
      [sharedFieldScreen],
    )

    expect(descriptors.map((descriptor) => descriptor.id)).toEqual([
      'hb.application:draft.title',
      'uiForms.application:applicantInfo.general.title',
      'uiForms.application:applicantInfo.labels.name',
    ])
  })
})

describe('countTranslationsForScreens', () => {
  it('counts the owned section title when the multifield is shared', () => {
    const count = countTranslationsForScreens(
      [sharedFieldScreen],
      {},
      { is: {}, en: {} },
      'en',
      ['hb.application'],
      descriptorsForSectionNavigation(
        {
          id: 'hb.application:draft.title',
          defaultMessage: 'Persónuupplýsingar',
        },
        [],
      ),
    )

    expect(count).toEqual({ translated: 0, total: 1 })
  })

  it('counts the section title as translated once a draft exists', () => {
    const count = countTranslationsForScreens(
      [sharedFieldScreen],
      {},
      {
        is: {},
        en: { 'hb.application:draft.title': 'Personal information' },
      },
      'en',
      ['hb.application'],
      descriptorsForSectionNavigation(
        {
          id: 'hb.application:draft.title',
          defaultMessage: 'Persónuupplýsingar',
        },
        [],
      ),
    )

    expect(count).toEqual({ translated: 1, total: 1 })
  })
})
