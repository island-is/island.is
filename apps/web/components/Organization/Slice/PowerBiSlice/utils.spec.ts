import {
  applyStyles,
  DEFAULT_ASPECT_RATIO,
  getAspectRatio,
  hasConfiguredSize,
} from './utils'

describe('getAspectRatio', () => {
  it('uses the dimensions of the page', () => {
    expect(
      getAspectRatio({ width: 1280, height: 720 }, DEFAULT_ASPECT_RATIO),
    ).toBe('1280/720')
  })

  it.each([
    [undefined],
    [{}],
    [{ width: 1280 }],
    [{ height: 720 }],
    [{ width: 0, height: 0 }],
  ])('falls back when the size is %j', (size) => {
    expect(getAspectRatio(size, DEFAULT_ASPECT_RATIO)).toBe(
      DEFAULT_ASPECT_RATIO,
    )
  })
})

describe('hasConfiguredSize', () => {
  it('is true when the height or aspect ratio is configured', () => {
    expect(hasConfiguredSize({ height: '800px' })).toBe(true)
    expect(hasConfiguredSize({ aspectRatio: '4/3' })).toBe(true)
  })

  it('is false when neither is configured', () => {
    expect(hasConfiguredSize(undefined)).toBe(false)
    expect(hasConfiguredSize({})).toBe(false)
    expect(hasConfiguredSize({ minHeight: '300px' })).toBe(false)
  })
})

describe('applyStyles', () => {
  it('applies set values and skips empty ones', () => {
    const element = document.createElement('div')
    element.style.width = '10px'

    applyStyles(element, { height: '800px', width: '' })

    expect(element.style.height).toBe('800px')
    expect(element.style.width).toBe('10px')
  })

  it('does nothing without a style', () => {
    const element = document.createElement('div')

    applyStyles(element, undefined)

    expect(element.getAttribute('style')).toBeNull()
  })
})
