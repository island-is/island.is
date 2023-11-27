import { MESSAGE } from 'triple-beam'
import { TransformableInfo } from 'logform'

import { maskNationalIdFormatter } from './formatters'

describe('maskNationalIdFormatter', () => {
  const messageSymbol = MESSAGE as unknown as string

  it('should mask national ids', () => {
    // Arrange
    const transformer = maskNationalIdFormatter()

    // Act
    const result = transformer.transform({
      level: 'INFO',
      message: 'Ignored',
      [messageSymbol]: 'Test 0101307789, 010130-7789',
    })

    // Assert
    expect((result as TransformableInfo)[messageSymbol]).toMatchInlineSnapshot(
      `"Test **REMOVE_PII: 0101307789**, **REMOVE_PII: 010130-7789**"`,
    )
  })
})
