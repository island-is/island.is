/* eslint-disable jsx-a11y/anchor-is-valid */
import Link from 'next/link'
import React, { useState } from 'react'
import { useRouter } from 'next/router'
import LocalizationUtils from '../../../utils/localization.utils'
import { Localization } from '../../../entities/common/Localization'

const ResourcesTabsNav: React.FC<React.PropsWithChildren<unknown>> = () => {
  const router = useRouter()
  const [localization] = useState<Localization>(
    LocalizationUtils.getLocalization(),
  )
  return (
    <nav className="resource-tab-nav">
      <ul>
        <li
          className={`nav__container ${
            router?.pathname.includes('api-resource') ? 'active' : ''
          }`}
        >
          <Link
            href="/resources/api-resources"
            className={
              router?.pathname.includes('api-resource') ? 'active' : ''
            }
          >
            {
              localization.navigations['resourcesTabs'].items['apiResource']
                .text
            }
          </Link>
        </li>
        <li
          className={`nav__container ${
            router?.pathname.includes('api-scope') ? 'active' : ''
          }`}
        >
          <Link
            href="/resources/api-scopes"
            className={router?.pathname.includes('api-scope') ? 'active' : ''}
          >
            {localization.navigations['resourcesTabs'].items['apiScope'].text}
          </Link>
        </li>
        <li
          className={`nav__container ${
            router?.pathname.includes('identity-resource') ? 'active' : ''
          }`}
        >
          <Link
            href="/resources/identity-resources"
            className={
              router?.pathname.includes('identity-resource') ? 'active' : ''
            }
          >
            {
              localization.navigations['resourcesTabs'].items[
                'identityResource'
              ].text
            }
          </Link>
        </li>
      </ul>
    </nav>
  )
}

export default ResourcesTabsNav
