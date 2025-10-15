import { FC, ReactElement, useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { useApolloClient } from '@apollo/client/react'

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
  TextFieldLocales,
} from '@island.is/web/graphql/schema'
import { useNamespace } from '@island.is/web/hooks'
import { LinkType, useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import { useI18n } from '@island.is/web/i18n'
import { LayoutProps } from '@island.is/web/layouts/main'
import { GET_CONTENT_SLUG } from '@island.is/web/screens/queries/Article'

type LanguageTogglerProps = {
  dialogId?: string
  hideWhenMobile?: boolean
  buttonColorScheme?: ButtonTypes['colorScheme']
  queryParams?: LayoutProps['languageToggleQueryParams']
  hrefOverride?: {
    is: string
    en: string
  }
}

export const LanguageToggler = ({
  hideWhenMobile,
  buttonColorScheme = 'default',
  dialogId = 'confirm-language-switch-dialog' +
    (!hideWhenMobile ? '-mobile' : ''),
  queryParams,
  hrefOverride,
}: LanguageTogglerProps) => {
  const client = useApolloClient()
  const Router = useRouter()
  const [showDialog, setShowDialog] = useState<boolean>(false)
  const { contentfulIds, resolveLinkTypeLocally, globalNamespace } =
    useContext(GlobalContext)
  const { activeLocale, locale, t } = useI18n()
  const gn = useNamespace(globalNamespace)
  const otherLanguage = (activeLocale === 'en' ? 'is' : 'en') as Locale
  const { linkResolver, typeResolver } = useLinkResolver()

  const getOtherLanguagePath = async () => {
    if (showDialog) {
      return null
    }

    if (hrefOverride?.[otherLanguage]) {
      return goToOtherLanguagePage(hrefOverride[otherLanguage])
    }

    const pathWithoutQueryParams = Router.asPath.split('?')[0]

    if (!contentfulIds?.length) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore make web strict
      const { type } = typeResolver(pathWithoutQueryParams, true)
      const pagePath = linkResolver(type, [], otherLanguage).href

      if (pagePath === '/404') {
        return setShowDialog(true)
      } else {
        const queryParamsString = new URLSearchParams(
          queryParams?.[otherLanguage],
        ).toString()
        return Router.push(
          `${pagePath}${
            queryParamsString.length > 0 ? '?' + queryParamsString : ''
          }`,
        )
      }
    }

    // Create queries that fetch slug information from Contentful
    const queries = contentfulIds
      .filter(Boolean)
      .map((id) => getContentSlug(id))

    const responses = await Promise.all(queries)

    const secondContentSlug = responses[1]?.data?.getContentSlug

    // We need to have a special case for subArticles since they've got a url field instead of a slug field
    if (secondContentSlug?.type === 'subArticle') {
      const urls = secondContentSlug?.url?.[otherLanguage].split('/')

      // Show dialog when either there is no title or there aren't at least 2 urls (for example, a valid url would be on the format: 'parental-leave/payments')
      if (
        !secondContentSlug?.title?.[otherLanguage] ||
        (urls && urls.length < 2)
      ) {
        return setShowDialog(true)
      }
      return goToOtherLanguagePage(
        linkResolver('subarticle', urls, otherLanguage).href,
      )
    }

    const slugs = []
    let title: TextFieldLocales = { is: '', en: '' }
    let type: LinkType | '' = ''
    let activeTranslations = {}

    for (const res of responses) {
      const slug = res.data?.getContentSlug?.slug
      if (!slug) {
        break
      }
      slugs.push(slug)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore make web strict
      title = res.data?.getContentSlug?.title
      type = res.data?.getContentSlug?.type as LinkType
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore make web strict
      activeTranslations = res.data?.getContentSlug?.activeTranslations
    }

    if ((type as string) === 'genericListItem' || resolveLinkTypeLocally) {
      const localType = typeResolver(pathWithoutQueryParams)?.type
      if (localType) {
        type = localType
      }
    }

    // Special case for grants since the slug is not sufficient to identify the correct page
    if ((type as string) === 'grantsplazagrant') {
      title = {
        is: 'Styrkur',
        en: 'Grant',
      }

      // We need to extract the grant ID from the current path
      const pathParts = pathWithoutQueryParams.split('/')
      const grantId = pathParts[pathParts.length - 1]
      if (grantId) {
        const queryParamsString = new URLSearchParams(
          queryParams?.[otherLanguage],
        ).toString()

        return goToOtherLanguagePage(
          `${linkResolver('grantsplazagrant', [grantId], otherLanguage).href}${
            queryParamsString.length > 0 ? '?' + queryParamsString : ''
          }`,
        )
      }
    }

    // Special case for grants since it's a custom page and doesn't have slugs or title in english
    if ((type as string) === 'grantsplazasearch') {
      title = {
        is: 'Styrkjatorg - Leit',
        en: 'Grantsplaza - Search',
      }
    }

    if ((type as string) === 'grantsplaza') {
      title = {
        is: 'Styrkjatorg',
        en: 'Grantsplaza',
      }

      return goToOtherLanguagePage(
        linkResolver('grantsplaza', [], otherLanguage).href,
      )
    }
    // Some content models are set up such that a slug is generated from the title
    // Unfortunately, Contentful generates slug for both locales which frequently
    // results in bogus english content. Therefore we check whether the other language has a title as well.

    if (
      type &&
      slugs.every((s) => s?.[otherLanguage]) &&
      title?.[otherLanguage] &&
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore make web strict
      (otherLanguage === 'is' || (activeTranslations?.[otherLanguage] ?? true))
    ) {
      const queryParamsString = new URLSearchParams(
        queryParams?.[otherLanguage],
      ).toString()

      return goToOtherLanguagePage(
        `${
          linkResolver(
            type as LinkType,
            slugs.map((s) => s[otherLanguage]),
            otherLanguage,
          ).href
        }${queryParamsString.length > 0 ? '?' : ''}${queryParamsString}`,
      )
    }

    setShowDialog(true)
  }

  const goToOtherLanguagePage = (path: string) => {
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
      title={gn('switchToEnglishModalTitle', 'Translation not available')}
      description={gn(
        'switchToEnglishModalText',
        'The page you are viewing does not have an English translation yet',
      )}
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

const ButtonElement: FC<
  React.PropsWithChildren<ButtonElementProps & ButtonProps>
> = ({
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
    data-testid="language-toggler"
    onClick={onClick}
    aria-label={otherLanguageAria}
    lang={otherLanguage === 'en' ? 'en' : 'is'}
    {...props}
  >
    {children}
  </Button>
)
