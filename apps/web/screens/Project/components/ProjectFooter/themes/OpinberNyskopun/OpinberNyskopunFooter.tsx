import { BLOCKS } from '@contentful/rich-text-types'
import { SliceType } from '@island.is/island-ui/contentful'
import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Hyphen,
  Inline,
  Text,
} from '@island.is/island-ui/core'
import { FooterItem } from '@island.is/web/graphql/schema'
import { webRichText } from '@island.is/web/utils/richText'
import * as styles from './OpinberNyskopunFooter.css'
import { useNamespace } from '@island.is/web/hooks'

interface OpinberNyskopunFooterProps {
  footerItems: FooterItem[]
  namespace: Record<string, string>
}

export const OpinberNyskopunFooter: React.FC<OpinberNyskopunFooterProps> = ({
  footerItems,
  namespace,
}) => {
  const n = useNamespace(namespace)
  return (
    <footer className={styles.container}>
      <GridContainer>
        <GridRow>
          <GridColumn span={['4/12', '4/12', '3/12', '2/12']}>
            <img
              width={133}
              height={71}
              src="https://images.ctfassets.net/8k0h54kbe6bj/21JLHgkyocLA8lcT0AaK4e/545f1363de7eb8160055bd39d3c72d14/rikiskaup.svg"
              alt=""
            />
          </GridColumn>
          <GridColumn
            position="relative"
            span={['8/12', '8/12', '9/12', '10/12']}
          >
            {footerItems?.[0]?.title && (
              <Text variant="h2" color="white">
                <Hyphen>{footerItems[0].title}</Hyphen>
              </Text>
            )}
            <Box marginY={2} className={styles.line} />
            <Box marginTop={4} display="flex" flexWrap="wrap">
              {footerItems.slice(1).map((item) => (
                <Box key={item.id} marginRight={8}>
                  <Text fontWeight="semiBold" color="white" marginBottom={2}>
                    {item.title}
                  </Text>
                  {webRichText(item.content as SliceType[], {
                    renderNode: {
                      [BLOCKS.PARAGRAPH]: (_node, children) => (
                        <Text color="white" variant="medium" marginBottom={2}>
                          {children}
                        </Text>
                      ),
                    },
                  })}
                </Box>
              ))}
              <Box marginLeft="auto">
                <Inline space={[1, 1, 1, 3]} alignY="center">
                  <img
                    width={420}
                    src={n(
                      'opinbernyskopun-logo1',
                      'https://images.ctfassets.net/8k0h54kbe6bj/1i6yzfj8HFtKGx2n2mKKzE/0b9715a5f13ea8cf0727c97ccdaca870/FJR__IS_1L_utlinad_hvitt_0219.svg',
                    )}
                    alt=""
                  />
                  <img
                    width={420}
                    src={n(
                      'opinbernyskopun-logo2',
                      'https://images.ctfassets.net/8k0h54kbe6bj/1j0LduNFs0zmTfuBKDaEM1/8723d91686558b2f90e359aa47cd6446/HVIN_IS_2L_utlindad_hvitt_2022.svg',
                    )}
                    alt=""
                  />
                </Inline>
              </Box>
            </Box>
          </GridColumn>
        </GridRow>
      </GridContainer>
    </footer>
  )
}
