import React, { ReactNode, Fragment, useEffect, useRef } from 'react'
import {
  Text,
  Box,
  GridContainer,
  GridRow,
  GridColumn,
} from '@island.is/island-ui/core'
import { Slice as SliceType, richText } from '@island.is/island-ui/contentful'
import { Document } from '@contentful/rich-text-types'
import { useRouter } from 'next/router'
import { nlToBr } from '@island.is/web/utils/nlToBr'
import {
  GetUrlQuery,
  QueryGetUrlArgs,
  ErrorPageQuery,
  QueryGetErrorPageArgs,
} from '@island.is/web/graphql/schema'
import { useQuery } from '@apollo/client'
import { GET_ERROR_PAGE, GET_URL_QUERY } from '../queries'
import { getLocaleFromPath } from '@island.is/web/i18n'
import { LinkType, useLinkResolver } from '@island.is/web/hooks'

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

export const ErrorPage: React.FC<ErrorProps> = ({ statusCode }) => {
  const { asPath, push } = useRouter()
  const activeLocale = getLocaleFromPath(asPath)
  const isRedirecting = useRef(false)
  const { linkResolver } = useLinkResolver()

  const { data: urlData, loading: urlDataLoading } = useQuery<
    GetUrlQuery,
    QueryGetUrlArgs
  >(GET_URL_QUERY, {
    variables: {
      input: {
        slug: asPath,
        lang: activeLocale,
      },
    },
  })

  const { data: errorPageData, loading: errorPageDataLoading } = useQuery<
    ErrorPageQuery,
    QueryGetErrorPageArgs
  >(GET_ERROR_PAGE, {
    variables: {
      input: {
        lang: activeLocale,
        errorCode: statusCode?.toString() ?? '500',
      },
    },
  })

  const errorMessages: MessageType = errorPageData?.getErrorPage
    ? {
        ...errorPageData.getErrorPage,
      }
    : fallbackMessage[statusCode]

  // Temporary "fix", see https://github.com/vercel/next.js/issues/16931 for details
  useEffect(() => {
    const els = document.querySelectorAll('link[href*=".css"]')
    Array.prototype.forEach.call(els, (el) => {
      el.setAttribute('rel', 'stylesheet')
    })
  }, [])

  if (statusCode === 404) {
    if (urlDataLoading) {
      return null
    }

    if (urlData?.getUrl) {
      const page = urlData.getUrl?.page
      const explicitRedirect = urlData.getUrl?.explicitRedirect

      if (!page && explicitRedirect) {
        if (!isRedirecting.current) {
          isRedirecting.current = true
          push(explicitRedirect)
        }
      } else if (page) {
        if (!isRedirecting.current) {
          isRedirecting.current = true
          push(linkResolver(page.type as LinkType, [page.slug]).href)
        }
      }

      if (isRedirecting.current) {
        return null
      }
    }
  }

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
            {!errorPageDataLoading && (
              <>
                <Text variant="h1" as="h1" paddingBottom={3}>
                  {errorMessages.title}
                </Text>
                <Text variant="intro" as="div">
                  {errorMessages.description
                    ? richText([errorMessages.description] as SliceType[])
                    : formatBody(errorMessages.body, asPath)}
                </Text>
              </>
            )}
          </Box>
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}

export default ErrorPage
