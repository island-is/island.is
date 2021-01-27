import React from 'react'
import { OrganizationPage } from '@island.is/web/graphql/schema'
import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Link,
} from '@island.is/island-ui/core'
import * as styles from './OrganizationFooter.treat'
import Markdown from 'markdown-to-jsx'

interface FooterProps {
  organizationPage: OrganizationPage
}

export const OrganizationFooter: React.FC<FooterProps> = ({
  organizationPage,
}) => {
  return (
    <footer aria-labelledby="organizationFooterTitle" className={styles.footer}>
      <GridContainer>
        <Box paddingTop={[2, 2, 0]} paddingBottom={[0, 0, 4, 4]}>
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            className={styles.footerTitleWrapper}
          >
            <img
              src={organizationPage.organization.logo.url}
              className={styles.footerLogo}
              alt=""
            />
            <div id="organizationFooterTitle" className={styles.footerTitle}>
              {organizationPage.title}
            </div>
          </Box>
          <GridRow>
            {organizationPage.footerItems.map((item) => (
              <GridColumn
                span={['12/12', '6/12', '4/12', '1/5']}
                className={styles.footerItem}
              >
                <div className={styles.footerItemTitle}>
                  {item.link ? (
                    <Link href={item.link.url}>{item.title}</Link>
                  ) : (
                    item.title
                  )}
                </div>
                <Markdown>{item.content}</Markdown>
              </GridColumn>
            ))}
          </GridRow>
        </Box>
      </GridContainer>
    </footer>
  )
}
