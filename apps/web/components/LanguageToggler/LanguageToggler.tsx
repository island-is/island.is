import React, { useContext, ReactElement, useEffect, useState, FC } from 'react'
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
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const [isChecking, setIsChecking] = useState<boolean>(false)
  const [show, setShow] = useState<boolean>(true)
  const [pagePath, setPagePath] = useState<string>('')
  const { contentfulId, globalNamespace } = useContext(GlobalContext)
  const { activeLocale, locale, t } = useI18n()
  const gn = useNamespace(globalNamespace)
  const otherLanguage = (activeLocale === 'en' ? 'is' : 'en') as Locale
  const { linkResolver, typeResolver } = useLinkResolver()

  const getOtherLanguagePath = async () => {
    setIsChecking(true)
    locale(t.otherLanguageCode)

    if (!contentfulId) {
      const { type } = typeResolver(Router.asPath.split('?')[0], true)

      console.log('here1')

      setPagePath(
        pagePath === '/404'
          ? linkResolver('homepage').href
          : linkResolver(type, [], otherLanguage).href,
      )
    } else {
      await getContentSlug(contentfulId).then((res) => {
        const slug = res.data?.getContentSlug?.slug
        const type = res.data?.getContentSlug?.type

        console.log('here2', slug, type)

        setPagePath(
          type && slug
            ? linkResolver(type, [slug], otherLanguage).href
            : linkResolver('homepage', [], otherLanguage).href,
        )
      })
    }

    setIsChecking(false)
  }

  const onClick = async () => {
    await getOtherLanguagePath()
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

  const onVisibilityChange = (visibility: boolean) => {
    setIsVisible(visibility)
  }

  useEffect(() => {
    console.log(isVisible)
  }, [isVisible])

  useEffect(() => {
    console.log(pagePath)
  }, [pagePath])

  const buttonElementProps: ButtonElementProps = {
    buttonColorScheme,
    otherLanguage,
    otherLanguageAria: t.otherLanguageAria,
    onClick,
  }

  const Disclosure: ReactElement = (
    <ButtonElement {...buttonElementProps}>{t.otherLanguageName}</ButtonElement>
  )

  const LanguageButton =
    otherLanguage === 'en' ? (
      <DialogPrompt
        baseId={dialogId}
        title={gn('switchToEnglishModalTitle')}
        description={gn('switchToEnglishModalText')}
        ariaLabel="Confirm switching to english"
        disclosureElement={Disclosure}
        onVisibilityChange={onVisibilityChange}
        onConfirm={onClick}
        buttonTextConfirm="Confirm"
        buttonTextCancel="Cancel"
      />
    ) : show ? (
      Disclosure
    ) : (
      <ButtonElement {...buttonElementProps}>X</ButtonElement>
    )

  return !hideWhenMobile ? (
    LanguageButton
  ) : (
    <Hidden below="md">{LanguageButton}</Hidden>
  )
}

type ButtonElementProps = {
  buttonColorScheme?: ButtonTypes['colorScheme']
  otherLanguage: Locale
  otherLanguageAria: string
  onClick: () => void
}

const ButtonElement: FC<ButtonElementProps> = ({
  buttonColorScheme = 'default',
  otherLanguage,
  otherLanguageAria,
  onClick,
  children,
}) => (
  <Button
    colorScheme={buttonColorScheme}
    variant="utility"
    onClick={onClick}
    aria-label={otherLanguageAria}
    lang={otherLanguage === 'en' ? 'en' : 'is'}
  >
    {children}
  </Button>
)
