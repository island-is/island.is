import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react'
import { useState } from 'react'
import { PreviewViewport } from './PreviewViewport'

jest.mock('../PreviewStepOrGroup.css', () => ({
  viewport: 'desktop-viewport',
  mobileViewport: 'mobile-viewport',
}))

const PreviewInput = () => {
  const [value, setValue] = useState('')
  return (
    <input
      aria-label="Preview value"
      value={value}
      onChange={(event) => setValue(event.target.value)}
    />
  )
}

it('keeps the iframe and its input state when changing viewport and language', () => {
  const { rerender } = render(
    <PreviewViewport mobile={false} title="Preview" lang="is">
      <PreviewInput />
    </PreviewViewport>,
  )
  const frame = screen.getByTitle<HTMLIFrameElement>('Preview')
  fireEvent.load(frame)
  const frameDocument = frame.contentDocument
  if (!frameDocument) throw new Error('Missing iframe document')
  const input = within(frameDocument.body).getByRole('textbox')
  fireEvent.change(input, { target: { value: 'Preserved value' } })

  rerender(
    <PreviewViewport mobile title="Preview" lang="en">
      <PreviewInput />
    </PreviewViewport>,
  )

  expect(screen.getByTitle('Preview')).toBe(frame)
  expect(frame.className).toBe('mobile-viewport')
  expect(frameDocument.documentElement.lang).toBe('en')
  expect(input).toHaveProperty('value', 'Preserved value')

  rerender(
    <PreviewViewport mobile={false} title="Preview" lang="en">
      <PreviewInput />
    </PreviewViewport>,
  )
  expect(frame.className).toBe('desktop-viewport')
  expect(within(frameDocument.body).getByRole('textbox')).toBe(input)
})

it('copies responsive styles into the iframe and tracks stylesheet updates', async () => {
  const stylesheet = document.createElement('style')
  stylesheet.textContent = '@media (max-width: 767px) { body { color: red; } }'
  document.head.appendChild(stylesheet)

  const { unmount } = render(
    <PreviewViewport mobile title="Preview" lang="is">
      <PreviewInput />
    </PreviewViewport>,
  )
  const frame = screen.getByTitle<HTMLIFrameElement>('Preview')
  fireEvent.load(frame)
  const frameDocument = frame.contentDocument
  if (!frameDocument) throw new Error('Missing iframe document')

  try {
    expect(frameDocument.head.textContent).toContain(stylesheet.textContent)
    stylesheet.textContent =
      '@media (max-width: 767px) { body { color: blue; } }'
    await waitFor(() =>
      expect(frameDocument.head.textContent).toContain(stylesheet.textContent),
    )
  } finally {
    unmount()
    stylesheet.remove()
  }
})
