import React from 'react'
import {
  Typography,
  Box,
  Stack,
  Button,
  Icon,
  Inline,
  GridContainer,
  GridRow,
  GridColumn,
  ArrowLink,
  Hidden,
} from '@island.is/island-ui/core'
import {
  ServicePortalModuleComponent,
  UserInfoLine,
} from '@island.is/service-portal/core'
import { useLocale } from '@island.is/localization'
import { defineMessage } from 'react-intl'
import * as styles from './UserInfo.treat'

const SubjectInfo: ServicePortalModuleComponent = ({ userInfo }) => {
  const { formatMessage } = useLocale()

  return (
    <>
      <Stack space={10}>
        <Box>
          <Box marginBottom={1}>
            <Typography variant="h1" as="h1">
              {formatMessage({
                id: 'service.portal:my-data',
                defaultMessage: 'Mín gögn',
              })}
            </Typography>
          </Box>
          <Typography variant="p" as="p">
            {formatMessage({
              id: 'service.portal:my-data-subtext',
              defaultMessage:
                'Hér eru þín gögn frá þjóðskrá. Þú hefur kost á að gera breytingar á þessum gögnum',
            })}
          </Typography>
        </Box>
        <GridRow>
          <GridColumn span={['12/12', '12/12', '8/12', '8/12']}>
            <Box marginBottom={2}>
              <Typography variant="h2" as="h2">
                {formatMessage({
                  id: 'service.portal:my-info-my-info',
                  defaultMessage: 'Mínar upplýsingar',
                })}
              </Typography>
            </Box>
            <Typography variant="p" as="p">
              {formatMessage({
                id: 'service.portal:my-info-my-info-subtext',
                defaultMessage:
                  'Við viljum að stafræn þjónusta sé aðgengileg, sniðin að notandanum og með skýra framtíðarsýn. Hér fyrir neðan getur þú lesið okkar helstu.',
              })}
            </Typography>
            <Box marginTop={1}>
              <ArrowLink href={'link'}>
                {formatMessage('service.portal:continue-button')}
              </ArrowLink>
            </Box>
          </GridColumn>
          <GridColumn
            span={['0', '0', '2/12', '2/12']}
            offset={['0', '0', '1/12', '1/12']}
          >
            <Box>
              <img
                className={styles.figure}
                src={'/assets/images/individuals.jpg'}
              />
            </Box>
          </GridColumn>
        </GridRow>

        <GridRow>
          <GridColumn span={['12/12', '12/12', '8/12', '8/12']}>
            <Box marginBottom={2}>
              <Typography variant="h2" as="h2">
                {formatMessage({
                  id: 'service.portal:my-info-family',
                  defaultMessage: 'Fjölskyldan',
                })}
              </Typography>
            </Box>
            <Typography variant="p" as="p">
              {formatMessage({
                id: 'service.portal:my-info-family-subtext',
                defaultMessage:
                  'Hönnunarkerfi Ísland.is auðveldar okkur að setja nýja þjónustu í loftið á stuttum tíma, og einfaldar rekstur og viðhald stafrænnar þjónustu hins opinbera til.',
              })}
            </Typography>
            <Box marginTop={1}>
              <ArrowLink href={'link'}>
                {formatMessage('service.portal:continue-button')}
              </ArrowLink>
            </Box>
          </GridColumn>
          <GridColumn
            span={['0', '0', '2/12', '2/12']}
            offset={['0', '0', '1/12', '1/12']}
          >
            <Box>
              <img className={styles.figure} src={'/assets/images/baby.jpg'} />
            </Box>
          </GridColumn>
        </GridRow>

        <GridRow>
          <GridColumn span={['12/12', '12/12', '8/12', '8/12']}>
            <Box marginBottom={2}>
              <Typography variant="h2" as="h2">
                {formatMessage({
                  id: 'service.portal:my-info-housing',
                  defaultMessage: 'Fasteignir',
                })}
              </Typography>
            </Box>
            <Typography variant="p" as="p">
              {formatMessage({
                id: 'service.portal:my-info-housing-subtext',
                defaultMessage:
                  'Markmið verkefnisins er að smíða kerfi, Viskuausuna, sem veitir upplýsingar um gögn og vefþjónustur ríkisins til notenda.',
              })}
            </Typography>
            <Box>
              <ArrowLink href={'link'}>
                {formatMessage('service.portal:continue-button')}
              </ArrowLink>
            </Box>
          </GridColumn>
          <GridColumn
            span={['0', '0', '2/12', '2/12']}
            offset={['0', '0', '1/12', '1/12']}
          >
            <Box>
              <img
                className={styles.figure}
                src={'/assets/images/moving.jpg'}
              />
            </Box>
          </GridColumn>
        </GridRow>

        <GridRow>
          <GridColumn span={['12/12', '12/12', '8/12', '8/12']}>
            <Box marginBottom={2}>
              <Typography variant="h2" as="h2">
                {formatMessage({
                  id: 'service.portal:my-info-vehicles',
                  defaultMessage: 'Ökutæki',
                })}
              </Typography>
            </Box>
            <Typography variant="p" as="p">
              {formatMessage({
                id: 'service.portal:my-info-vehicles-subtext',
                defaultMessage:
                  'Markmið verkefnisins er að smíða kerfi, Viskuausuna, sem veitir upplýsingar um gögn og vefþjónustur ríkisins til notenda.',
              })}
            </Typography>
            <Box>
              <ArrowLink href={'link'}>
                {formatMessage('service.portal:continue-button')}
              </ArrowLink>
            </Box>
          </GridColumn>
          <GridColumn
            span={['0', '0', '2/12', '2/12']}
            offset={['0', '0', '1/12', '1/12']}
          >
            <Box>
              <img className={styles.figure} src={'/assets/images/jobs.jpg'} />
            </Box>
          </GridColumn>
        </GridRow>
      </Stack>

      {/* <Stack space={1}>
        <UserInfoLine
          label={defineMessage({
            id: 'service.portal:display-name',
            defaultMessage: 'Birtingarnafn',
          })}
          content={userInfo.profile.name}
          editExternalLink="https://www.skra.is/umsoknir/eydublod-umsoknir-og-vottord/stok-vara/?productid=5c55d7a6-089b-11e6-943d-005056851dd2"
        />
        <UserInfoLine
          label={defineMessage({
            id: 'service.portal:natreg',
            defaultMessage: 'Kennitala',
          })}
          content={userInfo.profile.natreg}
        />
        <UserInfoLine
          label={defineMessage({
            id: 'service.portal:citizenship',
            defaultMessage: 'Ríkisfang',
          })}
          content={
            userInfo.profile.nat === 'IS' ? 'Ísland' : userInfo.profile.nat
          }
        />
      </Stack> */}
    </>
  )
}

export default SubjectInfo
