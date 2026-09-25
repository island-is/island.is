import {
  Box,
  Checkbox,
  GridColumn,
  GridRow,
  Hidden,
  Input,
  Select,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  ActionCard,
  CardLoader,
  IntroWrapper,
  m,
  useIsPhoneWidth,
} from '@island.is/portals/my-pages/core'
import ConversationAvailabilityAlert from './components/ConversationAvailabilityAlert'
import ConversationBackButton from './components/ConversationBackButton'
import ConversationCancelSubmit from './components/ConversationCancelSubmit'
import ConversationMobileBackHeader from './components/ConversationMobileBackHeader'
import MobileActionFooter from './components/MobileActionFooter'
import CertificateRequestForm, {
  CertificateFormState,
  toCertificateRequestInput,
} from './components/CertificateRequestForm'
import { Problem } from '@island.is/react-spa/shared'
import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { messages } from '../../lib/messages'
import { useTreatmentScopedPaths } from '../../utils/useTreatmentScopedPaths'
import { LocaleEnum } from '@island.is/portals/my-pages/graphql'
import { getWindowLabels } from './utils/messagingWindow'
import {
  getNewConversationPageMode,
  pickClosedRecipient,
} from './utils/recipientAvailability'
import { MAX_MESSAGE_LENGTH, MAX_TITLE_LENGTH } from './utils/constants'
import { Markdown } from '@island.is/shared/components'
import { HealthDirectorateHealthConversationRecipientAvailability as Availability } from '@island.is/api/schema'
import ClosedRecipientAlert from './components/ClosedRecipientAlert'
import * as styles from './HealthConversations.css'
import {
  useGetHealthConversationRecipientsForNewQuery,
  useCreateHealthConversationMutation,
  useCreateHealthCertificateRequestMutation,
} from './NewHealthConversation.generated'

const getRecipientKey = (recipient: {
  nodeId: string
  groupId: number
  treatmentId?: string | null
}) =>
  `${recipient.nodeId}-${recipient.groupId}${
    recipient.treatmentId ? `-${recipient.treatmentId}` : ''
  }`

const NewHealthConversation = () => {
  useNamespaces('sp.health')
  const { formatMessage, lang } = useLocale()
  const navigate = useNavigate()
  const paths = useTreatmentScopedPaths()
  const { isPhoneWidth } = useIsPhoneWidth()

  const [selectedRecipientKey, setSelectedRecipientKey] = useState<
    string | null
  >(null)
  const [selectedTypeCode, setSelectedTypeCode] = useState<string | null>(null)
  const [searchParams] = useSearchParams()
  const [messageText, setMessageText] = useState('')
  const [customTitle, setCustomTitle] = useState('')
  const [certificateForm, setCertificateForm] = useState<CertificateFormState>(
    {},
  )
  const [termsAccepted, setTermsAccepted] = useState(false)

  const { data, loading, error } =
    useGetHealthConversationRecipientsForNewQuery({
      fetchPolicy: 'cache-and-network',
      variables: { locale: lang === 'en' ? LocaleEnum.En : LocaleEnum.Is },
    })

  const initialLoading = loading && !data

  const [createMessage, { loading: sending }] =
    useCreateHealthConversationMutation({
      refetchQueries: ['GetHealthConversations'],
    })

  const [createCertificateRequest, { loading: sendingCertificate }] =
    useCreateHealthCertificateRequestMutation({
      refetchQueries: ['GetHealthConversations'],
    })

  const recipients = data?.healthDirectorateHealthConversationRecipients
  const pageMode = recipients
    ? getNewConversationPageMode(recipients)
    : undefined
  const closedRecipient = recipients
    ? pickClosedRecipient(recipients)
    : undefined
  const hasMultipleRecipients = (recipients?.length ?? 0) > 1

  const recipientOptions =
    recipients?.map((r) => {
      const hours = getWindowLabels(r.todaysWindow)
      return {
        label: r.name,
        value: getRecipientKey(r),
        description:
          r.availability === Availability.NEVER
            ? formatMessage(
                messages.healthConversationRecipientNotAllowedOption,
              )
            : r.availability === Availability.OPEN
            ? undefined
            : hours && !hours.isAllDay
            ? formatMessage(messages.healthConversationRecipientClosedOption, {
                name: r.name,
                openTime: hours.openLabel,
                closeTime: hours.closeLabel,
              })
            : formatMessage(
                messages.healthConversationRecipientClosedTodayOption,
              ),
      }
    }) ?? []

  const preselectedTreatment =
    paths.treatmentId ?? searchParams.get('treatment')
  const treatmentMatch = preselectedTreatment
    ? recipients?.find((r) => r.treatmentId === preselectedTreatment)
    : undefined
  const preselectedNode = searchParams.get('node')
  const nodeMatches = preselectedNode
    ? recipients?.filter((r) => r.nodeId === preselectedNode)
    : undefined
  const preselectMatchKey = treatmentMatch
    ? getRecipientKey(treatmentMatch)
    : nodeMatches?.length === 1
    ? getRecipientKey(nodeMatches[0])
    : null

  const effectiveRecipientKey =
    selectedRecipientKey ??
    preselectMatchKey ??
    (recipients?.length === 1 ? getRecipientKey(recipients[0]) : null)

  const recipient = recipients?.find(
    (r) => getRecipientKey(r) === effectiveRecipientKey,
  )

  const selectedRecipientOption =
    recipientOptions.find((o) => o.value === effectiveRecipientKey) ?? null

  // Care teams take a free-text title instead of a conversation type
  const usesCustomTitle =
    !!recipient?.treatmentId && recipient.allowsCustomTitle

  const typeOptions =
    recipient?.allowedMessageTypes.map((t) => ({
      label: t.title,
      value: t.patientInitiatedTypeCode,
      description: t.externalLinkUrl ? t.description ?? undefined : undefined,
    })) ?? []

  const selectedOption =
    typeOptions.find((o) => o.value === selectedTypeCode) ?? null

  const selectedType = recipient?.allowedMessageTypes.find(
    (t) => t.patientInitiatedTypeCode === selectedTypeCode,
  )
  const isCertificateSelected =
    !usesCustomTitle && !!selectedType?.isCertificate

  const isConversationBlocked =
    !!recipient && recipient.availability !== Availability.OPEN

  const certificateInput = toCertificateRequestInput(certificateForm)

  const isFormValid = isCertificateSelected
    ? !!certificateInput && termsAccepted
    : (usesCustomTitle ? !!customTitle.trim() : !!selectedTypeCode) &&
      !!messageText.trim() &&
      termsAccepted

  const sendingAny = sending || sendingCertificate

  const canSubmit = isFormValid && !sendingAny && !isConversationBlocked

  const handleTypeChange = (typeCode: string | null) => {
    const newType = recipient?.allowedMessageTypes.find(
      (t) => t.patientInitiatedTypeCode === typeCode,
    )

    if (newType?.externalLinkUrl) {
      window.open(newType.externalLinkUrl, '_blank', 'noopener,noreferrer')
      return
    }

    setSelectedTypeCode(typeCode)
    setCertificateForm({})
    if (newType?.isCertificate) {
      setMessageText('')
    }
  }

  const handleRecipientChange = (recipientKey: string | null) => {
    setSelectedRecipientKey(recipientKey)

    const newRecipient = recipients?.find(
      (r) => getRecipientKey(r) === recipientKey,
    )
    const typeStillAllowed = newRecipient?.allowedMessageTypes.some(
      (t) => t.patientInitiatedTypeCode === selectedTypeCode,
    )

    if (!typeStillAllowed) {
      handleTypeChange(null)
    }
  }

  const goToConversation = (conversationId?: string | null) => {
    if (conversationId) {
      navigate(paths.conversationDetail(conversationId))
    } else {
      navigate(paths.conversations)
    }
  }

  const handleSubmit = async () => {
    if (!canSubmit || !recipient) return

    try {
      if (usesCustomTitle) {
        const result = await createMessage({
          variables: {
            input: {
              nodeId: recipient.nodeId,
              groupId: recipient.groupId,
              treatmentId: recipient.treatmentId,
              title: customTitle.trim(),
              messageTextContent: messageText.trim(),
            },
          },
        })
        goToConversation(
          result.data?.healthDirectorateCreateHealthConversation?.id,
        )
        return
      }

      if (!selectedTypeCode || !selectedType) return

      if (isCertificateSelected) {
        if (!certificateInput) return
        const result = await createCertificateRequest({
          variables: {
            input: {
              nodeId: recipient.nodeId,
              groupId: recipient.groupId,
              treatmentId: recipient.treatmentId,
              ...certificateInput,
            },
          },
        })
        const certificateRequest =
          result.data?.healthDirectorateCreateCertificateRequest
        if (!certificateRequest) {
          toast.error(formatMessage(m.errorTitle))
          return
        }
        goToConversation(certificateRequest.conversationId)
        return
      }

      const result = await createMessage({
        variables: {
          input: {
            nodeId: recipient.nodeId,
            groupId: recipient.groupId,
            treatmentId: recipient.treatmentId,
            patientInitiatedTypeCode: selectedTypeCode,
            title: selectedType.title,
            messageTextContent: messageText.trim(),
          },
        },
      })
      goToConversation(
        result.data?.healthDirectorateCreateHealthConversation?.id,
      )
    } catch {
      toast.error(formatMessage(m.errorTitle))
    }
  }

  if (!initialLoading && !error && pageMode === 'contactOnly') {
    return (
      <Box marginTop={[1, 0, 0]}>
        <ConversationMobileBackHeader
          onClick={() => navigate(paths.conversations)}
        />
        <IntroWrapper
          title={messages.healthConversationsContactTitle}
          introComponent={
            <Markdown>
              {formatMessage(messages.healthConversationsContactIntro)}
            </Markdown>
          }
          desktopContentSpan="10/12"
        >
          <ActionCard
            heading={formatMessage(
              messages.healthConversationsContactWebChatTitle,
            )}
            text={formatMessage(messages.healthConversationsContactWebChatText)}
            cta={{
              url: formatMessage(messages.heilsuveraChatLink),
              label: formatMessage(
                messages.healthConversationsContactWebChatCta,
              ),
              variant: 'text',
            }}
          />
        </IntroWrapper>
      </Box>
    )
  }

  return (
    <Box marginTop={[1, 0, 0]}>
      <ConversationMobileBackHeader
        onClick={() => navigate(paths.conversations)}
      />
      <IntroWrapper
        title={messages.healthConversationsNewTitle}
        introComponent={
          <Markdown>
            {formatMessage(messages.healthConversationsNewIntro)}
          </Markdown>
        }
        desktopContentSpan="10/12"
      >
        {initialLoading && <CardLoader />}
        {error && <Problem error={error} noBorder={false} />}
        {!initialLoading && !error && !recipients && (
          <Problem
            type="no_data"
            noBorder={false}
            title={formatMessage(messages.healthConversationsNoRecipient)}
          />
        )}
        {!initialLoading &&
          !error &&
          pageMode === 'allClosed' &&
          closedRecipient && (
            <ClosedRecipientAlert recipient={closedRecipient} />
          )}
        {!initialLoading && !error && pageMode === 'form' && recipient && (
          <ConversationAvailabilityAlert recipient={recipient} />
        )}
        {!initialLoading && !error && pageMode === 'form' && (
          <Box className={styles.messageCard} background="white">
            <Hidden below="sm">
              <Box
                paddingX={[0, 5, 5]}
                paddingTop={[2, 3, 3]}
                className={styles.backButton}
              >
                <ConversationBackButton
                  onClick={() => navigate(paths.conversations)}
                />
              </Box>
            </Hidden>
            <Box paddingX={[0, 5, 5]} paddingTop={1}>
              <Text variant="h4" fontWeight="semiBold">
                {formatMessage(messages.healthConversationsCreate)}
              </Text>
              {!hasMultipleRecipients && recipient && (
                <Text variant="medium">
                  {formatMessage(messages.healthConversationTo, {
                    arg: recipient.name,
                  })}
                </Text>
              )}
            </Box>

            <Box
              paddingX={[0, 5, 5]}
              paddingTop={[3, 3, 4]}
              paddingBottom={[10, 5, 5]}
            >
              {(hasMultipleRecipients || !usesCustomTitle) && (
                <GridRow marginBottom={3}>
                  {hasMultipleRecipients && (
                    <GridColumn
                      span={['12/12', '6/12']}
                      paddingBottom={[2, 0, 0]}
                    >
                      <Select
                        name="recipient"
                        label={formatMessage(
                          messages.healthConversationsNewSelectRecipient,
                        )}
                        placeholder={formatMessage(
                          messages.healthConversationsNewSelectRecipientPlaceholder,
                        )}
                        options={recipientOptions}
                        value={selectedRecipientOption}
                        onChange={(opt) =>
                          handleRecipientChange(opt?.value ?? null)
                        }
                        backgroundColor="blue"
                        size="sm"
                        required
                      />
                    </GridColumn>
                  )}
                  {!usesCustomTitle && (
                    <GridColumn
                      span={
                        hasMultipleRecipients
                          ? ['12/12', '6/12']
                          : ['12/12', '8/12']
                      }
                    >
                      <Select
                        name="service-type"
                        label={formatMessage(
                          messages.healthConversationsNewSelectService,
                        )}
                        placeholder={formatMessage(
                          messages.healthConversationsNewSelectServicePlaceholder,
                        )}
                        options={typeOptions}
                        value={selectedOption}
                        onChange={(opt) => handleTypeChange(opt?.value ?? null)}
                        backgroundColor="blue"
                        size="sm"
                        required
                        isDisabled={!recipient || isConversationBlocked}
                      />
                    </GridColumn>
                  )}
                </GridRow>
              )}

              {usesCustomTitle && (
                <Box marginBottom={3}>
                  <Input
                    name="message-subject"
                    label={formatMessage(
                      messages.healthConversationsNewSubject,
                    )}
                    placeholder={formatMessage(
                      messages.healthConversationsNewSubjectPlaceholder,
                    )}
                    backgroundColor="blue"
                    size="sm"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    maxLength={MAX_TITLE_LENGTH}
                    disabled={isConversationBlocked}
                    required
                  />
                </Box>
              )}

              {!usesCustomTitle &&
                !isCertificateSelected &&
                selectedType?.instructions && (
                  <Box marginBottom={2} className={styles.typeInstructions}>
                    <Markdown>{selectedType.instructions}</Markdown>
                  </Box>
                )}

              {isCertificateSelected ? (
                <CertificateRequestForm
                  formState={certificateForm}
                  onChange={(patch) =>
                    setCertificateForm((state) => ({ ...state, ...patch }))
                  }
                  disabled={isConversationBlocked}
                  hidePaymentNotice={isConversationBlocked}
                  instructions={selectedType?.instructions}
                />
              ) : (
                <Box>
                  <Input
                    textarea
                    rows={8}
                    name="message-body"
                    label={`${formatMessage(m.messages)} (${
                      messageText.length
                    }/${MAX_MESSAGE_LENGTH})`}
                    placeholder={formatMessage(
                      messages.healthConversationsNewBodyPlaceholder,
                    )}
                    backgroundColor="blue"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    maxLength={MAX_MESSAGE_LENGTH}
                    disabled={isConversationBlocked}
                  />
                </Box>
              )}

              <Box
                marginTop={3}
                marginBottom={4}
                className={styles.termsCheckbox}
              >
                <Checkbox
                  id="terms-accept"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  label={formatMessage(
                    messages.healthConversationsNewTermsInline,
                  )}
                  disabled={isConversationBlocked}
                />
              </Box>

              <MobileActionFooter>
                <ConversationCancelSubmit
                  cancelLabel={formatMessage(messages.cancel)}
                  submitLabel={formatMessage(messages.healthConversationSend)}
                  onCancel={() => navigate(paths.conversations)}
                  onSubmit={handleSubmit}
                  submitDisabled={!canSubmit}
                  loading={sendingAny}
                  fluid={isPhoneWidth}
                />
              </MobileActionFooter>
            </Box>
          </Box>
        )}
      </IntroWrapper>
    </Box>
  )
}

export default NewHealthConversation
