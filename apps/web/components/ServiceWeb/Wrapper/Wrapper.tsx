import React, { FC, useEffect, useState, createContext } from 'react'
import Head from 'next/head'
import { Box } from '@island.is/island-ui/core'

import { Organization } from '@island.is/web/graphql/schema'
import {
  ServiceWebSearchSection,
  ServiceWebHeader,
  ServiceWebBackground,
  ServiceWebDynamicFooter,
} from '@island.is/web/components'
import { BackgroundVariations, Options, TextModes } from '../types'
import config from '../config'

import * as styles from './Wrapper.css'

const DEFAULT_INSTITUTION_SLUG = 'stafraent-island'

type ServiceWebContextProps = {
  textMode: TextModes
  institutionSlug: BackgroundVariations
}

export const ServiceWebContext = createContext<ServiceWebContextProps>({
  textMode: 'dark',
  institutionSlug: DEFAULT_INSTITUTION_SLUG,
})

interface WrapperProps {
  pageTitle: string
  headerTitle: string
  institutionSlug: BackgroundVariations
  organization: Organization
  logoUrl?: string
  searchTitle?: string
  organizationTitle?: string
  smallBackground?: boolean
}

export const Wrapper: FC<WrapperProps> = ({
  pageTitle,
  headerTitle,
  institutionSlug,
  organization,
  logoUrl,
  searchTitle,
  organizationTitle,
  smallBackground,
  children,
}) => {
  const [options, setOptions] = useState<Options>({
    textMode: 'dark',
  })
  const [textMode, setTextMode] = useState<TextModes>('light')
  const showSearchSection = searchTitle && logoUrl && organizationTitle

  useEffect(() => {
    if (institutionSlug in config) {
      setOptions(config[institutionSlug ?? 'default'])
    }
  }, [institutionSlug])

  useEffect(() => {
    setTextMode(options.textMode)
  }, [options])

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <ServiceWebContext.Provider value={{ textMode, institutionSlug }}>
        <ServiceWebHeader
          hideSearch={!smallBackground}
          title={headerTitle}
          textMode={textMode}
        />
        <ServiceWebBackground
          variation={
            !(institutionSlug as BackgroundVariations)
              ? DEFAULT_INSTITUTION_SLUG
              : institutionSlug
          }
          small={smallBackground}
        />
        {!!showSearchSection && (
          <Box className={styles.searchSection}>
            <ServiceWebSearchSection
              logoTitle={organizationTitle}
              logoUrl={logoUrl}
              title={searchTitle}
              textMode={textMode}
            />
          </Box>
        )}
        {children}
        <ServiceWebDynamicFooter
          institutionSlug={institutionSlug}
          organization={organization}
        />
      </ServiceWebContext.Provider>
    </>
  )
}

export default Wrapper
