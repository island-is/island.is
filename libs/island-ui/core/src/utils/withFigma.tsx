import React, { FC } from 'react'
import Markdown from 'markdown-to-jsx'
import { styled } from '@storybook/theming'

const markdown = (name = 'this component') => {
  return `See *${name}* in the [@islandis](https://www.figma.com/@islandis) community Figma. [Desktop](https://www.figma.com/community/file/901454156629060149) — [Mobile](https://www.figma.com/community/file/901454279005592118)`
}

// Based on internal storybook <P/> and <A/> components
const P = styled.p(() => ({
  fontFamily: 'inherit',
  '-webkit-font-smoothing': 'antialiased',
  '-webkit-tap-highlight-color': 'rgba(0, 0, 0, 0)',
  margin: '16px 0px',
  fontSize: '14px',
  lineHeight: '24px',
  color: 'rgb(51, 51, 51)',
  padding: '0.75em 1em',
  borderRadius: '6px',
  backgroundColor: '#fff',
}))

const A = styled.a(() => ({
  fontFamily: 'inherit',
  margin: 0,
  '-webkit-font-smoothing': 'antialiased',
  '-webkit-tap-highlight-color': 'rgba(0, 0, 0, 0)',
  fontSize: 'inherit',
  lineHeight: '24px',
  color: 'rgb(30, 167, 253)',
  textDecoration: 'none',
}))

export const DescriptionFigma: FC<{ name: string }> = ({ name }) => (
  <P>
    <Markdown
      options={{
        overrides: {
          a: ({ href, target, children }) => (
            <A href={href} target={target} className="sbdocs-a">
              {children}
            </A>
          ),
        },
      }}
    >
      {markdown(name)}
    </Markdown>
  </P>
)

export const withFigma = (name: string) => {
  return {
    docs: { description: { component: markdown(name) } },
  }
}
