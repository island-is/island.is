import { useUserInfo } from '@island.is/auth/react'
import {
  AlertMessage,
  Box,
  Bullet,
  BulletList,
  Button,
  Inline,
  Stack,
  Tag,
  Text,
} from '@island.is/island-ui/core'
import { Property } from '../components/property/Property'
import { advert, error, publishing, summary } from '../lib/messages'
import { OJOIFieldBaseProps } from '../lib/types'
import { useLocale } from '@island.is/localization'
import { MINIMUM_WEEKDAYS, Routes } from '../lib/constants'
import { addWeekdays, getFastTrack, parseZodIssue } from '../lib/utils'
import { useCategories } from '../hooks/useCategories'
import {
  advertValidationSchema,
  publishingValidationSchema,
  signatureValidationSchema,
} from '../lib/dataSchema'
import { useApplication } from '../hooks/useUpdateApplication'
import { ZodCustomIssue } from 'zod'
import { useType } from '../hooks/useType'
import { useDepartment } from '../hooks/useDepartment'
import { usePrice } from '../hooks/usePrice'
import { useEffect } from 'react'
import { signatures } from '../lib/messages/signatures'

export const Summary = ({
  application,
  setSubmitButtonDisabled,
  goToScreen,
}: OJOIFieldBaseProps) => {
  const { formatMessage: f, formatDate, formatNumber } = useLocale()
  const { application: currentApplication } = useApplication({
    applicationId: application.id,
  })

  const user = useUserInfo()

  const { type, loading: loadingType } = useType({
    typeId: currentApplication.answers.advert?.typeId,
  })

  const { price, loading: loadingPrice } = usePrice({
    applicationId: application.id,
  })

  const { department, loading: loadingDepartment } = useDepartment({
    departmentId: currentApplication.answers.advert?.departmentId,
  })

  const { categories, loading: loadingCategories } = useCategories()

  const selectedCategories = categories?.filter((c) =>
    currentApplication.answers?.advert?.categories?.includes(c.id),
  )

  const today = new Date()
  const estimatedDate = addWeekdays(today, MINIMUM_WEEKDAYS)

  const advertValidationCheck = advertValidationSchema.safeParse(
    currentApplication.answers,
  )

  const signatureValidationCheck = signatureValidationSchema.safeParse({
    signatures: currentApplication.answers.signatures,
    misc: currentApplication.answers.misc,
  })

  const publishingCheck = publishingValidationSchema.safeParse(
    currentApplication.answers.advert,
  )

  useEffect(() => {
    if (
      advertValidationCheck.success &&
      signatureValidationCheck.success &&
      publishingCheck.success
    ) {
      setSubmitButtonDisabled && setSubmitButtonDisabled(false)
    } else {
      setSubmitButtonDisabled && setSubmitButtonDisabled(true)
    }
  }, [
    advertValidationCheck,
    signatureValidationCheck,
    publishingCheck,
    setSubmitButtonDisabled,
  ])

  const requestedDate = application.answers.advert?.requestedDate
  const { fastTrack } = getFastTrack(
    requestedDate ? new Date(requestedDate) : new Date(),
  )

  return (
    <>
      <Box
        hidden={
          advertValidationCheck.success &&
          signatureValidationCheck.success &&
          publishingCheck.success
        }
      >
        <Stack space={2}>
          {!advertValidationCheck.success && (
            <AlertMessage
              type="warning"
              title={f(error.missingFieldsTitle, {
                x: f(advert.general.section),
              })}
              message={
                <Stack space={2}>
                  <BulletList color="black">
                    {advertValidationCheck.error.issues.map((issue) => {
                      const parsedIssue = parseZodIssue(issue as ZodCustomIssue)
                      return (
                        <Bullet key={issue.path.join('.')}>
                          {f(parsedIssue.message)}
                        </Bullet>
                      )
                    })}
                  </BulletList>
                  <Button
                    onClick={() => {
                      setSubmitButtonDisabled && setSubmitButtonDisabled(false)
                      goToScreen && goToScreen(Routes.ADVERT)
                    }}
                    size="small"
                    variant="text"
                    preTextIcon="arrowBack"
                  >
                    Opna kafla {f(advert.general.section)}
                  </Button>
                </Stack>
              }
            />
          )}
          {!signatureValidationCheck.success && (
            <AlertMessage
              type="warning"
              title={f(error.missingFieldsTitle, {
                x: f(signatures.general.section, {
                  abbreviation: 'a',
                }),
              })}
              message={
                <Stack space={2}>
                  <Text>
                    {f(error.missingSignatureFieldsMessage, {
                      x: <strong>Grunnupplýsinga</strong>,
                    })}
                  </Text>
                  <BulletList color="black">
                    {signatureValidationCheck.error.issues.map((issue) => {
                      const parsedIssue = parseZodIssue(issue as ZodCustomIssue)
                      return (
                        <Bullet key={issue.path.join('.')}>
                          {f(parsedIssue.message)}
                        </Bullet>
                      )
                    })}
                  </BulletList>
                  <Button
                    onClick={() => {
                      setSubmitButtonDisabled && setSubmitButtonDisabled(false)
                      goToScreen && goToScreen(Routes.ADVERT)
                    }}
                    size="small"
                    variant="text"
                    preTextIcon="arrowBack"
                  >
                    Opna kafla {f(advert.general.section)}
                  </Button>
                </Stack>
              }
            />
          )}
          {!publishingCheck.success && (
            <AlertMessage
              type="warning"
              title={f(error.missingFieldsTitle)}
              message={
                <Stack space={2}>
                  <BulletList color="black">
                    {publishingCheck.error.issues.map((issue) => {
                      const parsedIssue = parseZodIssue(issue as ZodCustomIssue)
                      return (
                        <Bullet key={issue.path.join('.')}>
                          {f(parsedIssue.message)}
                        </Bullet>
                      )
                    })}
                  </BulletList>
                  <Button
                    onClick={() => {
                      setSubmitButtonDisabled && setSubmitButtonDisabled(false)
                      goToScreen && goToScreen(Routes.PUBLISHING)
                    }}
                    size="small"
                    variant="text"
                    preTextIcon="arrowBack"
                  >
                    Opna kafla {f(publishing.general.section)}
                  </Button>
                </Stack>
              }
            />
          )}
        </Stack>
      </Box>

      <Stack space={0} dividers>
        <Property
          name={f(summary.properties.sender)}
          value={user.profile.name}
        />
        <Property
          loading={loadingType}
          name={f(summary.properties.type)}
          value={type?.title}
        />
        <Property
          name={f(summary.properties.title)}
          value={currentApplication.answers?.advert?.title}
        />
        <Property
          loading={loadingDepartment}
          name={f(summary.properties.department)}
          value={department?.title}
        />
        <Property
          name={f(summary.properties.submissionDate)}
          value={new Date().toLocaleDateString()}
        />
        <Property
          name={f(summary.properties.estimatedDate)}
          value={formatDate(estimatedDate)}
        />
        <Property
          name={f(summary.properties.fastTrack)}
          value={
            <Tag disabled variant={fastTrack ? 'rose' : 'blue'}>
              {f(
                fastTrack
                  ? summary.properties.fastTrackYes
                  : summary.properties.fastTrackNo,
              )}
            </Tag>
          }
        />
        <Property
          loading={loadingPrice}
          name={f(summary.properties.estimatedPrice)}
          value={`${formatNumber(price)}. kr`}
        />
        <Property
          loading={loadingCategories}
          name={f(summary.properties.classification)}
          value={selectedCategories?.map((c) => c.title).join(', ')}
        />
        <Property
          name={f(summary.properties.communicationChannels)}
          value={
            currentApplication.answers.advert?.channels?.length !== 0 && (
              <Inline flexWrap="wrap" space={1}>
                {currentApplication.answers.advert?.channels?.map(
                  (channel, i) => {
                    return (
                      <Tag variant="blue" disabled key={i}>
                        {channel.name}
                      </Tag>
                    )
                  },
                )}
              </Inline>
            )
          }
        />
        <Property
          loading={loadingCategories}
          name={f(summary.properties.message)}
          value={currentApplication.answers?.advert?.message}
        />
      </Stack>
    </>
  )
}

export default Summary
