import {
  Box,
  Button,
  GridContainer,
  GridRow,
  Stack,
  Tag,
  Text,
} from '@island.is/island-ui/core'
import { Link, useOutletContext, useParams } from 'react-router-dom'
import MockApplications from '../../lib/MockApplications'
import * as styles from '../TenantsList/TenantsList.css'
import React from 'react'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'

const Applications = () => {
  const { tenant } = useParams()
  const { formatMessage } = useLocale()
  const { setNavTitle } = useOutletContext<{
    setNavTitle: (value: string) => void
  }>()

  React.useEffect(() => {
    // TODO: Get application by id from backend
    setNavTitle(tenant ? tenant : formatMessage(m.tenants))
  })

  return (
    <GridContainer>
      <GridRow rowGap={3}>
        <Box display={'flex'} justifyContent={'spaceBetween'} columnGap={4}>
          <Box>
            <Text variant={'h2'}>{formatMessage(m.applications)}</Text>
          </Box>
          <Box>
            <Button size={'small'}>Create Application</Button>
          </Box>
        </Box>
      </GridRow>
      <Box paddingTop={'gutter'}>
        <Stack space={[1, 1, 2, 2]}>
          {MockApplications.map((item) => (
            <GridRow key={item.id}>
              <Link
                className={styles.fill}
                to={`/innskraningarkerfi/${tenant}/forrit/${item.id}/`}
              >
                <Box
                  className={styles.linkContainer}
                  display={'flex'}
                  borderRadius={'large'}
                  border={'standard'}
                  width={'full'}
                  paddingX={4}
                  paddingY={3}
                  justifyContent={'spaceBetween'}
                  alignItems={'center'}
                >
                  <Box>
                    <Stack space={1}>
                      <Text variant={'h3'} color={'blue400'}>
                        {item.name}
                      </Text>
                      <Text variant={'default'}>{item.tenant}</Text>
                    </Stack>
                  </Box>
                  <Box
                    display="flex"
                    flexDirection={['column', 'column', 'row', 'row', 'row']}
                    alignItems={'flexEnd'}
                    justifyContent={'flexEnd'}
                  >
                    {item.environmentTags.map((tag) => (
                      <Box margin={1}>
                        <Tag variant="purple" outlined>
                          {tag}
                        </Tag>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Link>
            </GridRow>
          ))}
        </Stack>
      </Box>
    </GridContainer>
  )
}

export default Applications
