import { ICard } from '../generated/contentfulTypes'
import { mapLinkCard } from './linkCard.model'

describe('mapLinkCard', () => {
  it.each([undefined, null, ''])('defaults a missing URL (%s)', (linkUrl) => {
    const card = {
      sys: { id: 'card-id' },
      fields: { title: 'Card title', linkUrl },
    } as unknown as ICard

    expect(mapLinkCard(card).linkUrl).toBe('')
  })

  it('defaults the URL when fields are missing', () => {
    const card = { sys: { id: 'card-id' } } as ICard

    expect(mapLinkCard(card).linkUrl).toBe('')
  })

  it('preserves an existing URL', () => {
    const card = {
      sys: { id: 'card-id' },
      fields: { title: 'Card title', linkUrl: 'https://island.is' },
    } as ICard

    expect(mapLinkCard(card).linkUrl).toBe('https://island.is')
  })
})
