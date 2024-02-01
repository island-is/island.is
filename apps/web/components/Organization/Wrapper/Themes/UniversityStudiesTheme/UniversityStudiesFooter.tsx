import React from 'react'

import { Box, LinkV2, Text } from '@island.is/island-ui/core'
import { Organization } from '@island.is/web/graphql/schema'

import * as styles from './UniversityStudies.css'
type FooterProps = {
  organization: Organization
}

const UniversityStudiesFooter: React.FC<
  React.PropsWithChildren<FooterProps>
> = ({ organization }) => {
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
            alt=""
          />
        </Box>
        <Box
          display={'flex'}
          className={styles.footerLinksContainer}
          width="full"
        >
          <Box display={'flex'} className={styles.footerLinkContainer}>
            <LinkV2 href="/leit">
              <Text color="blue600" fontWeight="semiBold">
                <span style={{ textDecoration: 'underline' }}>Námsleiðir</span>
              </Text>
            </LinkV2>
            <LinkV2 href="/leit">
              <Text color="blue600" fontWeight="semiBold">
                <span style={{ textDecoration: 'underline' }}>
                  Stuðningsnet stúdenta
                </span>
              </Text>
            </LinkV2>
          </Box>
          <Box display={'flex'} className={styles.footerLinkContainer}>
            <Text color="blue600" fontWeight="semiBold" variant="h3" as="p">
              Háskólanám
            </Text>
            <Text color="blue600" fontWeight="semiBold">
              458-2300
            </Text>
            <Text color="blue600" fontWeight="semiBold">
              Símsvörun: 10:00 - 15:00
            </Text>
          </Box>
          <Box display={'flex'} className={styles.footerLinkContainer}>
            <Text color="blue600" fontWeight="semiBold" variant="h3" as="p">
              Getum við aðstoðað?
            </Text>
            <LinkV2 href="/leit">
              <Text color="blue600" fontWeight="semiBold">
                <span style={{ textDecoration: 'underline' }}>
                  Spurningar og svör
                </span>
              </Text>
            </LinkV2>
            <LinkV2 href="/leit">
              <Text color="blue600" fontWeight="semiBold">
                <span style={{ textDecoration: 'underline' }}>
                  Hafðu samband
                </span>
              </Text>
            </LinkV2>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default UniversityStudiesFooter
