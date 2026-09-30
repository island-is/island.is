import { linkifyText } from './linkify'

describe('linkifyText', () => {
  it('links a bare url', () => {
    expect(linkifyText('Sjá https://island.is/heilsa.')).toEqual([
      { type: 'text', value: 'Sjá ' },
      {
        type: 'link',
        value: 'https://island.is/heilsa',
        href: 'https://island.is/heilsa',
      },
      { type: 'text', value: '.' },
    ])
  })

  it('adds https to a www url', () => {
    expect(linkifyText('www.island.is')).toEqual([
      { type: 'link', value: 'www.island.is', href: 'https://www.island.is' },
    ])
  })

  it('uses the label of a [label|url] link', () => {
    expect(
      linkifyText(
        'láta okkur vita [hér|https://skimanir-umsjon.landlaeknir.is/response/123].',
      ),
    ).toEqual([
      { type: 'text', value: 'láta okkur vita ' },
      {
        type: 'link',
        value: 'hér',
        href: 'https://skimanir-umsjon.landlaeknir.is/response/123',
      },
      { type: 'text', value: '.' },
    ])
  })

  it('leaves brackets without a url as text', () => {
    expect(linkifyText('[hér|ekki slóð]')).toEqual([
      { type: 'text', value: '[hér|ekki slóð]' },
    ])
  })
})
