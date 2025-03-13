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
        <Box width="full">
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
            <LinkV2
              href={n(
                'privacyPolicy',
                'https://island.is/en/personuverndarstefna-stafraent-islands',
              )}
            >
              <Text color="blue600" variant="medium">
                <span style={{ textDecoration: 'underline' }}>
                  {n('footerPersonalInfo', 'Meðferð persónuupplýsinga')}
                </span>
              </Text>
            </LinkV2>
            <Text color="blue600" variant="medium">
              {n('footerEmbassy', 'Háskóla-, iðnaðar- og nýsköpunarráðuneytið')}
            </Text>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default UniversityStudiesFooter
