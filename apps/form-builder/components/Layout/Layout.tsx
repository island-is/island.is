import {
  Header,
  Box,
  Divider,
  GridContainer as Grid,
  GridColumn as Column,
} from '@island.is/island-ui/core'
import Head from 'next/head'
import React, { FC, useReducer } from 'react'
import * as styles from './Layout.css'
import { useRouter } from 'next/router'
import { headerInfoReducer } from '../../hooks/headerInfoReducer'
import LayoutContext from '../../context/LayoutContext'

type LayoutProps = {
  children: React.ReactNode
}

const Layout: FC<LayoutProps> = ({ children }: LayoutProps) => {
  const route = useRouter()
  //useContext(LayoutContext)

  const initialInfo = {
    organization: '',
    applicationName: '',
  }
  const [info, dispatch] = useReducer(headerInfoReducer, initialInfo)
  const layoutContext = {
    info: info,
    infoDispatch: dispatch,
  }

  return (
    <Grid>
      <Column span="12/12">
        <Head>
          <title>Welcome to licensing-portal!</title>
        </Head>
        <Box
          flexDirection="column"
          justifyContent="flexStart"
          display="flex"
          className={styles.processContainer}
        >
          <Box display="flex" justifyContent="center">
            <Box
              className={styles.contentWrapper}
              onClick={() => route.push('/Forms')}
            >
              <Header
                info={{
                  title: info.organization,
                  description: info.applicationName,
                }}
                logoutText="Logout"
                userName="Hyo-sam Nandkisore"
                userAsDropdown
              />
            </Box>
          </Box>
          <Box style={{ padding: '0 0 1px 0' }}>
            <Divider />
          </Box>

          <Box className={styles.container}>
            <LayoutContext.Provider value={layoutContext}>
              <Box className={styles.contentWrapper}>{children}</Box>
            </LayoutContext.Provider>
          </Box>
        </Box>
      </Column>
    </Grid>
  )
} /*  */

export default Layout
