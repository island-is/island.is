import { unifyAndDeserialize } from './deserialize'
import { markdownString } from './markdown.fixture'
import { slateNodes } from './slate.fixture'

describe('deserialize', () => {
  it(`should take a markdown as a string from a defineMessage object and transform it into Slate Nodes`, () => {
    // The output is a Slate object with children of Nodes
    const output = {
      type: 'root',
      children: slateNodes,
    }

    const input = markdownString
    const unified = unifyAndDeserialize(input)

    const expected = {
      type: 'root',
      children: unified,
    }

    expect(expected).toMatchObject(output)
  })
})
