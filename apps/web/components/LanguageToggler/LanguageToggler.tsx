import React, { FC, useContext, ReactElement } from 'react'
import { useRouter } from 'next/router'
import { useApolloClient } from '@apollo/client/react'
import {
  Button,
  ButtonTypes,
  Hidden,
  DialogPrompt,
} from '@island.is/island-ui/core'
import { useI18n } from '@island.is/web/i18n'
import { Locale } from '@island.is/web/i18n/I18n'
import { GET_CONTENT_SLUG } from '@island.is/web/screens/queries/Article'
import { GlobalContext } from '@island.is/web/context'
import { ContentLanguage } from '@island.is/web/graphql/schema'
import { useNamespace } from '@island.is/web/hooks'
import { useLinkResolver } from 'apps/web/hooks/useLinkResolver'

export const LanguageToggler: FC<{
  hideWhenMobile?: boolean
  buttonColorScheme?: ButtonTypes['colorScheme']
}> = ({ hideWhenMobile, buttonColorScheme = 'default' }) => {
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
      return Router.push(
        linkResolver(type, [], otherLanguage).href,
        linkResolver(type, [], otherLanguage).as,
      )
    } else {
      return getContentSlug(contentfulId).then((res) => {
        const slug = res.data?.getContentSlug?.slug
        const type = res.data?.getContentSlug?.type

        if (type && slug) {
          return Router.push(
            linkResolver(type, [slug], otherLanguage).href,
            linkResolver(type, [slug], otherLanguage).as,
          )
        }

        return Router.push(
          linkResolver('homepage').href,
          linkResolver('homepage').as,
        )
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

  const LanguageButtonId =
    'confirm-language-switch-dialog' + (!hideWhenMobile ? '-mobile' : '')
  const LanguageButton = (
    <>
      {otherLanguage === 'en' ? (
        <DialogPrompt
          baseId={LanguageButtonId}
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
      )}
    </>
  )

  return !hideWhenMobile ? (
    LanguageButton
  ) : (
    <Hidden below="md">{LanguageButton}</Hidden>
  )
}
