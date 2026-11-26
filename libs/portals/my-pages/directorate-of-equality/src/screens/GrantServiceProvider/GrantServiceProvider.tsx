import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  Box,
  Bullet,
  BulletList,
  Button,
  GridColumn,
  GridRow,
  InputError,
  RadioButton,
  SkeletonLoader,
  Stack,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  formatNationalId,
  IntroWrapper,
  JAFNRETTISSTOFA_SLUG,
  m as coreMessages,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'

import { StepButtons } from '../../components/StepButtons/StepButtons'
import { StepHeading } from '../../components/StepHeading/StepHeading'
import { NAMESPACE } from '../../lib/constants'
import { messages } from '../../lib/messages'
import { DirectorateOfEqualityPaths } from '../../lib/paths'
import { DirectorateOfEqualityServiceProvidersDocument } from '../ServiceProviders/ServiceProviders.generated'
import {
  useDirectorateOfEqualityAvailableServiceProvidersQuery,
  useDirectorateOfEqualityGrantServiceProviderMutation,
} from './GrantServiceProvider.generated'

const TOTAL_STEPS = 2
const HEADING_ID = 'grant-service-provider-step'

const GrantServiceProvider = () => {
  useNamespaces(NAMESPACE)
  const { formatMessage } = useLocale()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [selected, setSelected] = useState<string | null>(null)
  const [showError, setShowError] = useState(false)
  const { data, loading, error } =
    useDirectorateOfEqualityAvailableServiceProvidersQuery({
      fetchPolicy: 'network-only',
    })
  const providers =
    data?.directorateOfEqualityAvailableServiceProviders?.items ?? []

  const backToList = () => navigate(DirectorateOfEqualityPaths.ServiceProviders)

  const [grant, { loading: granting }] =
    useDirectorateOfEqualityGrantServiceProviderMutation({
      refetchQueries: [
        { query: DirectorateOfEqualityServiceProvidersDocument },
      ],
      awaitRefetchQueries: true,
      onCompleted: (result) => {
        if (!result.grantDirectorateOfEqualityServiceProvider.success) {
          toast.error(formatMessage(messages.mutationError))
          return
        }
        toast.success(formatMessage(messages.serviceProviderGranted))
        navigate(DirectorateOfEqualityPaths.ServiceProviders, { replace: true })
      },
      onError: () => toast.error(formatMessage(messages.mutationError)),
    })

  const handleForward = () => {
    if (step === 1) {
      setStep(2)
      return
    }
    if (!selected) {
      setShowError(true)
      return
    }
    grant({ variables: { input: { id: selected } } })
  }

  return (
    <IntroWrapper
      desktopContentSpan="10/12"
      title={formatMessage(messages.grantPageTitle)}
      intro={formatMessage(messages.grantPageIntro)}
      serviceProvider={{
        slug: JAFNRETTISSTOFA_SLUG,
        tooltip: formatMessage(coreMessages.equalityTooltip),
      }}
    >
      <Box marginTop={2}>
        <StepHeading
          id={HEADING_ID}
          step={step}
          total={TOTAL_STEPS}
          title={formatMessage(
            step === 1 ? messages.grantNoticeTitle : messages.grantChooseTitle,
          )}
        />
        {step === 1 && (
          <Box marginTop={2}>
            <BulletList space={1}>
              <Bullet>{formatMessage(messages.grantNoticeSubmit)}</Bullet>
              <Bullet>{formatMessage(messages.grantNoticeRead)}</Bullet>
              <Bullet>{formatMessage(messages.grantNoticeScoring)}</Bullet>
            </BulletList>
          </Box>
        )}
        {step === 2 && (
          <GridRow marginTop={3}>
            <GridColumn span={['12/12', '12/12', '12/12', '9/12']}>
            {loading && <SkeletonLoader height={72} repeat={2} space={2} />}
            {!loading && error && <Problem error={error} noBorder={false} />}
            {!loading && !error && providers.length === 0 && (
              <Text>{formatMessage(messages.noAvailableServiceProviders)}</Text>
            )}
            {!loading && !error && providers.length > 0 && (
              <div
                role="radiogroup"
                aria-labelledby={HEADING_ID}
                aria-invalid={showError || undefined}
                aria-describedby={
                  showError ? 'grant-service-provider-error' : undefined
                }
              >
                <Stack space={2}>
                  {providers.map((provider) => (
                    <RadioButton
                      key={provider.id}
                      id={`grant-service-provider-${provider.id}`}
                      name="grant-service-provider"
                      value={provider.id}
                      label={provider.name}
                      subLabel={formatMessage(messages.nationalIdLine, {
                        nationalId: formatNationalId(provider.nationalId),
                      })}
                      checked={selected === provider.id}
                      onChange={() => {
                        setSelected(provider.id)
                        setShowError(false)
                      }}
                      large
                      backgroundColor="blue"
                    />
                  ))}
                </Stack>
              </div>
            )}
            <div role="alert">
              {showError && (
                <Box marginTop={1}>
                  <InputError
                    id="grant-service-provider-error"
                    errorMessage={formatMessage(
                      messages.selectServiceProviderError,
                    )}
                  />
                </Box>
              )}
            </div>
            </GridColumn>
          </GridRow>
        )}
        <StepButtons
          back={
            <Button
              variant="ghost"
              size="small"
              preTextIcon="arrowBack"
              disabled={granting}
              onClick={step === 1 ? backToList : () => setStep(1)}
            >
              {formatMessage(coreMessages.goBack)}
            </Button>
          }
          forward={
            <Button
              size="small"
              loading={granting}
              disabled={
                granting || (step === 2 && (loading || providers.length === 0))
              }
              onClick={handleForward}
            >
              {formatMessage(coreMessages.forward)}
            </Button>
          }
        />
      </Box>
    </IntroWrapper>
  )
}

export default GrantServiceProvider
