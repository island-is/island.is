import { fireEvent, render, screen } from '@testing-library/react'

import Stackable from './Stackable'

const items = ['First', 'Second', 'Third', 'Fourth']

const renderStackable = (props = {}) =>
  render(
    <Stackable {...props}>
      {items.map((item) => (
        <div key={item}>{item}</div>
      ))}
    </Stackable>,
  )

const getToggle = () => screen.getByRole('button')

const getHiddenItems = () =>
  items.filter((item) => screen.queryByText(item)?.closest('[aria-hidden]'))

describe('Stackable', () => {
  test('should render every child', () => {
    renderStackable()

    items.forEach((item) => {
      expect(screen.getByText(item)).toBeInTheDocument()
    })
  })

  test('should render nothing without children', () => {
    const { container } = render(<Stackable>{null}</Stackable>)

    expect(container).toBeEmptyDOMElement()
  })

  test('should stack children passed inside a fragment', () => {
    render(
      <Stackable>
        <>
          <div>First</div>
          <div>Second</div>
        </>
      </Stackable>,
    )

    expect(getToggle()).toHaveAttribute('aria-expanded', 'false')
    expect(getHiddenItems()).toEqual(['Second'])
  })

  test('should render a single child as-is without a toggle', () => {
    render(
      <Stackable>
        <div>Only child</div>
      </Stackable>,
    )

    expect(screen.getByText('Only child')).toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  test('should start collapsed with only the first child exposed', () => {
    renderStackable()

    expect(getToggle()).toHaveAttribute('aria-expanded', 'false')
    expect(getToggle()).toHaveTextContent('Sýna allt')
    expect(getHiddenItems()).toEqual(['Second', 'Third', 'Fourth'])
  })

  test('should expand and collapse with the toggle button', () => {
    renderStackable()

    fireEvent.click(getToggle())

    expect(getToggle()).toHaveAttribute('aria-expanded', 'true')
    expect(getToggle()).toHaveTextContent('Stafla')
    expect(getHiddenItems()).toEqual([])

    fireEvent.click(getToggle())

    expect(getToggle()).toHaveAttribute('aria-expanded', 'false')
    expect(getHiddenItems()).toEqual(['Second', 'Third', 'Fourth'])
  })

  test('should use custom labels', () => {
    renderStackable({ expandLabel: 'Sýna allar', collapseLabel: 'Fela' })

    expect(getToggle()).toHaveTextContent('Sýna allar')

    fireEvent.click(getToggle())

    expect(getToggle()).toHaveTextContent('Fela')
  })

  test('should link the toggle to the pile it controls', () => {
    renderStackable()

    const pileId = getToggle().getAttribute('aria-controls')

    expect(pileId).toBeTruthy()
    expect(document.getElementById(pileId ?? '')).toContainElement(
      screen.getByText('First'),
    )
  })

  test('should expand when the collapsed pile is clicked', () => {
    renderStackable()

    // The overlay is the only button hidden from the accessibility tree.
    fireEvent.click(screen.getByRole('button', { hidden: true, name: '' }))

    expect(getToggle()).toHaveAttribute('aria-expanded', 'true')
  })

  test('should not cover the items with an expand target once expanded', () => {
    renderStackable({ defaultExpanded: true })

    expect(screen.getAllByRole('button', { hidden: true })).toHaveLength(1)
  })

  test('should respect defaultExpanded', () => {
    renderStackable({ defaultExpanded: true })

    expect(getToggle()).toHaveAttribute('aria-expanded', 'true')
    expect(getHiddenItems()).toEqual([])
  })

  test('should support being controlled', () => {
    const onExpandedChange = jest.fn()
    const renderControlled = (expanded: boolean) => (
      <Stackable expanded={expanded} onExpandedChange={onExpandedChange}>
        <div>First</div>
        <div>Second</div>
      </Stackable>
    )
    const { rerender } = render(renderControlled(false))

    fireEvent.click(getToggle())

    expect(onExpandedChange).toHaveBeenCalledWith(true)
    // Still collapsed until the owner updates the prop.
    expect(getToggle()).toHaveAttribute('aria-expanded', 'false')

    rerender(renderControlled(true))

    expect(getToggle()).toHaveAttribute('aria-expanded', 'true')
    expect(getHiddenItems()).toEqual([])
  })
})
