import React, { Fragment, ReactNode } from 'react'
import { useRouter } from 'next/router'
import { Document } from '@contentful/rich-text-types'

import { richText, Slice as SliceType } from '@island.is/island-ui/contentful'
import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import { ErrorPageQuery } from '@island.is/web/graphql/schema'
import { nlToBr } from '@island.is/web/utils/nlToBr'

type MessageType = {
  title: string
  description?: { __typename: 'Html'; id: string; document: Document }
  body?: string
}

const formatBody = (body: string, path: string): ReactNode =>
  body?.split('{PATH}').map((s, i) => (
    <Fragment key={i}>
      {i > 0 && <i>{path}</i>}
      {nlToBr(s)}
    </Fragment>
  ))

const fallbackMessage = {
  404: {
    title: 'Síða eða skjal fannst ekki',
    body: 'Ekkert fannst á slóðinni {PATH}. Mögulega hefur síðan verið fjarlægð eða færð til. Þú getur byrjað aftur frá forsíðu eða notað leitina til að finna upplýsingar.',
  },
  500: {
    title: 'Afsakið hlé.',
    body: 'Eitthvað fór úrskeiðis.\nVillan hefur verið skráð og unnið verður að viðgerð eins fljótt og auðið er.',
  },
}

interface ErrorProps {
  errPage?: ErrorPageQuery['getErrorPage']
  statusCode: number
}

export const ErrorScreen: React.FC<ErrorProps> = ({ statusCode, errPage }) => {
  const { asPath } = useRouter()

  const errorMessages: MessageType = errPage
    ? {
        ...errPage,
      }
    : // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore make web strict
      fallbackMessage[statusCode]

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
            {errorMessages?.title && (
              <>
                <Text variant="h1" as="h1" paddingBottom={3}>
                  {errorMessages.title}
                </Text>
                <Text variant="intro" as="div">
                  {errorMessages.description
                    ? richText([errorMessages.description] as SliceType[])
                    : // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore make web strict
                      formatBody(errorMessages.body, asPath)}
                </Text>
              </>
            )}
          </Box>
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}

export default ErrorScreen
