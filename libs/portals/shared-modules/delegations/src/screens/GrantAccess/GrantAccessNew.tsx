import React, { useState } from 'react'
import { FormProvider, useFieldArray, useForm } from 'react-hook-form'
import { defineMessage } from 'react-intl'
import { useNavigate, useLoaderData } from 'react-router-dom'

import { Box, Button, Text } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { IntroHeader, formatNationalId } from '@island.is/portals/core'
import { useUserInfo } from '@island.is/react-spa/bff'
import { Problem } from '@island.is/react-spa/shared'

import { IdentityCard } from '../../components/IdentityCard/IdentityCard'
import { DelegationsFormFooter } from '../../components/delegations/DelegationsFormFooter'
import { useDomains } from '../../hooks/useDomains/useDomains'
import { m } from '../../lib/messages'
import { DelegationPaths } from '../../lib/paths'
import { useCreateAuthDelegationMutation } from './GrantAccess.generated'

import * as styles from './GrantAccess.css'
import { FaqList, FaqListProps } from '@island.is/island-ui/contentful'
import { AccessControlLoaderResponse } from '../AccessControl.loader'
import { NationalIdentityInput } from './NationalIdentityInput'

const GrantAccess = () => {
  useNamespaces(['sp.access-control-delegations'])
  const userInfo = useUserInfo()
  const { formatMessage } = useLocale()
  const [formError, setFormError] = useState<Error | undefined>()

  const navigate = useNavigate()

  const contentfulData = useLoaderData() as AccessControlLoaderResponse
  const { queryString } = useDomains(false)

  const [createAuthDelegation, { loading: mutationLoading }] =
    useCreateAuthDelegationMutation()

  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      people: [{ toNationalId: '' }],
    },
  })
  const { handleSubmit, control, formState } = methods

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'people',
  })

  const onSubmit = handleSubmit(async ({ people }) => {
    try {
      // Create delegations for all people
      const promises = people.map((person: { toNationalId: string }) =>
        createAuthDelegation({
          variables: {
            input: {
              toNationalId: person.toNationalId,
            },
          },
        }),
      )

      const results = await Promise.all(promises)

      // Navigate to the first created delegation
      if (results[0]?.data) {
        navigate(
          `${DelegationPaths.Delegations}/${results[0].data.createAuthDelegation.id}${queryString}`,
        )
      }
    } catch (error) {
      setFormError(error)
    }
  })

  return (
    <>
      <IntroHeader
        title={formatMessage(m.grantTitle)}
        intro={defineMessage(m.grantIntro)}
        marginBottom={4}
      />
      <div className={styles.container}>
        <FormProvider {...methods}>
          <form onSubmit={onSubmit}>
            <Box display="flex" flexDirection="column" rowGap={4}>
              <IdentityCard
                label={formatMessage(m.accessOwner)}
                title={userInfo.profile.name}
                description={formatNationalId(userInfo.profile.nationalId)}
                color="blue"
              />
              {fields.map((field, index) => (
                <Box key={field.id} display="flex" columnGap={4}>
                  <NationalIdentityInput
                    setFormError={setFormError}
                    methods={methods}
                    index={index}
                  />
                  {fields.length > 1 && (
                    <Box
                      display="flex"
                      flexShrink={0}
                      alignItems="center"
                      justifyContent="flexEnd"
                    >
                      <Button
                        variant="text"
                        size="small"
                        icon="trash"
                        iconType="outline"
                        colorScheme="destructive"
                        onClick={() => remove(index)}
                      >
                        {formatMessage(m.grantRemovePerson)}
                      </Button>
                    </Box>
                  )}
                </Box>
              ))}
              <Box>
                <Button
                  variant="text"
                  size="small"
                  icon="add"
                  onClick={() => append({ toNationalId: '' })}
                >
                  {formatMessage(m.grantAddMorePeople)}
                </Button>
              </Box>
            </Box>
            <Box display="flex" flexDirection="column" rowGap={5} marginTop={5}>
              {formError && <Problem error={formError} size="small" />}
              <Text variant="small">
                {formatMessage(m.grantNextStepDescription)}
              </Text>
              <Box marginBottom={7}>
                <DelegationsFormFooter
                  disabled={!formState.isValid || mutationLoading}
                  loading={mutationLoading}
                  onCancel={() => navigate(DelegationPaths.Delegations)}
                  showShadow={false}
                  confirmLabel={formatMessage(m.grantChoosePermissions)}
                  confirmIcon="arrowForward"
                />
              </Box>
            </Box>
          </form>
        </FormProvider>

        {contentfulData?.faqList && (
          <Box paddingTop={8}>
            <FaqList {...(contentfulData.faqList as unknown as FaqListProps)} />
          </Box>
        )}
      </div>
    </>
  )
}

export default GrantAccess
