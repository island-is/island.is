import { useContext, useEffect, useState } from 'react'

import {
  AlertBanner,
  Box,
  Checkbox,
  Input,
  Text,
} from '@island.is/island-ui/core'
import { toast } from '@island.is/island-ui/core'
import { ADMIN_USERS_ROUTE } from '@island.is/judicial-system/consts'
import {
  formatDate,
  formatNationalId,
} from '@island.is/judicial-system/formatters'
import {
  PageHeader,
  Skeleton,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import {
  MessageSuspensionCategory,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { useMessageSuspensionsQuery } from './messageSuspensions.generated'
import { useUpdateMessageSuspensionMutation } from './updateMessageSuspension.generated'

const categoryStrings: Record<MessageSuspensionCategory, string> = {
  [MessageSuspensionCategory.COURT]: 'Héraðsdómur',
  [MessageSuspensionCategory.COURT_OF_APPEALS]: 'Landsréttur',
  [MessageSuspensionCategory.POLICE]: 'Lögregla',
  [MessageSuspensionCategory.NATIONAL_COMMISSIONERS_OFFICE]:
    'Ríkislögreglustjóri',
}

export const MessageSuspension = () => {
  const { user } = useContext(UserContext)

  const { data, loading, error, refetch } = useMessageSuspensionsQuery({
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  // Local, editable copy of the delay values, keyed by category
  const [delays, setDelays] = useState<Record<string, string>>({})

  useEffect(() => {
    if (data?.messageSuspensions) {
      setDelays(
        Object.fromEntries(
          data.messageSuspensions.map((suspension) => [
            suspension.category,
            String(suspension.delaySeconds),
          ]),
        ),
      )
    }
  }, [data?.messageSuspensions])

  const [updateMessageSuspension, { loading: updating }] =
    useUpdateMessageSuspensionMutation({
      onCompleted: () => refetch(),
      onError: () => toast.error('Ekki tókst að uppfæra stillingar.'),
    })

  const update = (
    category: MessageSuspensionCategory,
    input: { suspended?: boolean; delaySeconds?: number },
  ) => {
    if (updating) {
      return
    }

    updateMessageSuspension({
      variables: { input: { category, ...input } },
    })
  }

  const isAuthorized =
    user?.role === UserRole.ADMIN || Boolean(user?.canManageMessageSuspension)

  return (
    <Box background="purple100">
      <PageHeader title="Biðröð - Réttarvörslugátt" />
      <Box paddingX={[3, 3, 6, 12]} paddingY={[3, 3, 6]}>
        <Text variant="h1" as="h1" marginBottom={2}>
          Biðröð - fresta meðhöndlun skilaboða
        </Text>
        <Text marginBottom={5}>
          Þegar meðhöndlun skilaboða er frestað eru skilaboð til viðkomandi
          kerfis sett aftur í biðröð án þess að vera afgreidd. Notist þegar ytra
          kerfi er óstöðugt.
        </Text>
        {loading ? (
          <Skeleton />
        ) : !isAuthorized || error || !data?.messageSuspensions ? (
          <AlertBanner
            title="Ekki tókst að sækja stillingar."
            variant="error"
            link={{
              href: ADMIN_USERS_ROUTE,
              title: 'Fara á yfirlitssíðu',
            }}
          />
        ) : (
          data.messageSuspensions.map((suspension) => (
            <Box
              key={suspension.category}
              background="white"
              borderRadius="large"
              padding={4}
              marginBottom={3}
            >
              <Box
                display="flex"
                justifyContent="spaceBetween"
                alignItems="center"
                marginBottom={2}
              >
                <Text variant="h3" as="h2">
                  {categoryStrings[suspension.category]}
                </Text>
                <Checkbox
                  name={`suspended-${suspension.category}`}
                  label="Fresta meðhöndlun skilaboða"
                  checked={suspension.suspended}
                  disabled={updating}
                  onChange={({ target }) =>
                    update(suspension.category, { suspended: target.checked })
                  }
                  large
                  filled
                />
              </Box>
              <Box width="half" marginBottom={2}>
                <Input
                  name={`delay-${suspension.category}`}
                  type="number"
                  label="Lágmarks töf (sekúndur)"
                  value={delays[suspension.category] ?? ''}
                  disabled={updating}
                  onChange={(event) =>
                    setDelays((prev) => ({
                      ...prev,
                      [suspension.category]: event.target.value,
                    }))
                  }
                  onBlur={(event) => {
                    const delaySeconds = Number(event.target.value)

                    if (
                      Number.isFinite(delaySeconds) &&
                      delaySeconds >= 0 &&
                      delaySeconds !== suspension.delaySeconds
                    ) {
                      update(suspension.category, { delaySeconds })
                    }
                  }}
                />
              </Box>
              {suspension.suspended && suspension.modified && (
                <Text variant="small" color="dark400">
                  {`Frestað ${
                    formatDate(suspension.modified, 'Pp') ?? 'á óþekktum tíma'
                  } af ${
                    formatNationalId(suspension.modifiedBy) ||
                    'óþekktum notanda'
                  }`}
                </Text>
              )}
            </Box>
          ))
        )}
      </Box>
    </Box>
  )
}

export default MessageSuspension
