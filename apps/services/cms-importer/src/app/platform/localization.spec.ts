import { stripHtml } from './localization'

describe('stripHtml', () => {
  it.each([
    ['<p>a &amp; b</p>', 'a & b'],
    ['&#8211; &ndash; &aacute;&THORN;', '– – áÞ'],
    ['x&nbsp;y', 'x y'],
    ['1 &lt; 2', '1 < 2'],
    ['a <b', 'a <b'],
    ['a &amp;amp; b', 'a &amp; b'],
  ])('decodes %j to %j', (input, expected) => {
    expect(stripHtml(input)).toBe(expected)
  })
})
