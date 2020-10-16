import React, { FC } from 'react'
import Markdown from 'markdown-to-jsx'
import { styled } from '@storybook/theming'

interface Links {
  desktop?: string
  mobile?: string
}

const markdown = (links: Links) => {
  const desktop = links.desktop
    ? `[Desktop design in Figma](${links.desktop})`
    : ''
  const mobile = links.mobile ? `[Mobile design in Figma](${links.mobile})` : ''
  const dash = links.desktop && links.mobile ? ' — ' : ''

  if (!links.desktop && !links.mobile) {
    return ``
  }

  return `${desktop}${dash}${mobile}`
}

export const withFigma = (links: Links) => {
  const design = []
  const component = markdown(links)

  if (links.desktop) {
    design.push({
      name: 'Desktop',
      type: 'figma',
      url: links.desktop,
    })
  }

  if (links.mobile) {
    design.push({
      name: 'Mobile',
      type: 'figma',
      url: links.mobile,
    })
  }

  return {
    docs: { description: { component } },
    design,
  }
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
  backgroundColor: '#f8f8f8',
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

export const DescriptionFigma: FC<{ links: Links }> = ({ links }) => (
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
      {markdown(links)}
    </Markdown>
  </P>
)
