import { markdownString } from './markdown.fixture'
import { serializeAndFormat } from './serialize'
import { slateNodes } from './slate.fixture'

describe('deserialize', () => {
  it('should take an array of Slate Node and transform it into a markdown string', () => {
    const input = slateNodes
    const output = markdownString
    const expected = serializeAndFormat(input)

    expect(expected).toStrictEqual(output)
  })
})
