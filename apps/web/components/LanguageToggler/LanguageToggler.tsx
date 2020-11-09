import React, { FC, useContext } from 'react'
import { useRouter } from 'next/router'
import findKey from 'lodash/findKey'
import { useApolloClient } from '@apollo/client/react'
import {
  Button,
  ButtonTypes,
  Hidden,
  DialogPrompt,
} from '@island.is/island-ui/core'
import { useI18n } from '@island.is/web/i18n'
import routeNames, { PathTypes, routes } from '@island.is/web/i18n/routeNames'
import { GET_CONTENT_SLUG } from '@island.is/web/screens/queries/Article'
import { GlobalContext } from '@island.is/web/context'
import { ContentLanguage } from '@island.is/web/graphql/schema'
import { useNamespace } from '@island.is/web/hooks'
import { Modal } from '../Modal/Modal'

export const LanguageToggler: FC<{
  hideWhenMobile?: boolean
  buttonColorScheme?: ButtonTypes['colorScheme']
}> = ({ hideWhenMobile, buttonColorScheme = 'default' }) => {
  const client = useApolloClient()
  const Router = useRouter()
  const { contentfulId, globalNamespace } = useContext(GlobalContext)
  const { activeLocale, locale, t } = useI18n()
  const gn = useNamespace(globalNamespace)
  const otherLanguage = activeLocale === 'en' ? 'is' : 'en'
  const otherLanguageUrl = activeLocale === 'en' ? '/' : '/en'
  const { makePath } = routeNames(otherLanguage)

  const onClick = async () => {
    locale(t.otherLanguageCode)

    if (!contentfulId) {
      const paths = Router.pathname.split('/').filter((x) => x)

      const firstPath = paths.length
        ? paths[activeLocale === 'is' ? 0 : 1]
        : null

      if (firstPath) {
        const o = routes[activeLocale]
        const type = findKey(o, (v) => v === firstPath) as PathTypes

        if (type) {
          return Router.push(makePath(type), makePath(type))
        }
      }

      return Router.push(otherLanguageUrl, otherLanguageUrl)
    } else {
      return getContentSlug(contentfulId).then((res) => {
        const slug = res.data?.getContentSlug?.slug
        const type = res.data?.getContentSlug?.type

        if (type && slug) {
          return Router.push(makePath(type, '[slug]'), makePath(type, slug))
        }

        return Router.push(makePath(), makePath())
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

  const Disclosure = (
    <Button
      colorScheme={buttonColorScheme}
      variant="utility"
      onClick={otherLanguage === 'en' ? null : onClick}
      aria-label={t.otherLanguageAria}
      lang={otherLanguage === 'en' ? 'en' : 'is'}
      fluid
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
