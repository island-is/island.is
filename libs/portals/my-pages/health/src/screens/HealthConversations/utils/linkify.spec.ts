import { linkifyText } from './linkify'

describe('linkifyText', () => {
  it('links a bare url', () => {
    expect(linkifyText('See https://example.com/page.')).toEqual([
      { type: 'text', value: 'See ' },
      {
        type: 'link',
        value: 'https://example.com/page',
        href: 'https://example.com/page',
      },
      { type: 'text', value: '.' },
    ])
  })

  it('adds https to a www url', () => {
    expect(linkifyText('www.example.com')).toEqual([
      {
        type: 'link',
        value: 'www.example.com',
        href: 'https://www.example.com',
      },
    ])
  })

  it('adds https to an uppercase www url', () => {
    expect(linkifyText('WWW.example.com')).toEqual([
      {
        type: 'link',
        value: 'WWW.example.com',
        href: 'https://WWW.example.com',
      },
    ])
  })

  it('uses the label of a [label|url] link', () => {
    expect(
      linkifyText('Let us know [here|https://example.com/response/123].'),
    ).toEqual([
      { type: 'text', value: 'Let us know ' },
      {
        type: 'link',
        value: 'here',
        href: 'https://example.com/response/123',
      },
      { type: 'text', value: '.' },
    ])
  })

  it('leaves brackets without a url as text', () => {
    expect(linkifyText('[here|not a url]')).toEqual([
      { type: 'text', value: '[here|not a url]' },
    ])
  })
})
