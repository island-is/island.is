import {
  Box,
  Button,
  GridContainer,
  GridRow,
  Stack,
  Tag,
  Text,
} from '@island.is/island-ui/core'
import { Link, useNavigate, useParams } from 'react-router-dom'
import MockApplications from '../../lib/MockApplications'
import { useEffect } from 'react'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { useTenant } from '../../screens/Tenant/Tenant'
import { replaceParams } from '@island.is/react-spa/shared'
import { IDSAdminPaths } from '../../lib/paths'
import * as styles from '../TenantsList/TenantsList.css'

const Applications = () => {
  const { tenant: tenantId } = useParams<{ tenant: string }>()
  const { formatMessage } = useLocale()
  const { setNavTitle } = useTenant()
  const navigate = useNavigate()

  useEffect(() => {
    // TODO: Get application by id from backend
    setNavTitle(tenantId ? tenantId : formatMessage(m.tenants))
  })

  return (
    <GridContainer>
      <GridRow rowGap={3}>
        <Box display={'flex'} justifyContent={'spaceBetween'} columnGap={4}>
          <Box>
            <Text variant={'h2'}>{formatMessage(m.applications)}</Text>
          </Box>
          <Box>
            <Button
              size={'small'}
              onClick={() =>
                navigate(
                  replaceParams({
                    href: IDSAdminPaths.IDSAdminApplicationCreate,
                    params: { tenant: tenantId },
                  }),
                )
              }
            >
              Create Application
            </Button>
          </Box>
        </Box>
      </GridRow>
      <Box paddingTop={'gutter'}>
        <Stack space={[1, 1, 2, 2]}>
          {MockApplications.map((item) => (
            <GridRow key={item.id}>
              <Link
                className={styles.fill}
                to={replaceParams({
                  href: IDSAdminPaths.IDSAdminApplication,
                  params: {
                    tenant: tenantId,
                    application: item.id,
                  },
                })}
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
                    {item.environmentTags.map((tag, index) => (
                      <Box margin={1} key={index}>
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
