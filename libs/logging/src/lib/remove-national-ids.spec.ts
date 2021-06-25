import { removeNationalIds } from './remove-national-ids'
import { MESSAGE } from 'triple-beam'
import { TransformableInfo } from 'logform'

const messageSymbol = (MESSAGE as unknown) as string

describe('removeNationalIds', () => {
  it('should mask national ids', () => {
    // Arrange
    const transformer = removeNationalIds()

    // Act
    const result = transformer.transform({
      level: 'INFO',
      message: 'Ignored',
      [messageSymbol]: 'Test 1234561234, 123456-1234',
    })

    // Assert
    expect((result as TransformableInfo)[messageSymbol]).toMatchInlineSnapshot(
      `"Test **REMOVE_PII: 1234561234**, **REMOVE_PII: 123456-1234**"`,
    )
  })
})
