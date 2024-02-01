import React, { useMemo } from 'react'

import { Box, Icon, LinkV2, Text } from '@island.is/island-ui/core'
import { Organization } from '@island.is/web/graphql/schema'
import { useNamespace } from '@island.is/web/hooks'

import * as styles from './UniversityStudies.css'
type FooterProps = {
  organization: Organization
}

const UniversityStudiesFooter: React.FC<
  React.PropsWithChildren<FooterProps>
> = ({ organization }) => {
  const organizationNamespace = useMemo(() => {
    return JSON.parse(organization?.namespace?.fields || '{}')
  }, [organization?.namespace?.fields])
  const n = useNamespace(organizationNamespace)

  return (
    <Box
      width="full"
      display={'flex'}
      justifyContent={'center'}
      style={{
        background: 'linear-gradient(1deg, #FFF6E7 0.6%, #FFF 100.52%)',
        zIndex: 0,
      }}
      position="relative"
    >
      <Box
        display={'flex'}
        position="relative"
        flexDirection={'column'}
        width="full"
        padding={3}
        alignItems={'center'}
        className={styles.footerContainer}
      >
        <Box position="absolute" className={styles.ellipsisLeft}></Box>
        <Box position="absolute" className={styles.ellipsisRight}></Box>
        <Box className={styles.footerLogoContainer} width="full">
          <img
            src={organization?.logo?.url}
            className={styles.footerLogo}
            alt="haskolanam logo"
          />
        </Box>
        <Box
          display={'flex'}
          className={styles.footerLinksContainer}
          width="full"
        >
          <Box display={'flex'} className={styles.footerFirstColumnContainer}>
            <LinkV2 href="https://www.stjornarradid.is/default.aspx?PageID=a496498d-6ce4-40b2-b339-fd61987a9918">
              <Text color="blue600" variant="medium">
                <span style={{ textDecoration: 'underline' }}>
                  {n('footerPersonalInfo', 'Meðferð persónuupplýsinga')}
                </span>
              </Text>
            </LinkV2>
            <LinkV2 href="https://www.stjornarradid.is/raduneyti/haskola-idnadar-og-nyskopunarraduneytid/">
              <Text color="blue600" variant="medium">
                <span style={{ textDecoration: 'underline' }}>
                  {n(
                    'footerEmbassy',
                    'Háskóla-, iðnaðar- og nýsköpunarráðuneytið',
                  )}
                </span>
              </Text>
            </LinkV2>
          </Box>
          <Box display={'flex'} className={styles.footerSecondColumnContainer}>
            <Text color="blue600" variant="medium" fontWeight="semiBold">
              Aðstoð
            </Text>
            <Box display={'flex'} style={{ gap: '0.5rem' }}>
              <Text color="blue600" variant="medium">
                {n('email', 'netfang')}:{' '}
                {n('haskolanamEmail', 'haskolanam@island.is')}
              </Text>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default UniversityStudiesFooter
