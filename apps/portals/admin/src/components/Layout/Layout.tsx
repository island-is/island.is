import React, { FC } from 'react'

import {
  ToastContainer,
  Box,
  GridContainer,
  GridColumn,
  GridRow,
} from '@island.is/island-ui/core'
import { useNamespaces } from '@island.is/localization'

import Header from '../Header/Header'
import * as styles from './Layout.css'
import {
  useModules,
  useModuleProps,
  LayoutSizes,
} from '@island.is/portals/core'

const LayoutOuterContainer: FC = ({ children }) => (
  <>
    <ToastContainer useKeyframeStyles={false} />
    <Header />
    {children}
  </>
)

const LayoutModuleContainer: FC<{ size: LayoutSizes }> = ({
  children,
  size,
}) => {
  return (
    <Box className={styles.container} paddingY={[0, 0, 0, 5]}>
      {size !== 'fullwidth' ? (
        <GridContainer>
          <Box
            className={styles.contentBox}
            height="full"
            borderRadius="large"
            background="white"
            paddingY={[3, 3, 3, 10]}
          >
            <GridRow>
              <GridColumn
                offset={['0', '0', '0', '2/12']}
                span={['12/12', '12/12', '12/12', '8/12']}
              >
                {children}
              </GridColumn>
            </GridRow>
          </Box>
        </GridContainer>
      ) : (
        children
      )}
    </Box>
  )
}

export const Layout: FC = ({ children }) => {
  useNamespaces(['admin.portal', 'global'])

  const { activeModule } = useModules()
  const moduleProps = useModuleProps()
  const { layoutSize = 'default', moduleLayoutWrapper: ModuleLayoutWrapper } =
    activeModule || {}

  if (ModuleLayoutWrapper) {
    return (
      <LayoutOuterContainer>
        <ModuleLayoutWrapper {...moduleProps}>
          <LayoutModuleContainer size={layoutSize}>
            {children}
          </LayoutModuleContainer>
        </ModuleLayoutWrapper>
      </LayoutOuterContainer>
    )
  }

  return (
    <LayoutOuterContainer>
      <LayoutModuleContainer size={layoutSize}>
        {children}
      </LayoutModuleContainer>
    </LayoutOuterContainer>
  )
}
