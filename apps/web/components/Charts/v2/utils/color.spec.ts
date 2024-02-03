import { ChartComponent } from '@island.is/web/graphql/schema'

import {
  PREDEFINED_LINE_DASH_PATTERNS,
  PRIMARY_COLORS,
  PRIMARY_FILL_PATTERNS,
  SECONDARY_COLORS,
} from '../constants'
import { ChartComponentType } from '../types'
import { decideComponentStyles } from './color'

let id = 0

const createComponent = (
  type: ChartComponentType,
  key: string,
): ChartComponent => {
  return {
    id: `${id++}`,
    type,
    label: 'test',
    sourceDataKey: key,
  }
}

describe('decideComponentStyles', () => {
  describe('non-mixed charts:', () => {
    it.each([
      ChartComponentType.line,
      ChartComponentType.area,
      ChartComponentType.bar,
      ChartComponentType.pie,
    ])(
      'should only use primary colors for components of same type',
      (type: ChartComponentType) => {
        // Arrange
        const components = [
          createComponent(type, '0'),
          createComponent(type, '1'),
        ]

        // Act
        const styles = decideComponentStyles(components)

        // Assert
        for (let i = 0; i < styles.length; i += 1) {
          expect(styles[i].color).toBe(PRIMARY_COLORS[i])
        }
      },
    )
  })

  describe('line charts:', () => {
    it('should use no pattern for the first line', () => {
      // Arrange
      const components = [
        createComponent(ChartComponentType.line, '0'),
        createComponent(ChartComponentType.line, '1'),
        createComponent(ChartComponentType.line, '2'),
      ]

      // Act
      const styles = decideComponentStyles(components)

      // Assert
      expect(styles[0].pattern).toBe(undefined)
    })

    it('should use correct order of line dash patterns after the first solid line', () => {
      // Arrange
      const components = [
        createComponent(ChartComponentType.line, '0'),
        createComponent(ChartComponentType.line, '1'),
        createComponent(ChartComponentType.line, '2'),
        createComponent(ChartComponentType.line, '3'),
      ]

      // Act
      const styles = decideComponentStyles(components)

      // Assert
      for (let i = 1; i < styles.length; i += 1) {
        expect(styles[i].pattern).toBe(PREDEFINED_LINE_DASH_PATTERNS[i - 1])
      }
    })
  })

  describe('filled (bar / area / pie) charts:', () => {
    it('should use no pattern for the initial filled component', () => {
      // Arrange
      const components = [createComponent(ChartComponentType.bar, '0')]

      // Act
      const styles = decideComponentStyles(components)

      // Assert
      expect(styles[0].hasFill).toBe(true)
      expect(styles[0].pattern).toBe(undefined)
    })

    it('should use patterns for all filled components following the first one', () => {
      // Arrange
      const components = [createComponent(ChartComponentType.bar, '0')]

      // Act
      const styles = decideComponentStyles(components)

      // Assert
      for (const style of styles.filter((s) => s.renderIndex > 0)) {
        expect(style.pattern).toBe(
          PRIMARY_FILL_PATTERNS[style.renderIndexForType],
        )
        expect(style.color).toBe(PRIMARY_COLORS[style.renderIndexForType])
      }
    })
  })

  describe('pie charts', () => {
    it('do not need any patterns since they are labeled for each cell', () => {
      // Arrange
      const components = [
        createComponent(ChartComponentType.pie, '0'),
        createComponent(ChartComponentType.pie, '1'),
        createComponent(ChartComponentType.pie, '2'),
        createComponent(ChartComponentType.pie, '3'),
      ]

      // Act
      const styles = decideComponentStyles(components)

      // Assert
      for (const style of styles) {
        expect(style.pattern).toBe(undefined)
        expect(style.patternId).toBe(undefined)
      }
    })
  })

  describe('mixed charts', () => {
    it('should correctly categorize line vs fill components', () => {
      // Arrange
      const components = [
        createComponent(ChartComponentType.line, '0'),
        createComponent(ChartComponentType.bar, '1'),
        createComponent(ChartComponentType.line, '1'),
        createComponent(ChartComponentType.bar, '1'),
        createComponent(ChartComponentType.line, '1'),
        createComponent(ChartComponentType.bar, '1'),
      ]

      // Act
      const styles = decideComponentStyles(components)

      // Assert
      expect(styles[0].hasFill).toBe(false)
      expect(styles[1].hasFill).toBe(true)
      expect(styles[2].hasFill).toBe(false)
      expect(styles[3].hasFill).toBe(true)
      expect(styles[4].hasFill).toBe(false)
      expect(styles[5].hasFill).toBe(true)
    })

    it('should use primary colors for filled components', () => {
      // Arrange
      const components = [
        createComponent(ChartComponentType.line, '0'),
        createComponent(ChartComponentType.bar, '1'),
        createComponent(ChartComponentType.line, '1'),
        createComponent(ChartComponentType.bar, '1'),
        createComponent(ChartComponentType.line, '1'),
        createComponent(ChartComponentType.bar, '1'),
      ]

      // Act
      const styles = decideComponentStyles(components)

      // Assert
      for (const style of styles.filter((s) => s.hasFill)) {
        expect(style.color).toBe(PRIMARY_COLORS[style.renderIndexForType])
      }
    })

    it('should use correct order of line dash patterns in mixed charts', () => {
      // Arrange
      const components = [
        createComponent(ChartComponentType.line, '0'),
        createComponent(ChartComponentType.bar, '1'),
        createComponent(ChartComponentType.line, '1'),
        createComponent(ChartComponentType.bar, '1'),
        createComponent(ChartComponentType.line, '1'),
        createComponent(ChartComponentType.bar, '1'),
      ]

      // Act
      const styles = decideComponentStyles(components)

      // Assert
      for (const style of styles.filter((s) => !s.hasFill)) {
        expect(style.pattern).toBe(
          style.renderIndexForType === 0
            ? undefined
            : PREDEFINED_LINE_DASH_PATTERNS[style.renderIndexForType - 1],
        )
      }
    })

    it('should use secondary colors for lines in mixed charts', () => {
      // Arrange
      const components = [
        createComponent(ChartComponentType.line, '0'),
        createComponent(ChartComponentType.bar, '1'),
        createComponent(ChartComponentType.line, '1'),
        createComponent(ChartComponentType.bar, '1'),
        createComponent(ChartComponentType.line, '1'),
        createComponent(ChartComponentType.bar, '1'),
      ]

      // Act
      const styles = decideComponentStyles(components)

      // Assert
      for (const style of styles.filter((s) => !s.hasFill)) {
        expect(style.color).toBe(SECONDARY_COLORS[style.renderIndexForType])
      }
    })
  })
})
