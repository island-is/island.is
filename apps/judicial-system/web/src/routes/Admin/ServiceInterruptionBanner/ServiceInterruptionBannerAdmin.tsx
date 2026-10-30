import { useContext, useEffect, useState } from 'react'

import { AlertBanner, Box, Input, Text } from '@island.is/island-ui/core'
import { ADMIN_USERS_ROUTE } from '@island.is/judicial-system/consts'
import {
  FormContentContainer,
  FormFooter,
  PageHeader,
  Skeleton,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import { UserRole } from '@island.is/judicial-system-web/src/graphql/schema'
import { toast } from '@island.is/judicial-system-web/src/utils/toast'

import { useServiceInterruptionBannerQuery } from './serviceInterruptionBanner.generated'
import { useUpdateServiceInterruptionBannerMutation } from './updateServiceInterruptionBanner.generated'

type BannerFormState = {
  title: string
  globalMessage: string
  prosecutorMessage: string
  courtMessage: string
}

const emptyForm: BannerFormState = {
  title: 'Mikilvæg skilaboð',
  globalMessage: '',
  prosecutorMessage: '',
  courtMessage: '',
}

const buildChangedInput = (
  form: BannerFormState,
  initial: BannerFormState,
): Partial<BannerFormState> => {
  const input: Partial<BannerFormState> = {}

  ;(Object.keys(form) as Array<keyof BannerFormState>).forEach((field) => {
    if (form[field] !== initial[field]) {
      input[field] = form[field]
    }
  })

  return input
}

export const ServiceInterruptionBannerAdmin = () => {
  const { user } = useContext(UserContext)

  const { data, loading, error, refetch } = useServiceInterruptionBannerQuery({
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  const [form, setForm] = useState<BannerFormState>(emptyForm)
  const [initial, setInitial] = useState<BannerFormState>(emptyForm)

  useEffect(() => {
    const banner = data?.serviceInterruptionBanner

    if (!banner) {
      return
    }

    const nextForm: BannerFormState = {
      title: banner.title ?? '',
      globalMessage: banner.globalMessage ?? '',
      prosecutorMessage: banner.prosecutorMessage ?? '',
      courtMessage: banner.courtMessage ?? '',
    }

    setForm(nextForm)
    setInitial(nextForm)
  }, [data?.serviceInterruptionBanner])

  const [updateBanner, { loading: updating }] =
    useUpdateServiceInterruptionBannerMutation({
      onCompleted: () => {
        toast.success('Stillingar vistaðar.')
        refetch()
      },
      onError: () => toast.error('Ekki tókst að vista stillingar.'),
    })

  const isAuthorized =
    user?.role === UserRole.ADMIN || Boolean(user?.canManageMessageSuspension)

  const setField = (field: keyof BannerFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const save = () => {
    if (updating) {
      return
    }

    const input = buildChangedInput(form, initial)

    if (Object.keys(input).length === 0) {
      return
    }

    updateBanner({
      variables: { input },
    })
  }

  return (
    <Box background="purple100">
      <PageHeader title="Gulur borði - Réttarvörslugátt" />
      <FormContentContainer>
        <Text variant="h1" as="h1" marginBottom={2}>
          Gulur borði
        </Text>
        <Text marginBottom={5}>
          Stjórna skilaboðum sem birtast í gula viðvörunarborðanum. Tómur texti
          (eða aðeins bil) þýðir að engir skilaboð birtast fyrir þá tegund.
        </Text>
        {loading ? (
          <Skeleton />
        ) : !isAuthorized || error || !data?.serviceInterruptionBanner ? (
          <AlertBanner
            title="Ekki tókst að sækja stillingar."
            variant="error"
            link={{
              href: ADMIN_USERS_ROUTE,
              title: 'Fara á yfirlitssíðu',
            }}
          />
        ) : (
          <Box background="white" borderRadius="large" padding={4}>
            <Box marginBottom={3}>
              <Input
                name="title"
                label="Titill"
                value={form.title}
                maxLength={255}
                disabled={updating}
                onChange={(event) => setField('title', event.target.value)}
              />
            </Box>
            <Box marginBottom={3}>
              <Input
                name="globalMessage"
                label="Almenn skilaboð (allir notendur)"
                textarea
                rows={3}
                value={form.globalMessage}
                disabled={updating}
                onChange={(event) =>
                  setField('globalMessage', event.target.value)
                }
              />
            </Box>
            <Box marginBottom={3}>
              <Input
                name="prosecutorMessage"
                label="Skilaboð fyrir ákæruvald"
                textarea
                rows={3}
                value={form.prosecutorMessage}
                disabled={updating}
                onChange={(event) =>
                  setField('prosecutorMessage', event.target.value)
                }
              />
            </Box>
            <Box marginBottom={3}>
              <Input
                name="courtMessage"
                label="Skilaboð fyrir dómstóla"
                textarea
                rows={3}
                value={form.courtMessage}
                disabled={updating}
                onChange={(event) =>
                  setField('courtMessage', event.target.value)
                }
              />
            </Box>
          </Box>
        )}
      </FormContentContainer>
      {!loading && isAuthorized && !error && data?.serviceInterruptionBanner && (
        <FormContentContainer isFooter>
          <FormFooter
            previousUrl={ADMIN_USERS_ROUTE}
            previousButtonText="Hætta við"
            actions={[
              {
                text: 'Vista',
                onClick: save,
                disabled: updating,
                loading: updating,
              },
            ]}
          />
        </FormContentContainer>
      )}
    </Box>
  )
}

export default ServiceInterruptionBannerAdmin
