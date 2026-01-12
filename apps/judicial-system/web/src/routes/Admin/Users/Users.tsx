import { useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import cn from 'classnames'
import { useRouter } from 'next/router'

import {
  AlertMessage,
  Box,
  Button,
  Select,
  Text,
} from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import {
  formatDate,
  formatNationalId,
} from '@island.is/judicial-system/formatters'
import { getAdminUserInstitutionScope } from '@island.is/judicial-system/types'
import { errors, titles } from '@island.is/judicial-system-web/messages'
import {
  Loading,
  PageHeader,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import { User } from '@island.is/judicial-system-web/src/graphql/schema'
import { useInstitution } from '@island.is/judicial-system-web/src/utils/hooks'

import { userRoleToString } from '../userRoleToString'
import { useUsersQuery } from './users.generated'
import * as styles from './Users.css'

export const Users = () => {
  const router = useRouter()
  const { user } = useContext(UserContext)
  const [selectedInstitutions, setSelectedInstitutions] = useState<string[]>([])

  const { formatMessage } = useIntl()
  const {
    allInstitutions,
    loading: institutionsLoading,
    loaded: institutionsLoaded,
  } = useInstitution()
  const {
    data: usersData,
    error: usersError,
    loading: usersLoading,
  } = useUsersQuery({
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  const users = usersData?.users?.filter((u) => {
    return selectedInstitutions.length > 0
      ? u.institution?.id && selectedInstitutions.includes(u.institution.id)
      : true
  })

  const handleClick = (user: User): void => {
    router.push(`${constants.CHANGE_USER_ROUTE}/${user.id}`)
  }

  return (
    <div className={styles.userControlContainer}>
      <PageHeader title={formatMessage(titles.admin.users)} />
      <Box display="flex" marginBottom={9} justifyContent="spaceBetween">
        <Button
          icon="add"
          onClick={() => {
            router.push(constants.CREATE_USER_ROUTE)
          }}
        >
          Nýr notandi
        </Button>
        <Button
          variant="ghost"
          icon="calculator"
          onClick={() => {
            router.push(constants.STATISTICS_ROUTE)
          }}
        >
          Tölfræði
        </Button>
      </Box>

      <Box
        marginBottom={8}
        display="flex"
        justifyContent="spaceBetween"
        alignItems="center"
      >
        <Text variant="h3" id="tableCaption">
          Notendur
        </Text>
        <Box width="half">
          <Select
            name="institutions"
            isMulti={true}
            options={
              institutionsLoaded
                ? allInstitutions
                    .filter(
                      (i) =>
                        i.type &&
                        getAdminUserInstitutionScope(user).includes(i.type),
                    )
                    .map((i) => ({ label: i.name ?? '', value: i.id }))
                : []
            }
            placeholder="Veldu stofnun"
            isDisabled={institutionsLoading}
            onChange={(selectedOptions) =>
              setSelectedInstitutions(selectedOptions.map((o) => o.value))
            }
          />
        </Box>
      </Box>
      {users && users.length > 0 ? (
        <table
          className={styles.userTable}
          data-testid="users-table"
          aria-describedby="tableCation"
        >
          <thead className={styles.thead}>
            <tr>
              <Box component="th" paddingY={2} paddingX={3}>
                <Text as="span" fontWeight="regular">
                  Nafn
                </Text>
              </Box>
              <Box component="th" paddingY={2} paddingX={3}>
                <Text as="span" fontWeight="regular">
                  Kennitala
                </Text>
              </Box>
              <Box component="th" paddingY={2} paddingX={3}>
                <Text as="span" fontWeight="regular">
                  Hlutverk
                </Text>
              </Box>
              <Box component="th" paddingY={2} paddingX={3}>
                <Text as="span" fontWeight="regular">
                  Stofnun
                </Text>
              </Box>
              <Box component="th" paddingY={2} paddingX={3}>
                <Text as="span" fontWeight="regular">
                  Virkur
                </Text>
              </Box>
              <Box component="th" paddingY={2} paddingX={3}>
                <Text as="span" fontWeight="regular">
                  Getur staðfest ákærur
                </Text>
              </Box>
              <Box component="th" paddingY={2} paddingX={3}>
                <Text as="span" fontWeight="regular">
                  Innskráningar
                </Text>
              </Box>
            </tr>
          </thead>
          <tbody>
            {users.map((user, i) => (
              <tr
                key={i}
                className={cn(styles.tableRowContainer)}
                role="button"
                aria-label="Opna notanda"
                onClick={() => {
                  handleClick(user)
                }}
              >
                <Box component="td" paddingX={3} paddingY={2}>
                  <Text as="span">{user.name}</Text>
                </Box>
                <Box component="td" paddingX={3} paddingY={2}>
                  <Text as="span">{formatNationalId(user.nationalId)}</Text>
                </Box>
                <Box component="td" paddingX={3} paddingY={2}>
                  <Text as="span">{userRoleToString(user.role)}</Text>
                </Box>
                <Box component="td" paddingX={3} paddingY={2}>
                  <Text as="span">{user.institution?.name}</Text>
                </Box>
                <Box component="td" paddingX={3} paddingY={2}>
                  <Text as="span">{user.active ? 'Já' : 'Nei'}</Text>
                </Box>
                <Box component="td" paddingX={3} paddingY={2}>
                  <Text as="span">
                    {user.canConfirmIndictment ? 'Já' : 'Nei'}
                  </Text>
                </Box>
                <Box component="td" paddingX={3} paddingY={2}>
                  <Text as="span">
                    {user.latestLogin
                      ? `${formatDate(user.latestLogin, 'yyy-MM-dd HH:mm')} - ${
                          user.loginCount
                        }`
                      : ''}
                  </Text>
                </Box>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <Box width="half">
          <AlertMessage
            type="info"
            title="Enginn notandi fannst"
            message="Vinsamlegast veldu aðra stofnun"
          />
        </Box>
      )}
      {(institutionsLoading || usersLoading) && (
        <Box width="full">
          <Loading />
        </Box>
      )}
      {usersError && (
        <div data-testid="users-error">
          <AlertMessage
            title={formatMessage(errors.failedToFetchDataFromDbTitle)}
            message={formatMessage(errors.failedToFetchDataFromDbMessage)}
            type="error"
          />
        </div>
      )}
    </div>
  )
}

export default Users
