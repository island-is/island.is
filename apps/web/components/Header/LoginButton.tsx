import React, { MouseEvent } from 'react'

import {
  Button,
  ButtonTypes,
  DropdownMenu,
  Hidden,
} from '@island.is/island-ui/core'
import { webLoginButtonSelect } from '@island.is/plausible'
import { ProjectBasePath } from '@island.is/shared/constants'
import { useI18n } from '@island.is/web/i18n'

const minarsidurLink = `${ProjectBasePath.ServicePortal}/`
const minarsidurDelegationsLink = `${minarsidurLink}login?prompt=select_account`

export function LoginButton(props: {
  colorScheme: ButtonTypes['colorScheme']
}) {
  const { t } = useI18n()

  function trackAndNavigate(
    buttonType: 'Dropdown - Individuals' | 'Dropdown - Companies',
    event: MouseEvent<HTMLAnchorElement>,
  ) {
    event.preventDefault()
    const href = event.currentTarget.href

    // If the plausible script is not loaded (For example in case of adBlocker) the user will be navigated directly to the service portal.
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
