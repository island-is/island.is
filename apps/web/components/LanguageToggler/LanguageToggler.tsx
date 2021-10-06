import React, { useContext, ReactElement } from 'react'
import { useRouter } from 'next/router'
import { useApolloClient } from '@apollo/client/react'
import {
  Button,
  ButtonTypes,
  Hidden,
  DialogPrompt,
} from '@island.is/island-ui/core'
import { useI18n } from '@island.is/web/i18n'
import { Locale } from '@island.is/shared/types'
import { GET_CONTENT_SLUG } from '@island.is/web/screens/queries/Article'
import { GlobalContext } from '@island.is/web/context'
import { ContentLanguage } from '@island.is/web/graphql/schema'
import { useNamespace } from '@island.is/web/hooks'
import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'

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
  const { contentfulId, globalNamespace } = useContext(GlobalContext)
  const { activeLocale, locale, t } = useI18n()
  const gn = useNamespace(globalNamespace)
  const otherLanguage = (activeLocale === 'en' ? 'is' : 'en') as Locale
  const { linkResolver, typeResolver } = useLinkResolver()

  const onClick = async () => {
    locale(t.otherLanguageCode)

    if (!contentfulId) {
      const { type } = typeResolver(Router.asPath.split('?')[0], true)
      const pagePath = linkResolver(type, [], otherLanguage).href
      if (pagePath === '/404') {
        // if we can't resolve the path go to homepage
        return Router.push(linkResolver('homepage').href)
      } else {
        // go to the resolved path if able
        return Router.push(pagePath)
      }
    } else {
      return getContentSlug(contentfulId).then((res) => {
        const slug = res.data?.getContentSlug?.slug
        const type = res.data?.getContentSlug?.type

        if (type && slug) {
          return Router.push(linkResolver(type, [slug], otherLanguage).href)
        }

        return Router.push(linkResolver('homepage').href)
      })
    }
  }

  const getContentSlug = async (contentfulId: string) => {
    return client.query({
      query: GET_CONTENT_SLUG,
      variables: {
        input: {
          id: contentfulId as string,
          lang: otherLanguage as ContentLanguage,
        },
      },
    })
  }

  const Disclosure: ReactElement = (
    <Button
      colorScheme={buttonColorScheme}
      variant="utility"
      onClick={otherLanguage === 'en' ? null : onClick}
      aria-label={t.otherLanguageAria}
      lang={otherLanguage === 'en' ? 'en' : 'is'}
    >
      {t.otherLanguageName}
    </Button>
  )

  const LanguageButton =
    otherLanguage === 'en' ? (
      <DialogPrompt
        baseId={dialogId}
        title={gn('switchToEnglishModalTitle')}
        description={gn('switchToEnglishModalText')}
        ariaLabel="Confirm switching to english"
        disclosureElement={Disclosure}
        onConfirm={onClick}
        buttonTextConfirm="Confirm"
        buttonTextCancel="Cancel"
      />
    ) : (
      Disclosure
    )

  return !hideWhenMobile ? (
    LanguageButton
  ) : (
    <Hidden below="md">{LanguageButton}</Hidden>
  )
}
