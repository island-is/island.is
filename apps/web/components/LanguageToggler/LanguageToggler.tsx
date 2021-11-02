import React, { useContext, ReactElement, useState, FC } from 'react'
import { useRouter } from 'next/router'
import { useApolloClient } from '@apollo/client/react'
import {
  Button,
  ButtonTypes,
  Hidden,
  DialogPrompt,
  ButtonProps,
} from '@island.is/island-ui/core'
import { useI18n } from '@island.is/web/i18n'
import { Locale } from '@island.is/shared/types'
import { GET_CONTENT_SLUG } from '@island.is/web/screens/queries/Article'
import { GlobalContext } from '@island.is/web/context'
import {
  GetContentSlugQuery,
  GetContentSlugQueryVariables,
} from '@island.is/web/graphql/schema'
import { useNamespace } from '@island.is/web/hooks'
import { useLinkResolver, LinkType } from '@island.is/web/hooks/useLinkResolver'

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
  const { contentfulId, globalNamespace } = useContext(GlobalContext)
  const { activeLocale, locale, t } = useI18n()
  const gn = useNamespace(globalNamespace)
  const otherLanguage = (activeLocale === 'en' ? 'is' : 'en') as Locale
  const { linkResolver, typeResolver } = useLinkResolver()

  const getOtherLanguagePath = async () => {
    if (showDialog) {
      return null
    }

    if (!contentfulId) {
      const { type } = typeResolver(Router.asPath.split('?')[0], true)
      const pagePath = linkResolver(type, [], otherLanguage).href

      if (pagePath === '/404') {
        return setShowDialog(true)
      } else {
        return Router.push(pagePath)
      }
    } else {
      await getContentSlug(contentfulId).then((res) => {
        const slug = res.data?.getContentSlug?.slug
        const type = res.data?.getContentSlug?.type as LinkType

        if (type && slug?.[otherLanguage]) {
          return goToOtherLanguagePage(
            linkResolver(type, [slug[otherLanguage]], otherLanguage).href,
          )
        }

        setShowDialog(true)
      })
    }
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
