import { useMutation } from '@apollo/client'
import { CREATE_ORGANIZATION } from '@island.is/form-system/graphql'
import { m } from '@island.is/form-system/ui'
import { Box, Select, Text, toast } from '@island.is/island-ui/core'
import { getStaticEnv } from '@island.is/shared/utils'
import { useContext, useMemo } from 'react'
import { useIntl } from 'react-intl'
import { useSearchParams } from 'react-router-dom'
import { FormsContext } from '../context/FormsContext'

export const OrganizationSelect = () => {
  const { formatMessage } = useIntl()
  const {
    isAdmin,
    organizations,
    setOrganizations,
    organizationNationalId,
    handleOrganizationChange,
  } = useContext(FormsContext)

  const [, setSearchParams] = useSearchParams()
  const [createOrganizationMutation, { loading: isCreatingOrganization }] =
    useMutation<
      { createFormSystemOrganization: string },
      { input: { nationalId: string } }
    >(CREATE_ORGANIZATION)

  const canAddOrganization =
    isAdmin &&
    (['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname) ||
      getStaticEnv('SI_PUBLIC_ENVIRONMENT') === 'dev')

  const addOrganization = async (input: string) => {
    const nationalId = input.replace(/[\s-]/g, '')

    if (!canAddOrganization || isCreatingOrganization) {
      return
    }

    if (!/^\d{10}$/.test(nationalId)) {
      toast.error(
        formatMessage({
          id: 'adminOrganizationInvalidNationalId',
          defaultMessage: 'Kennitala verður að innihalda 10 tölustafi.',
        }),
      )
      return
    }

    if (
      organizations.some((organization) => organization.value === nationalId)
    ) {
      toast.error(
        formatMessage({
          id: 'adminOrganizationAlreadyExists',
          defaultMessage: 'Stofnun með þessa kennitölu er þegar á listanum.',
        }),
      )
      return
    }

    try {
      const { data } = await createOrganizationMutation({
        variables: { input: { nationalId } },
      })

      if (!data?.createFormSystemOrganization) {
        throw new Error('Organization creation returned no name')
      }

      const label = data.createFormSystemOrganization
      setOrganizations((current) => [...current, { label, value: nationalId }])
      toast.success(
        formatMessage({
          id: 'adminOrganizationCreated',
          defaultMessage: 'Stofnun hefur verið bætt við.',
        }),
      )
    } catch {
      toast.error(
        formatMessage({
          id: 'adminOrganizationCreateError',
          defaultMessage:
            'Ekki tókst að bæta við stofnun. Athugaðu hvort stofnunin sé skráð með nafni og kennitölu í Contentful.',
        }),
      )
    }
  }

  const sortedOrganizations = useMemo(
    () =>
      [...organizations].sort((a, b) =>
        (a.label ?? '').localeCompare(b.label ?? '', 'is', {
          sensitivity: 'base',
        }),
      ),
    [organizations],
  )

  return (
    <Box style={{ width: '40%' }}>
      {canAddOrganization && (
        <Box marginBottom={2}>
          <Text variant="small">
            {formatMessage({
              id: 'adminOrganizationAddInformation',
              defaultMessage:
                'Þú getur bætt stofnun við listann með því að slá inn kennitölu hennar í fellilistann hér fyrir neðan og ýta á Enter.',
            })}
          </Text>
        </Box>
      )}
      <Select
        name="organizations"
        label={formatMessage(m.organization)}
        options={sortedOrganizations}
        size="sm"
        isSearchable
        isCreatable={canAddOrganization}
        isClearable={false}
        isLoading={isCreatingOrganization}
        isDisabled={isCreatingOrganization}
        value={sortedOrganizations.find(
          (org) => org.value === organizationNationalId,
        )}
        onChange={async (selected, action) => {
          if (selected && action.action === 'create-option') {
            await addOrganization(selected.value)
            return
          }

          if (selected && handleOrganizationChange) {
            handleOrganizationChange({ value: selected.value })
            setSearchParams({ organizationNationalId: selected.value })
          }
        }}
      />
    </Box>
  )
}
