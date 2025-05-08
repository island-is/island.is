import React, { MouseEvent } from 'react'
import { useRouter } from 'next/router'

import {
  Button,
  ButtonTypes,
  DropdownMenu,
  Hidden,
  Inline,
  Logo,
} from '@island.is/island-ui/core'
import { webLoginButtonSelect } from '@island.is/plausible'
import { ProjectBasePath } from '@island.is/shared/constants'
import { useI18n } from '@island.is/web/i18n'
import { LayoutProps } from '@island.is/web/layouts/main'

const minarsidurLink = '/minarsidur/'
const minarsidurDelegationsLink = '/bff/login?prompt=select_account'

interface Props {
  colorScheme: ButtonTypes['colorScheme']
  topItem?: LayoutProps['customTopLoginButtonItem']
  type?: 'dropdown' | 'link'
}

function LoginButtonDropdown(props: Props) {
  const { t } = useI18n()
  const router = useRouter()

  function trackAndNavigate(
    buttonType: 'Dropdown - Individuals' | 'Dropdown - Companies' | string,
    event: MouseEvent<HTMLAnchorElement>,
  ) {
    event.preventDefault()
    const href = event.currentTarget.href

    // If the plausible script is not loaded (For example in case of adBlocker) the user will be navigated directly to /minarsidur.
    if (window?.plausible) {
      // In case the script is there, but the event is not firing (different adBlock settings) then the user is navigated without Plausible callback.
      const id = window.setTimeout(() => {
        window.location.assign(href)
      }, 500)

      // The plausible custom event.
      webLoginButtonSelect(buttonType, () => {
        window.clearTimeout(id)
        window.location.assign(href)
      })
    } else {
      window.location.assign(href)
    }
  }

  const items = [
    {
      href: minarsidurLink,
      title: (
        <Inline alignY="center" space={1} flexWrap="nowrap">
          {props.topItem && (
            <Logo
              width={17}
              height={17}
              iconOnly={true}
              id="minar-sidur-individuals"
              solid={false}
            />
          )}
          {t.loginIndividuals}
        </Inline>
      ),
      onClick: trackAndNavigate.bind(null, 'Dropdown - Individuals'),
    },
    {
      href: minarsidurDelegationsLink,
      title: (
        <Inline alignY="center" space={1} flexWrap="nowrap">
          {props.topItem && (
            <Logo
              width={17}
              height={17}
              iconOnly={true}
              id="minar-sidur-companies"
              solid={false}
            />
          )}
          {t.loginDelegations}
        </Inline>
      ),
      onClick: trackAndNavigate.bind(null, 'Dropdown - Companies'),
    },
  ]

  if (
    props.topItem &&
    !props.topItem.blacklistedPathnames?.includes(
      new URL(router.asPath, 'https://island.is').pathname,
    )
  ) {
    items.unshift({
      href: props.topItem.href,
      title: (
        <Inline alignY="center" space={1} flexWrap="nowrap">
          {props.topItem.imgSrc && (
            <img width={17} height={17} src={props.topItem.imgSrc} alt="" />
          )}
          {props.topItem.label}
        </Inline>
      ),
      onClick: trackAndNavigate.bind(null, props.topItem.buttonType),
    })
  }

  return (
    <>
      <Hidden above="sm">
        <DropdownMenu
          fixed
          disclosure={
            <Button
              colorScheme={props.colorScheme}
              variant="utility"
              icon="person"
              title={t.login}
            />
          }
          openOnHover={false}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore make web strict
          items={items}
        />
      </Hidden>
      <Hidden below="md">
        <DropdownMenu
          fixed
          disclosure={
            <Button
              colorScheme={props.colorScheme}
              variant="utility"
              icon="person"
            >
              {t.login}
            </Button>
          }
          openOnHover={true}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore make web strict
          items={items}
        />
      </Hidden>
    </>
  )
}

const LoginButtonLink = (props: Props) => {
  const { t } = useI18n()

  return (
    <>
      <Hidden above="sm">
        <a href={ProjectBasePath.ServicePortal} tabIndex={-1}>
          <Button
            colorScheme={props.colorScheme}
            variant="utility"
            icon="person"
            title={t.login}
            as="span"
          />
        </a>
      </Hidden>
      <Hidden below="md">
        <a href={ProjectBasePath.ServicePortal} tabIndex={-1}>
          <Button
            colorScheme={props.colorScheme}
            variant="utility"
            icon="person"
            as="span"
          >
            {t.login}
          </Button>
        </a>
      </Hidden>
    </>
  )
}

export const LoginButton = (props: Props) => {
  if (props.type === 'link') return <LoginButtonLink {...props} />
  return <LoginButtonDropdown {...props} />
}
