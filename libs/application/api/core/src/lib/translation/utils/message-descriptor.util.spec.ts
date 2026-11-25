import { defineMessages } from 'react-intl'

import { flattenMessageDescriptors } from './message-descriptor.util'

describe('flattenMessageDescriptors', () => {
  it('collects nested defineMessages and extra keys on a descriptor', () => {
    const messages = {
      general: defineMessages({
        title: {
          id: 'crc.application:section.approved.pageTitle',
          defaultMessage: 'Page title',
        },
      }),
      description: {
        id: 'crc.application:section.confirmation.description',
        defaultMessage: 'Parent {phoneNumberParagraph}',
        description: 'Confirmation description',
        paragraphs: defineMessages({
          phoneNumber: {
            id: 'crc.application:section.confirmation.description.paragraphs.phoneNumber#markdown',
            defaultMessage: 'í SMS síma {phoneNumber}',
          },
        }),
      },
    }

    const result = flattenMessageDescriptors(messages)
    const ids = result.map((d) => d.id)

    expect(ids).toEqual(
      expect.arrayContaining([
        'crc.application:section.approved.pageTitle',
        'crc.application:section.confirmation.description',
        'crc.application:section.confirmation.description.paragraphs.phoneNumber#markdown',
      ]),
    )
    expect(ids).toHaveLength(3)
  })

  it('ignores objects that only have an id', () => {
    const result = flattenMessageDescriptors({
      field: { id: 'applicationApproved', title: 'Nope' },
    })
    expect(result).toEqual([])
  })
})
