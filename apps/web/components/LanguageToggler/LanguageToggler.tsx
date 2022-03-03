import React, { FC,ReactElement, useContext, useState } from 'react'
import { useApolloClient } from '@apollo/client/react'
import { useRouter } from 'next/router'

import {
  Button,
  ButtonProps,
  ButtonTypes,
  DialogPrompt,
  Hidden,
} from '@island.is/island-ui/core'
import { Locale } from '@island.is/shared/types'
import { GlobalContext } from '@island.is/web/context'
import {
  GetContentSlugQuery,
  GetContentSlugQueryVariables,
} from '@island.is/web/graphql/schema'
import { useNamespace } from '@island.is/web/hooks'
import { LinkType,useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import { useI18n } from '@island.is/web/i18n'
import { GET_CONTENT_SLUG } from '@island.is/web/screens/queries/Article'

type LanguageTogglerProps = {
  dialogId?: string
  hideWhenMobile?: boolean
  buttonColorScheme?: ButtonTypes['colorScheme']
}

export const LanguageToggler = ({
  hideWhenMobile,
  buttonColorScheme = 'default',
  dialogId = 'confirm-language-switch-dialog' +
    (!hideWhenMobile ? '-mobile' : ''),
}: LanguageTogglerProps) => {
  const client = useApolloClient()
  const Router = useRouter()
  const [showDialog, setShowDialog] = useState<boolean>(false)
  const {
    pageContentfulId,
    subpageContentfulId,
    resolveLinkTypeLocally,
    globalNamespace,
  } = useContext(GlobalContext)
  const { activeLocale, locale, t } = useI18n()
  const gn = useNamespace(globalNamespace)
  const otherLanguage = (activeLocale === 'en' ? 'is' : 'en') as Locale
  const { linkResolver, typeResolver } = useLinkResolver()

  const getOtherLanguagePath = async () => {
    if (showDialog) {
      return null
    }

    const pathWithoutQueryParams = Router.asPath.split('?')[0]

    if (!pageContentfulId) {
      const { type } = typeResolver(pathWithoutQueryParams, true)
      const pagePath = linkResolver(type, [], otherLanguage).href

      if (pagePath === '/404') {
        return setShowDialog(true)
      } else {
        return Router.push(pagePath)
      }
    }

    // Create queries that fetch slug information from Contentful
    const queries = [pageContentfulId, subpageContentfulId]
      .filter(Boolean)
      .map((id) => getContentSlug(id))

    const responses = await Promise.all(queries)

    const slugs = []
    let index = 0

    for (const res of responses) {
      const slug = res.data?.getContentSlug?.slug

      if (!slug) {
        break
      }

      slugs.push(slug)

      index += 1
      const atLastResponse = index === responses.length
      if (!atLastResponse) continue

      const title = res.data?.getContentSlug?.title
      let type = res.data?.getContentSlug?.type as LinkType

      if (resolveLinkTypeLocally) {
        type = typeResolver(pathWithoutQueryParams).type
      }

      // Some content models are set up such that a slug is generated from the title
      // Unfortunately, Contentful generates slug for both locales which frequently
      // results in bogus english content. Therefore we check whether the other language has a title as well.
      if (
        type &&
        slugs.every((s) => s?.[otherLanguage]) &&
        title?.[otherLanguage]
      ) {
        return goToOtherLanguagePage(
          linkResolver(
            type,
            slugs.map((s) => s[otherLanguage]),
            otherLanguage,
          ).href,
        )
      }
    }

    setShowDialog(true)
  }

  const goToOtherLanguagePage = (path) => {
    locale(t.otherLanguageCode)
    Router.push(path)
  }

  const onClick = async () => {
    await getOtherLanguagePath()
  }

  const getContentSlug = async (contentfulId: string) => {
    return client.query<GetContentSlugQuery, GetContentSlugQueryVariables>({
      query: GET_CONTENT_SLUG,
      variables: {
        input: {
          id: contentfulId as string,
        },
      },
    })
  }

  const buttonElementProps: ButtonElementProps = {
    buttonColorScheme,
    otherLanguage,
    otherLanguageAria: t.otherLanguageAria,
    onClick,
  }

  const Disclosure: ReactElement = (
    <ButtonElement {...buttonElementProps}>{t.otherLanguageName}</ButtonElement>
  )

  const Dialog = (
    <DialogPrompt
      baseId={dialogId}
      initialVisibility={true}
      title={gn('switchToEnglishModalTitle')}
      description={gn('switchToEnglishModalText')}
      ariaLabel="Confirm switching to english"
      disclosureElement={Disclosure}
      onConfirm={() => {
        goToOtherLanguagePage(linkResolver('homepage', [], otherLanguage).href)
      }}
      buttonTextConfirm="Go to home page"
      buttonTextCancel="Keep viewing"
    />
  )

  const Content = showDialog ? Dialog : Disclosure

  return !hideWhenMobile ? Content : <Hidden below="md">{Content}</Hidden>
}

type ButtonElementProps = {
  buttonColorScheme?: ButtonTypes['colorScheme']
  otherLanguage: Locale
  otherLanguageAria: string
  onClick: () => void
}

const ButtonElement: FC<ButtonElementProps & ButtonProps> = ({
  buttonColorScheme = 'default',
  otherLanguage,
  otherLanguageAria,
  onClick,
  children,
  ...props
}) => (
  <Button
    colorScheme={buttonColorScheme}
    variant="utility"
    onClick={onClick}
    aria-label={otherLanguageAria}
    lang={otherLanguage === 'en' ? 'en' : 'is'}
    {...props}
  >
    {children}
  </Button>
)
