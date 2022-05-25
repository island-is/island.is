import React, { ReactNode, Fragment, useEffect } from 'react'
import { ErrorPageQuery } from '@island.is/web/graphql/schema'
import { Text, Box, GridRow, GridColumn } from '@island.is/island-ui/core'
import { GridContainer } from '@island.is/web/components'
import { Slice as SliceType, richText } from '@island.is/island-ui/contentful'
import { Document } from '@contentful/rich-text-types'
import { useRouter } from 'next/router'
import { nlToBr } from '@island.is/web/utils/nlToBr'

type MessageType = {
  title: string
  description?: { __typename: 'Html'; id: string; document: Document }
  body?: string
}

const formatBody = (body: string, path: string): ReactNode =>
  body.split('{PATH}').map((s, i) => (
    <Fragment key={i}>
      {i > 0 && <i>{path}</i>}
      {nlToBr(s)}
    </Fragment>
  ))

const fallbackMessage = {
  404: {
    title: 'Síða eða skjal fannst ekki',
    body:
      'Ekkert fannst á slóðinni {PATH}. Mögulega hefur síðan verið fjarlægð eða færð til. Þú getur byrjað aftur frá forsíðu eða notað leitina til að finna upplýsingar.',
  },
  500: {
    title: 'Afsakið hlé.',
    body:
      'Eitthvað fór úrskeiðis.\nVillan hefur verið skráð og unnið verður að viðgerð eins fljótt og auðið er.',
  },
}

interface ErrorProps {
  errPage?: ErrorPageQuery['getErrorPage']
  statusCode: number
}

export const ErrorPage: React.FC<ErrorProps> = ({ errPage, statusCode }) => {
  const { asPath } = useRouter()

  const errorMessages: MessageType = errPage
    ? {
        ...errPage,
      }
    : fallbackMessage[statusCode]

  // Temporary "fix", see https://github.com/vercel/next.js/issues/16931 for details
  useEffect(() => {
    const els = document.querySelectorAll('link[href*=".css"]')
    Array.prototype.forEach.call(els, (el) => {
      el.setAttribute('rel', 'stylesheet')
    })
  }, [])

  return (
    <GridContainer>
      <GridRow>
        <GridColumn span={'12/12'} paddingBottom={10} paddingTop={8}>
          <Box
            display="flex"
            flexDirection="column"
            width="full"
            alignItems="center"
          >
            <Text
              variant="eyebrow"
              as="div"
              paddingBottom={2}
              color="purple400"
            >
              {statusCode}
            </Text>
            <Text variant="h1" as="h1" paddingBottom={3}>
              {errorMessages.title}
            </Text>
            <Text variant="intro" as="p">
              {errorMessages.description
                ? richText([errorMessages.description] as SliceType[])
                : formatBody(errorMessages.body, asPath)}
            </Text>
          </Box>
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}

export default ErrorPage
