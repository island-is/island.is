import * as s from './RegulationDisplay.css'

import React, { memo } from 'react'
import { AlertMessage, Box, Link, Text } from '@island.is/island-ui/core'

const parseSimpleMarkdown = (content: string) =>
  content
    .trim()
    .split(/\n\n+/)
    .map((text, p) => (
      <p className={s.disclaimerParagraph}>
        {text
          .trim()
          .split(/\n/)
          .map((line, i) => {
            line = line.trim()
            const children: Array<string | JSX.Element> = []
            if (i > 0) {
              children.push(<br key={i} />)
            }

            const mdLinkRe = /\[([^\]]+)\]\(((?:https:\/\/|\/)[^)]+)\)/g
            let m: RegExpExecArray | null
            let lastLastIdx = 0
            while ((m = mdLinkRe.exec(line))) {
              const key = i + '|' + m.index
              children.push(line.substring(lastLastIdx, m.index))
              children.push(
                <Link
                  key={key}
                  href={m[2]}
                  color="blue400"
                  underline="normal"
                  underlineVisibility="always"
                  pureChildren={false}
                >
                  {m[1]}
                </Link>,
              )
              lastLastIdx = mdLinkRe.lastIndex
            }
            children.push(line.substr(lastLastIdx))
            return children
          })}
      </p>
    ))

// ---------------------------------------------------------------------------

export type DisclaimerProps = {
  title: string
  content: string
}

export const Disclaimer = memo((props: DisclaimerProps) => (
  <Box marginTop={[6, 10]} className={s.disclaimer}>
    <AlertMessage
      type="info"
      title={props.title}
      message={<>{parseSimpleMarkdown(props.content)}</>}
    />
  </Box>
))
