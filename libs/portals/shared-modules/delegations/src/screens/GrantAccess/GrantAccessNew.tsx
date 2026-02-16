import { useState } from 'react'
import { FormProvider, useFieldArray, useForm } from 'react-hook-form'
import { defineMessage } from 'react-intl'
import { useNavigate, useLoaderData } from 'react-router-dom'

import { Box, Button, Text } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { IntroHeader } from '@island.is/portals/core'
import { Problem } from '@island.is/react-spa/shared'

import { DelegationsFormFooter } from '../../components/delegations/DelegationsFormFooter'
import { m } from '../../lib/messages'
import { DelegationPaths } from '../../lib/paths'

import { FaqList, FaqListProps } from '@island.is/island-ui/contentful'
import { AccessControlLoaderResponse } from '../AccessControl.loader'
import { useDelegationForm } from '../../context'
import { IdentityLookup } from '../../components/IdentityLookup/IdentityLookup'

const GrantAccess = () => {
  useNamespaces(['sp.access-control-delegations'])

  const { formatMessage } = useLocale()
  const [formError, setFormError] = useState<Error | undefined>()
  const { setIdentities } = useDelegationForm()

  const navigate = useNavigate()

  const contentfulData = useLoaderData() as AccessControlLoaderResponse

  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      identities: [{ nationalId: '', name: '' }],
    },
  })
  const { handleSubmit, control, formState, watch } = methods

  const watchIdentities = watch('identities')

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'identities',
  })

  const onSubmit = handleSubmit(async ({ identities }) => {
    try {
      setIdentities(identities)
      if (identities.length > 0) {
        navigate(`${DelegationPaths.DelegationsGrantScopes}`)
      }
    } catch (error) {
      setFormError(error)
    }
  })

  return (
    <>
      <IntroHeader
        title={formatMessage(m.grantAccessStepsTitle)}
        intro={defineMessage(m.grantAccessStepsIntro)}
        marginBottom={4}
      />
      <div>
        <Text variant="h4" marginBottom={4}>
          {formatMessage(m.addPeopleTitle)}
        </Text>
        <FormProvider {...methods}>
          <form onSubmit={onSubmit}>
            <Box display="flex" flexDirection="column" rowGap={4}>
              {fields.map((field, index) => (
                <Box key={field.id} display="flex" columnGap={4}>
                  <IdentityLookup
                    setFormError={setFormError}
                    methods={methods}
                    index={index}
                  />
                  <Box
                    display="flex"
                    flexShrink={0}
                    alignItems="center"
                    justifyContent="flexEnd"
                    style={{ width: 85 }}
                  >
                    {index > 0 && (
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
                    )}
                  </Box>
                </Box>
              ))}
              <Box>
                <Button
                  variant="text"
                  size="small"
                  icon="add"
                  onClick={() => append({ nationalId: '', name: '' })}
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
                  disabled={
                    !formState.isValid ||
                    watchIdentities.some(
                      (identity) =>
                        identity.nationalId.length < 10 || !identity.name,
                    )
                  }
                  loading={false}
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
