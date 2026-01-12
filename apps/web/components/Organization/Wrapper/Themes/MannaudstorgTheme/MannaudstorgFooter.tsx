import React, { FC, ReactNode } from 'react'
import { BLOCKS } from '@contentful/rich-text-types'

import { SliceType } from '@island.is/island-ui/contentful'
import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Hidden,
  Hyphen,
  Logo,
  Text,
} from '@island.is/island-ui/core'
import { FooterItem } from '@island.is/web/graphql/schema'
import { useI18n } from '@island.is/web/i18n'
import { webRichText } from '@island.is/web/utils/richText'

import * as styles from './MannaudstorgFooter.css'

interface Props {
  title: string
  logoSrc?: string
  footerItems: FooterItem[]
}

const MannaudstorgFooter: FC<React.PropsWithChildren<Props>> = ({
  title,
  logoSrc,
  footerItems,
}) => {
  const { activeLocale } = useI18n()

  return (
    <Hidden print={true}>
      <Box as="footer" position="relative" className={styles.container}>
        <GridContainer>
          <GridRow>
            <GridColumn span="12/12">
              <GridRow>
                <GridColumn span={['12/12', '12/12', '7/12']} paddingTop={6}>
                  <Box
                    display="flex"
                    flexDirection={['column', 'column', 'row']}
                    alignItems={['flexStart', 'flexStart', 'center']}
                    paddingBottom={3}
                    marginBottom={3}
                    borderColor="blueberry300"
                    borderBottomWidth="standard"
                  >
                    <Box marginRight={4} className={styles.logo}>
                      {logoSrc ? (
                        <img src={logoSrc} width={64} height={64} alt="merki" />
                      ) : (
                        <Logo iconOnly width={64} height={64} />
                      )}
                    </Box>
                    <Text color="white" variant="h2" marginTop={[4, 4, 0]}>
                      <Hyphen locale={activeLocale}>{title}</Hyphen>
                    </Text>
                  </Box>
                </GridColumn>
              </GridRow>
              {footerItems.map((item) => (
                <GridRow>
                  <GridColumn>
                    {webRichText(item.serviceWebContent as SliceType[], {
                      renderNode: {
                        [BLOCKS.PARAGRAPH]: (
                          _node: never,
                          children: ReactNode,
                        ) => (
                          <Text
                            marginBottom={2}
                            fontWeight="regular"
                            color="white"
                          >
                            {children}
                          </Text>
                        ),
                      },
                    })}
                  </GridColumn>
                </GridRow>
              ))}
            </GridColumn>
          </GridRow>
        </GridContainer>
      </Box>
    </Hidden>
  )
}

export default MannaudstorgFooter
