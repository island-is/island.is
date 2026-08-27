import { useLazyQuery, useMutation } from '@apollo/client'
import { FormSystemField } from '@island.is/api/schema'
import {
  GET_ORGANIZATION_ZENDESK_INSTANCE,
  UPDATE_FIELD,
  UPDATE_ORGANIZATION_ZENDESK_INSTANCE,
} from '@island.is/form-system/graphql'
import { m } from '@island.is/form-system/ui'
import {
  Box,
  Button,
  Checkbox,
  GridColumn as Column,
  GridRow as Row,
  Icon,
  Input,
  RadioButton,
  Stack,
  Text,
  LinkV2,
} from '@island.is/island-ui/core'
import { useContext, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { ControlContext } from '../../../../context/ControlContext'

type ZendeskInstanceConfig = {
  serviceSystemInstance: string
  serviceSystemBrandID: string
}

const parseZendeskBrandIds = (brandIds?: string | null) =>
  brandIds
    ?.split(';')
    .map((brandId) => brandId.trim())
    .filter(Boolean) ?? []

const unsupportedZendeskInstanceMessage =
  'Zendesk instance er ekki gilt. Athugaðu skráningu þína í Contentful.'

export const SubmissionUrls = () => {
  const { formatMessage } = useIntl()
  const {
    control,
    controlDispatch,
    formUpdate,
    submissionUrls,
    setSubmissionUrls,
    submissionUrlInput,
    setSubmissionUrlInput,
  } = useContext(ControlContext)
  const { form, isReadOnly } = control
  const [updateField] = useMutation(UPDATE_FIELD)
  const [showInput, setShowInput] = useState(false)
  const [getZendeskInstance] = useLazyQuery(GET_ORGANIZATION_ZENDESK_INSTANCE, {
    fetchPolicy: 'no-cache',
  })
  const [updateOrganizationZendeskInstance] = useMutation(
    UPDATE_ORGANIZATION_ZENDESK_INSTANCE,
  )

  const zendeskBrandId =
    form.organizationZendeskInstance?.zendeskBrandId?.trim()
  const zendeskInstance =
    form.organizationZendeskInstance?.zendeskInstance?.trim()
  const [zendeskBrandIdOptions, setZendeskBrandIdOptions] = useState(() =>
    parseZendeskBrandIds(zendeskBrandId),
  )
  const [isUnsupportedZendeskInstance, setIsUnsupportedZendeskInstance] =
    useState(false)

  const sanitizeId = (url: string) => url.replace(/[^a-zA-Z0-9-_]/g, '-')

  const persistZendeskApplicantRequirements = async () => {
    const applicantFields = (control.form.fields ?? []).filter(
      (f): f is FormSystemField => !!f && f.fieldType === 'APPLICANT',
    )

    const toUpdate = applicantFields.filter((f) => {
      const fs = f.fieldSettings as Record<string, unknown> | null | undefined
      return fs?.isPhoneRequired != null && fs?.isEmailRequired != null
    })

    const results = await Promise.allSettled(
      toUpdate.map((field) =>
        updateField({
          variables: {
            input: {
              id: field.id,
              updateFieldDto: {
                fieldSettings: {
                  ...(field.fieldSettings ?? {}),
                  isEmailRequired: true,
                },
              },
            },
          },
        }),
      ),
    )
    const failures = results.filter((r) => r.status === 'rejected')
    if (failures.length > 0) {
      throw new Error(
        `Failed to persist Zendesk applicant requirements: ${JSON.stringify(
          failures,
        )}`,
      )
    }
  }

  const updateZendeskInstance = async () => {
    const data = await getZendeskInstance({
      variables: {
        input: { nationalId: form.organizationNationalId },
      },
    })
    const zendeskInstanceInfo =
      data?.data?.formSystemOrganizationZendeskInstance

    if (!zendeskInstanceInfo) {
      return
    }

    let parsed: ZendeskInstanceConfig
    try {
      parsed = JSON.parse(zendeskInstanceInfo)
    } catch {
      return
    }

    const brandIdOptions = parseZendeskBrandIds(parsed.serviceSystemBrandID)
    const nextZendeskBrandId =
      brandIdOptions.length === 1
        ? brandIdOptions[0]
        : brandIdOptions.includes(
            form.organizationZendeskInstance?.zendeskBrandId ?? '',
          )
        ? form.organizationZendeskInstance?.zendeskBrandId ?? ''
        : ''

    setZendeskBrandIdOptions(brandIdOptions)

    try {
      await updateOrganizationZendeskInstance({
        variables: {
          input: {
            zendeskInstance: parsed.serviceSystemInstance,
            zendeskBrandId: nextZendeskBrandId,
            organizationId: form.organizationId,
            formId: form.id,
          },
        },
      })
    } catch {
      setIsUnsupportedZendeskInstance(true)
      return
    }

    setIsUnsupportedZendeskInstance(false)

    if (
      parsed.serviceSystemInstance ===
        form.organizationZendeskInstance?.zendeskInstance &&
      nextZendeskBrandId === form.organizationZendeskInstance?.zendeskBrandId
    ) {
      return
    }

    controlDispatch({
      type: 'CHANGE_ORGANIZATION_ZENDESK_INSTANCE',
      payload: {
        zendeskInstance: parsed.serviceSystemInstance,
        zendeskBrandId: nextZendeskBrandId,
      },
    })
  }

  useEffect(() => {
    updateZendeskInstance()
  }, [])

  useEffect(() => {
    const brandIdOptions = parseZendeskBrandIds(zendeskBrandId)
    setZendeskBrandIdOptions((currentBrandIdOptions) =>
      brandIdOptions.length > 1 ||
      currentBrandIdOptions.length === 0 ||
      (brandIdOptions.length === 1 &&
        !currentBrandIdOptions.includes(brandIdOptions[0]))
        ? brandIdOptions
        : currentBrandIdOptions,
    )
  }, [zendeskBrandId])

  const selectedZendeskBrandId =
    zendeskBrandIdOptions.length === 1
      ? zendeskBrandIdOptions[0]
      : zendeskBrandId?.includes(';')
      ? ''
      : zendeskBrandId
  const displayedZendeskBrandIds =
    zendeskBrandIdOptions.length > 0 ? zendeskBrandIdOptions : ['']

  return (
    <>
      <Box marginTop={2} />
      <Row>
        <Column span="8/10">
          <Text variant="medium">
            Hér velur þú hvert umsóknirnar fyrir þetta tiltekna form verða
            sendar. Það er hægt að senda á Zendesk málakerfið eða sérsmíðaða
            vefþjónustu stofnunar yfir X-Road.{' '}
          </Text>
          <Box marginTop={1} />
          <Text variant="medium">
            Ef notuð er vefþjónusta stofnunar yfir X-Road þá vinsamlega kynnið
            ykkur þessar leiðbeiningar:
          </Text>
          <LinkV2
            href="https://www.notion.so/Tengingar-vi-ytri-m-lakerfi-2a45a76701d680e3af0bee6e41786126"
            newTab={true}
            color="blue400"
            underline="small"
          >
            Tengingar við ytri málakerfi
            <Box component="span" marginLeft={1} display="inlineBlock">
              <Icon icon="open" type="outline" size="small" />
            </Box>
          </LinkV2>
        </Column>
      </Row>
      {!showInput && !submissionUrlInput && (
        <Box marginTop={5}>
          <Button
            onClick={() => setShowInput(true)}
            variant="ghost"
            disabled={isReadOnly}
          >
            {formatMessage(m.addFormUrl)}
          </Button>
        </Box>
      )}

      {(showInput || submissionUrlInput) && (
        <Row>
          <Column>
            <Box marginTop={5}>
              <Input
                label={formatMessage(m.newFormUrlButton)}
                placeholder="/r1/IS/..."
                name="submission-url"
                value={submissionUrlInput}
                readOnly={isReadOnly}
                backgroundColor="white"
                onChange={(e) => {
                  setSubmissionUrlInput(e.target.value)
                }}
              />
              <Box marginTop={1} marginBottom={1}>
                <Text variant="small">
                  {formatMessage(m.urlReuseEncouragement)}
                </Text>
              </Box>
            </Box>
          </Column>
        </Row>
      )}

      {submissionUrlInput && (
        <Row>
          <Column span="10/10">
            <RadioButton
              label={submissionUrlInput}
              large
              name="submissionUrl"
              id="customSubmissionUrl"
              disabled={isReadOnly}
              checked={form.submissionServiceUrl === submissionUrlInput}
              onChange={() => {
                controlDispatch({
                  type: 'CHANGE_SUBMISSION_URL',
                  payload: { value: submissionUrlInput },
                })
                formUpdate({
                  ...form,
                  submissionServiceUrl: submissionUrlInput,
                })
                setSubmissionUrls((prevUrls) => {
                  const next = submissionUrlInput.trim()
                  if (!next) return prevUrls
                  return prevUrls.includes(next)
                    ? prevUrls
                    : [next, ...prevUrls]
                })
              }}
            />
          </Column>
        </Row>
      )}
      <Box marginTop={3} />
      <Stack space={2}>
        {submissionUrls?.map(
          (url) =>
            url !== submissionUrlInput && (
              <Row key={url}>
                <Column span="10/10">
                  <RadioButton
                    label={url}
                    large
                    name="submissionUrl"
                    id={`submission-url-${sanitizeId(url ?? '')}`}
                    disabled={isReadOnly}
                    checked={form.submissionServiceUrl === url}
                    onChange={() => {
                      controlDispatch({
                        type: 'CHANGE_SUBMISSION_URL',
                        payload: { value: url ?? '' },
                      })
                      formUpdate({ ...form, submissionServiceUrl: url ?? '' })
                    }}
                  />
                </Column>
              </Row>
            ),
        )}
        {form.submissionServiceUrl && form.submissionServiceUrl !== 'zendesk' && (
          <Row>
            <Column span="10/10">
              <Checkbox
                label={formatMessage(m.useValidate)}
                checked={!!form.useValidate}
                disabled={isReadOnly}
                onChange={(e) => {
                  controlDispatch({
                    type: 'CHANGE_USE_VALIDATE',
                    payload: { value: e.target.checked },
                  })
                  formUpdate({ ...form, useValidate: e.target.checked })
                }}
              />
            </Column>
          </Row>
        )}
        <Box marginTop={3} />

        <Row>
          <Column span="10/10">
            <RadioButton
              label="Zendesk"
              large
              name="submissionUrl"
              id="zendesk"
              checked={form.submissionServiceUrl === 'zendesk'}
              disabled={isReadOnly}
              onChange={async (e) => {
                controlDispatch({
                  type: 'CHANGE_SUBMISSION_URL',
                  payload: { value: e.target.id, useValidate: false },
                })

                formUpdate({
                  ...form,
                  submissionServiceUrl: e.target.id,
                  useValidate: false,
                })
                await persistZendeskApplicantRequirements()
              }}
            />
          </Column>
          {/* {form.submissionServiceUrl === 'zendesk' && (
            <Column span="5/10">
              <Blockquote>
                <Text variant="small" whiteSpace="preWrap" lineHeight="sm">
                  <code>
                    Zendesk instance:{' '}
                    {form.organizationZendeskInstance?.zendeskInstance
                      ? form.organizationZendeskInstance.zendeskInstance
                      : 'digitaliceland'}
                    .zendesk.com
                  </code>
                </Text>
                <Text variant="small" whiteSpace="preWrap" lineHeight="sm">
                  <code>
                    Zendesk brand ID:{' '}
                    {form.organizationZendeskInstance?.zendeskBrandId}
                  </code>
                </Text>
              </Blockquote>
            </Column>
          )} */}
        </Row>
        {form.submissionServiceUrl === 'zendesk' && (
          <>
            <Row>
              <Column span="8/10">
                <Text variant="medium">
                  Brand Id og Instance eru sótt sjálfkrafa í Contentful frá
                  stofnuninni sem á formið. Ef það vantar brand Id eða instance
                  þá þarf að setja það upp í Contentful. <br />
                  Ef stofnunin á fleiri en eitt Brand Id þá er hægt að velja á
                  milli þeirra hér.
                </Text>
              </Column>
            </Row>
            {displayedZendeskBrandIds.map((brandId, index) => {
              const zendeskBrandInputId = `zendesk-brand-id-${
                sanitizeId(brandId) || `missing-${index}`
              }-${index}`

              return (
                <Row key={zendeskBrandInputId}>
                  <Column span="6/10">
                    <RadioButton
                      label={
                        <strong>
                          Brand Id:{' '}
                          {brandId || (
                            <Text
                              as="span"
                              color="red600"
                              variant="small"
                              fontWeight="semiBold"
                            >
                              Zendesk brand Id vantar
                            </Text>
                          )}
                        </strong>
                      }
                      large
                      name="zendeskBrandId"
                      id={zendeskBrandInputId}
                      checked={selectedZendeskBrandId === brandId}
                      disabled={
                        isReadOnly || !brandId || isUnsupportedZendeskInstance
                      }
                      onChange={() => {
                        controlDispatch({
                          type: 'CHANGE_ORGANIZATION_ZENDESK_INSTANCE',
                          payload: {
                            zendeskInstance: zendeskInstance ?? '',
                            zendeskBrandId: brandId,
                          },
                        })
                        formUpdate({
                          ...form,
                          organizationZendeskInstance: {
                            zendeskInstance: zendeskInstance ?? '',
                            zendeskBrandId: brandId,
                          },
                        })
                      }}
                      subLabel={
                        isUnsupportedZendeskInstance ? (
                          <Text
                            as="span"
                            color="red600"
                            variant="small"
                            fontWeight="semiBold"
                          >
                            {unsupportedZendeskInstanceMessage}
                          </Text>
                        ) : zendeskInstance ? (
                          `${zendeskInstance}.zendesk.com`
                        ) : (
                          <Text
                            as="span"
                            color="red600"
                            variant="small"
                            fontWeight="semiBold"
                          >
                            Zendesk instance vantar
                          </Text>
                        )
                      }
                    />
                  </Column>
                </Row>
              )
            })}

            <Row>
              <Column span="9/10">
                <Checkbox
                  label={formatMessage(m.zendeskPrivate)}
                  checked={!!form.zendeskInternal}
                  disabled={isReadOnly}
                  onChange={(e) => {
                    controlDispatch({
                      type: 'CHANGE_ZENDESK_INTERNAL',
                      payload: { value: e.target.checked },
                    })
                    formUpdate({ ...form, zendeskInternal: e.target.checked })
                  }}
                />
              </Column>
            </Row>
          </>
        )}
      </Stack>
    </>
  )
}
