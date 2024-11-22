import React, { MouseEvent } from 'react'

import {
  Box,
  Button,
  ButtonTypes,
  DropdownMenu,
  Hidden,
  Inline,
} from '@island.is/island-ui/core'
import { webLoginButtonSelect } from '@island.is/plausible'
import { useI18n } from '@island.is/web/i18n'
import { LayoutProps } from '@island.is/web/layouts/main'

const minarsidurLink = '/minarsidur/'
const minarsidurDelegationsLink = '/minarsidur/login?prompt=select_account'

export function LoginButton(props: {
  colorScheme: ButtonTypes['colorScheme']
  topItem?: LayoutProps['customTopLoginButtonItem']
}) {
  const { t } = useI18n()

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
      title: t.loginIndividuals,
      onClick: trackAndNavigate.bind(null, 'Dropdown - Individuals'),
    },
    {
      href: minarsidurDelegationsLink,
      title: t.loginDelegations,
      onClick: trackAndNavigate.bind(null, 'Dropdown - Companies'),
    },
  ]

  if (props.topItem) {
    items.unshift({
      href: props.topItem.href,
      title: (
        <Box paddingX={1}>
          <Inline alignY="center" space={1} flexWrap="nowrap">
            {props.topItem.imgSrc && (
              <img width={17} height={17} src={props.topItem.imgSrc} alt="" />
            )}
            {props.topItem.label}
          </Inline>
        </Box>
      ),
      onClick: trackAndNavigate.bind(null, props.topItem.buttonType), // TODO: button type read from organization?
    })
  }

  return (
    <>
      <Hidden above={'md'}>
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
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore make web strict
          items={items}
        />
      </Hidden>
      <Hidden below={'lg'}>
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
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore make web strict
          items={items}
          openOnHover
        />
      </Hidden>
    </>
  )
}
