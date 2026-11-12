import { FormSystemField } from '@island.is/api/schema'
import { render, screen } from '@testing-library/react'
import { ReactNode } from 'react'
import { MessageWithLink } from './MessageWithLink'

let mockLang = 'is'

jest.mock('@island.is/localization', () => ({
  useLocale: () => ({ lang: mockLang }),
}))

jest.mock('@island.is/island-ui/core', () => ({
  Box: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  Text: ({
    children,
    whiteSpace,
  }: {
    children: ReactNode
    whiteSpace?: string
  }) => (
    <p
      style={{
        whiteSpace: whiteSpace === 'breakSpaces' ? 'break-spaces' : undefined,
      }}
    >
      {children}
    </p>
  ),
  Button: ({ children }: { children: ReactNode }) => (
    <button>{children}</button>
  ),
}))

const renderMessage = (description: string) => {
  const item: FormSystemField = {
    id: 'message',
    name: { is: 'Message', en: 'Message' },
    description: {
      is: description,
      en: 'English <strong>description</strong>',
    },
  }
  return render(<MessageWithLink item={item} />)
}

beforeEach(() => {
  mockLang = 'is'
})

it('renders emphasis and strong elements, including nested formatting', () => {
  renderMessage('A <em>formatted <strong>message</strong></em>.')

  const description = screen.getByText('message')
  expect(description.tagName).toBe('STRONG')
  expect(description.parentElement?.tagName).toBe('EM')
  expect(description.parentElement?.parentElement?.textContent).toBe(
    'A formatted message.',
  )
})

it('preserves plain text and line breaks', () => {
  renderMessage('First line\nSecond line')

  expect(screen.getByText('First line Second line').textContent).toBe(
    'First line\nSecond line',
  )
})

it.each(['\n', '\n\n', '\r\n'])(
  'preserves line breaks between strong and em elements: %j',
  (separator) => {
    renderMessage(`<strong>First line</strong>${separator}<em>Second line</em>`)

    const first = screen.getByText('First line')
    const second = screen.getByText('Second line')
    const description = first.parentElement as HTMLElement
    expect(first.tagName).toBe('STRONG')
    expect(second.tagName).toBe('EM')
    expect(description.textContent).toBe(`First line${separator}Second line`)
    expect(window.getComputedStyle(description).whiteSpace).toBe('break-spaces')
  },
)

it('preserves newline-only nodes within nested formatting', () => {
  renderMessage('<strong><em>First line</em>\n<em>Second line</em></strong>')

  const strong = screen.getByText('First line').parentElement
  expect(strong?.tagName).toBe('STRONG')
  expect(strong?.textContent).toBe('First line\nSecond line')
})

it('renders the description for the selected language', () => {
  mockLang = 'en'
  renderMessage('Icelandic description')

  expect(screen.getByText('description').tagName).toBe('STRONG')
  expect(screen.queryByText('Icelandic description')).toBeNull()
})

it('removes scripts, unsupported elements, and all attributes', () => {
  const { container } = renderMessage(
    '<script>alert(1)</script><img src="x" onerror="alert(1)"><strong onclick="alert(1)" style="color:red">Safe</strong><em class="unsafe">emphasis</em><a href="javascript:alert(1)">text</a>',
  )

  expect(container.querySelector('script, img, a')).toBeNull()
  expect(container.textContent).not.toContain('alert(1)')
  expect(screen.getByText('Safe').attributes).toHaveLength(0)
  expect(screen.getByText('emphasis').attributes).toHaveLength(0)
  expect(container.textContent).toContain('text')
})
