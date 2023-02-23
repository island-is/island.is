import React from 'react'
import { BLOCKS } from '@contentful/rich-text-types'
import { FooterItem } from '@island.is/web/graphql/schema'
import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import { SliceType } from '@island.is/island-ui/contentful'
import { webRichText } from '@island.is/web/utils/richText'
import { useNamespace } from '@island.is/web/hooks'
import * as styles from './SjukratryggingarFooter.css'

interface FooterProps {
  footerItems: Array<FooterItem>
  namespace: Record<string, string>
}

const SjukratryggingarFooter: React.FC<FooterProps> = ({
  footerItems,
  namespace,
}) => {
  const n = useNamespace(namespace)
  return (
    <footer aria-labelledby="organizationFooterTitle">
      <Box className={styles.footerBg} color="white" paddingTop={5}>
        <GridContainer>
          <Box paddingTop={[2, 2, 0]} paddingBottom={[0, 0, 4]}>
            <Box
              display="flex"
              flexDirection="row"
              alignItems="center"
              paddingBottom={4}
              marginBottom={4}
              borderColor="dark400"
              borderBottomWidth="standard"
            >
              <Box marginRight={4}>
                <img
                  src={n(
                    'sjukratryggingarFooterLogo',
                    '/assets/sjukratryggingar_logo.png',
                  )}
                  alt=""
                  className={styles.logoStyle}
                />
              </Box>
            </Box>
            <GridRow>
              {footerItems.slice(0, 4).map((item, index) => (
                <GridColumn
                  span={['12/12', '12/12', '6/12', '3/12']}
                  key={`footer-main-row-column-${index}`}
                >
                  <Box>
                    <Box marginBottom={2}>
                      {webRichText(item.content as SliceType[])}
                    </Box>
                  </Box>
                </GridColumn>
              ))}
            </GridRow>
          </Box>
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            paddingTop={4}
            paddingBottom={4}
            borderColor="dark400"
            borderTopWidth="standard"
          >
            <GridContainer>
              <GridRow>
                <GridColumn
                  span={['12/12', '12/12', '6/12', '3/12']}
                  className={styles.footerSecondRow}
                >
                  <img
                    src={n(
                      'sjukratryggingarFooterBottomLogo',
                      '/assets/sjukratryggingar_heilbrigdisraduneytid.png',
                    )}
                    alt="heilbrygdisraduneytid"
                  />
                </GridColumn>
                <GridColumn
                  span={['12/12', '12/12', '6/12', '3/12']}
                  className={styles.footerSecondRow}
                >
                  <Box>
                    {webRichText(
                      (footerItems?.[4].content ?? []) as SliceType[],
                      {
                        renderNode: {
                          [BLOCKS.PARAGRAPH]: (_node, children) => (
                            <Text variant="small" color="dark400" marginY={1}>
                              {children}
                            </Text>
                          ),
                        },
                      },
                    )}
                  </Box>
                </GridColumn>
                {footerItems.slice(5, 7).map((item, index) => (
                  <GridColumn
                    span={['12/12', '12/12', '6/12', '3/12']}
                    className={styles.footerSecondRow}
                    key={`footer-secondary-row-column-${index}`}
                  >
                    <Box>
                      {webRichText(item.content as SliceType[], {
                        renderNode: {
                          [BLOCKS.PARAGRAPH]: (_node, children) => (
                            <Text variant="small" color="dark400" marginY={1}>
                              {children}
                            </Text>
                          ),
                        },
                      })}
                    </Box>
                  </GridColumn>
                ))}
              </GridRow>
            </GridContainer>
          </Box>
        </GridContainer>
      </Box>
    </footer>
  )
}

export default SjukratryggingarFooter
