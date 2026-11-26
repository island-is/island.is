import { useEffect, useRef, useState } from 'react'
import { MessageDescriptor } from 'react-intl'
import { useNavigate } from 'react-router-dom'
import copyToClipboard from 'copy-to-clipboard'
import addMonths from 'date-fns/addMonths'

import { DirectorateOfEqualityApiKeyType } from '@island.is/api/schema'
import {
  AlertMessage,
  Box,
  Button,
  GridColumn,
  GridRow,
  Input,
  Select,
  toast,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  IntroWrapper,
  JAFNRETTISSTOFA_SLUG,
  m as coreMessages,
} from '@island.is/portals/my-pages/core'

import { StepButtons } from '../../components/StepButtons/StepButtons'
import { StepHeading } from '../../components/StepHeading/StepHeading'
import {
  DEFAULT_VALIDITY,
  NO_EXPIRY,
  VALIDITY_OPTIONS,
  Validity,
} from '../../lib/apiKeys'
import { useDirectorateOfEqualityCompanyQuery } from '../../lib/company.generated'
import { NAMESPACE } from '../../lib/constants'
import { messages } from '../../lib/messages'
import { DirectorateOfEqualityPaths } from '../../lib/paths'
import { DirectorateOfEqualityApiKeysDocument } from '../ApiKeys/ApiKeys.generated'
import { useDirectorateOfEqualityIssueApiKeyMutation } from './CreateApiKey.generated'

const TOTAL_STEPS = 2

const VALIDITY_LABELS: Record<Validity, MessageDescriptor> = {
  [NO_EXPIRY]: messages.validityNone,
  3: messages.validity3,
  6: messages.validity6,
  12: messages.validity12,
  24: messages.validity24,
}

const CreateApiKey = () => {
  useNamespaces(NAMESPACE)
  const { formatMessage } = useLocale()
  const navigate = useNavigate()
  const [label, setLabel] = useState('')
  const [validity, setValidity] = useState<Validity>(DEFAULT_VALIDITY)
  const [type, setType] = useState<DirectorateOfEqualityApiKeyType | null>(null)
  const [issuedKey, setIssuedKey] = useState<string | null>(null)
  const keyInputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)
  const { data: companyData } = useDirectorateOfEqualityCompanyQuery()
  const isServiceProvider =
    !!companyData?.directorateOfEqualityCompany?.serviceProviderApprovedAt

  const backToList = () =>
    navigate(DirectorateOfEqualityPaths.ApiKeys, { replace: !!issuedKey })

  const [issueKey, { loading: issuing }] =
    useDirectorateOfEqualityIssueApiKeyMutation({
      refetchQueries: [{ query: DirectorateOfEqualityApiKeysDocument }],
      onCompleted: (result) =>
        setIssuedKey(result.issueDirectorateOfEqualityApiKey.key),
      onError: () => toast.error(formatMessage(messages.mutationError)),
    })

  useEffect(() => {
    if (issuedKey) {
      keyInputRef.current?.focus()
    }
  }, [issuedKey])

  const validityOptions = VALIDITY_OPTIONS.map((value) => ({
    value,
    label: formatMessage(VALIDITY_LABELS[value]),
  }))
  const typeOptions = [
    {
      value: DirectorateOfEqualityApiKeyType.COMPANY,
      label: formatMessage(messages.keyTypeCompany),
    },
    {
      value: DirectorateOfEqualityApiKeyType.SERVICE_PROVIDER,
      label: formatMessage(messages.keyTypeServiceProvider),
    },
  ]

  const isFormValid = !isServiceProvider || !!type

  const handleIssue = () =>
    issueKey({
      variables: {
        input: {
          label: label.trim() || null,
          expiresAt:
            validity === NO_EXPIRY
              ? null
              : addMonths(new Date(), validity).toISOString(),
          type: type ?? DirectorateOfEqualityApiKeyType.COMPANY,
        },
      },
    })

  const step = issuedKey ? 2 : 1

  return (
    <IntroWrapper
      desktopContentSpan="10/12"
      title={formatMessage(messages.createCompanyKey)}
      intro={formatMessage(messages.createKeyPageIntro)}
      serviceProvider={{
        slug: JAFNRETTISSTOFA_SLUG,
        tooltip: formatMessage(coreMessages.equalityTooltip),
      }}
    >
      <Box marginTop={2}>
        <StepHeading
          id="create-api-key-step"
          step={step}
          total={TOTAL_STEPS}
          title={formatMessage(
            issuedKey ? messages.keyReadyTitle : messages.createKeyFormTitle,
          )}
        />
        <GridRow marginTop={3}>
          <GridColumn span={['12/12', '12/12', '12/12', '9/12']}>
            {issuedKey ? (
              <>
                <AlertMessage
                  type="warning"
                  message={formatMessage(messages.keyCreatedWarning)}
                />
                <Box marginTop={2}>
                  <Input
                    ref={keyInputRef}
                    name="issued-api-key"
                    label={formatMessage(messages.keyValue)}
                    value={issuedKey}
                    readOnly
                    size="sm"
                  />
                </Box>
              </>
            ) : (
              <>
                <Input
                  name="api-key-label"
                  label={formatMessage(messages.keyLabel)}
                  placeholder={formatMessage(
                    messages.keyLabelPlaceholderCompany,
                  )}
                  value={label}
                  onChange={(event) => setLabel(event.target.value)}
                  backgroundColor="blue"
                  size="sm"
                  maxLength={100}
                />
                {isServiceProvider && (
                  <Box marginTop={3}>
                    <Select
                      name="api-key-type"
                      label={formatMessage(messages.keyType)}
                      placeholder={formatMessage(messages.keyTypePlaceholder)}
                      options={typeOptions}
                      value={
                        typeOptions.find((option) => option.value === type) ??
                        null
                      }
                      onChange={(option) => option && setType(option.value)}
                      backgroundColor="blue"
                      size="sm"
                    />
                  </Box>
                )}
                <Box marginTop={3}>
                  <Select
                    name="api-key-validity"
                    label={formatMessage(messages.validity)}
                    options={validityOptions}
                    value={validityOptions.find(
                      (option) => option.value === validity,
                    )}
                    onChange={(option) => option && setValidity(option.value)}
                    backgroundColor="blue"
                    size="sm"
                  />
                </Box>
              </>
            )}
          </GridColumn>
        </GridRow>
        <StepButtons
          back={
            issuedKey ? (
              <Button variant="ghost" size="small" onClick={backToList}>
                {formatMessage(coreMessages.close)}
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="small"
                preTextIcon="arrowBack"
                disabled={issuing}
                onClick={backToList}
              >
                {formatMessage(coreMessages.goBack)}
              </Button>
            )
          }
          forward={
            issuedKey ? (
              <Button
                size="small"
                icon="copy"
                iconType="outline"
                onClick={() =>
                  copyToClipboard(issuedKey)
                    ? toast.success(formatMessage(messages.copyKeySuccess))
                    : toast.error(formatMessage(messages.copyKeyError))
                }
              >
                {formatMessage(messages.copyKey)}
              </Button>
            ) : (
              <Button
                size="small"
                loading={issuing}
                disabled={issuing || !isFormValid}
                onClick={handleIssue}
              >
                {formatMessage(coreMessages.forward)}
              </Button>
            )
          }
        />
      </Box>
    </IntroWrapper>
  )
}

export default CreateApiKey
