/* eslint-disable jsx-a11y/anchor-is-valid */
import Link from 'next/link'
import React, { useState } from 'react'
import { useRouter } from 'next/router'
import TranslationUtils from './../../../utils/translation.utils'
import { Translation } from './../../../entities/common/Translation'

const ResourcesTabsNav: React.FC = () => {
  const router = useRouter()
  const [translation] = useState<Translation>(TranslationUtils.getTranslation())
  return (
    <nav className="resource-tab-nav">
      <ul>
        <li
          className={`nav__container ${
            router?.pathname.includes('api-resource') ? 'active' : ''
          }`}
        >
          <Link href="/resources/api-resources">
            <a
              className={
                router?.pathname.includes('api-resource') ? 'active' : ''
              }
            >
              {
                translation.navigations['resourcesTabs'].items['apiResource']
                  .text
              }
            </a>
          </Link>
        </li>
        <li
          className={`nav__container ${
            router?.pathname.includes('api-scope') ? 'active' : ''
          }`}
        >
          <Link href="/resources/api-scopes">
            <a
              className={router?.pathname.includes('api-scope') ? 'active' : ''}
            >
              {translation.navigations['resourcesTabs'].items['apiScope'].text}
            </a>
          </Link>
        </li>
        <li
          className={`nav__container ${
            router?.pathname.includes('identity-resource') ? 'active' : ''
          }`}
        >
          <Link href="/resources/identity-resources">
            <a
              className={
                router?.pathname.includes('identity-resource') ? 'active' : ''
              }
            >
              {
                translation.navigations['resourcesTabs'].items[
                  'identityResource'
                ].text
              }
            </a>
          </Link>
        </li>
      </ul>
    </nav>
  )
}

export default ResourcesTabsNav
