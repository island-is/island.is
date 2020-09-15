import React, { FC } from 'react'
import {
  Box,
  Stack,
  Typography,
  Button,
  Icon,
  GridContainer,
  GridRow,
  GridColumn,
} from '@island.is/island-ui/core'
import { ProcessPageLayout } from '../Layouts'
import CompanyList from './components/CompanyList'
import { withApollo } from '@island.is/skilavottord-web/graphql/withApollo'
import * as styles from './Companies.treat'
import { useRouter } from 'next/router'
import { useI18n } from '@island.is/skilavottord-web/i18n'
import useRouteNames from '@island.is/skilavottord-web/i18n/useRouteNames'

const RecyclingCompanies = (props) => {
  const { companies } = props

  const {
    activeLocale,
    t: { companies: t },
  } = useI18n()
  const { makePath } = useRouteNames(activeLocale)
  const Router = useRouter()

  const onContinue = () => {
    Router.push(makePath('myCars'))
  }

  const onCancel = () => {
    Router.push(makePath('myCars'))
  }

  return (
    <ProcessPageLayout>
      <Stack space={3}>
        <GridContainer>
          <GridRow>
            <GridColumn>
              <Box className={styles.iconWrapper}>
                <Icon type="check" color="white" />
              </Box>
            </GridColumn>
            <GridColumn>
              <Typography variant="h1">{t.title}</Typography>
            </GridColumn>
          </GridRow>
        </GridContainer>
        <Stack space={4}>
          <Stack space={2}>
            <Typography variant="h3">{t.subTitles.recycle}</Typography>
            <Typography variant="p">{t.info}</Typography>
          </Stack>
          <Typography variant="h3">{t.subTitles.companies}</Typography>
          <CompanyList companies={companies} />
          <Box width="full" display="inlineFlex" justifyContent="spaceBetween">
            <Button variant="ghost" onClick={onCancel}>
              <div className={styles.cancelButtonText}>{t.buttons.cancel}</div>
            </Button>
            <Button variant="normal" onClick={onContinue}>
              {t.buttons.continue}
            </Button>
          </Box>
        </Stack>
      </Stack>
    </ProcessPageLayout>
  )
}

RecyclingCompanies.getInitialProps = () => {
  const companies = [
    {
      name: 'Company 1',
      address: 'Address',
      phone: '01234',
      website: 'http://www.some-company.is',
    },
    {
      name: 'Company 2',
      address: 'Address',
      phone: '01234',
      website: 'http://www.some-company.is',
    },
    {
      name: 'Company 3',
      address: 'Address',
      phone: '01234',
      website: 'http://www.some-company.is',
    },
  ]

  return { companies }
}

export default RecyclingCompanies
