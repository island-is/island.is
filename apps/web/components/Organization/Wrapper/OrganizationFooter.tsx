import React from 'react'
import { OrganizationPage } from '@island.is/web/graphql/schema'
import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Link,
  Text,
} from '@island.is/island-ui/core'
import { MarkdownText } from '@island.is/web/components'
import * as styles from './OrganizationFooter.treat'

interface FooterProps {
  organizationPage: OrganizationPage
}

export const OrganizationFooter: React.FC<FooterProps> = ({
  organizationPage,
}) => {
  return (
    <footer aria-labelledby="organizationFooterTitle">
      <Box background="blueberry600" color="white" paddingTop={5}>
        <GridContainer>
          <Box paddingTop={[2, 2, 0]} paddingBottom={[0, 0, 4]}>
            <Box
              display="flex"
              flexDirection="row"
              alignItems="center"
              paddingBottom={5}
              marginBottom={5}
              borderColor="blueberry300"
              borderBottomWidth="standard"
            >
              <Box marginRight={4}>
                <img
                  src={organizationPage.organization.logo.url}
                  alt=""
                  width="70"
                />
              </Box>
              <div id="organizationFooterTitle">
                <Text variant="h2" color="white">
                  {organizationPage.title}
                </Text>
              </div>
            </Box>
            <GridRow>
              {organizationPage.footerItems.map((item, index) => (
                <GridColumn
                  span={['12/12', '6/12', '4/12', '1/5']}
                  className={index === 0 ? styles.footerItemFirst : null}
                >
                  <Box marginBottom={5}>
                    <Box marginBottom={1}>
                      <Text
                        color="white"
                        fontWeight={index === 0 ? 'semiBold' : 'regular'}
                      >
                        {item.link ? (
                          <Link
                            href={item.link.url}
                            underline="normal"
                            underlineVisibility="always"
                          >
                            {item.title}
                          </Link>
                        ) : (
                          item.title
                        )}
                      </Text>
                    </Box>
                    <MarkdownText color="white" variant="small">
                      {item.content}
                    </MarkdownText>
                  </Box>
                </GridColumn>
              ))}
            </GridRow>
          </Box>
        </GridContainer>
      </Box>
    </footer>
  )
}
