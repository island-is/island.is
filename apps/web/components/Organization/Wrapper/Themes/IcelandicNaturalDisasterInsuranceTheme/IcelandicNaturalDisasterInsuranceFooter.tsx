import { SliceType } from '@island.is/island-ui/contentful'
import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import { FooterItem } from '@island.is/web/graphql/schema'
import { useNamespace } from '@island.is/web/hooks'
import { webRichText } from '@island.is/web/utils/richText'
import { useWindowSize } from '@island.is/web/hooks/useViewport'
import { theme } from '@island.is/island-ui/theme'

import * as styles from './IcelandicNaturalDisasterInsuranceFooter.css'

interface IcelandicNaturalDisasterInsuranceFooterProps {
  namespace: Record<string, string>
  footerItems?: FooterItem[]
}

const IcelandicNaturalDisasterInsuranceFooter = ({
  namespace,
  footerItems,
}: IcelandicNaturalDisasterInsuranceFooterProps) => {
  const n = useNamespace(namespace)
  const { width } = useWindowSize()
  const shouldWrap = width < theme.breakpoints.xl

  return (
    <footer className={styles.footer} aria-labelledby="nti-footer">
      <GridContainer>
        <GridRow>
          <GridColumn>
            <Box marginBottom={2} marginRight={2}>
              <img
                src={n(
                  'ntiFooterLogo',
                  'https://images.ctfassets.net/8k0h54kbe6bj/1J7KjOH1so3QXE0Zu8kVMG/8de93a53cf62f91970b40edd51b4493d/nti-footer.svg',
                )}
                alt=""
              />
            </Box>
          </GridColumn>

          {(footerItems ?? []).map((item, index) => (
            <GridColumn span={shouldWrap ? '1/1' : undefined} key={index}>
              <Box
                marginTop={index === 0 && shouldWrap ? 3 : 0}
                marginLeft={shouldWrap ? 7 : undefined}
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore make web strict
                marginRight={shouldWrap ? null : 12}
              >
                <Box marginBottom={2}>
                  <Text fontWeight="semiBold">{item.title}</Text>
                </Box>
                {webRichText(item.content as SliceType[])}
              </Box>
            </GridColumn>
          ))}
        </GridRow>
      </GridContainer>
    </footer>
  )
}

export default IcelandicNaturalDisasterInsuranceFooter
