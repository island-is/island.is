import { FormGroup } from '../components/form/FormGroup'
import { InputFields, OJOIFieldBaseProps } from '../lib/types'
import {
  AlertMessage,
  Box,
  Button,
  Inline,
  LinkV2,
  SkeletonLoader,
  Stack,
  Tag,
} from '@island.is/island-ui/core'
import { useState } from 'react'
import { submitted } from '../lib/messages/submitted'
import { useLocale } from '@island.is/localization'
import { useApplication } from '../hooks/useUpdateApplication'
import { useNavigate } from 'react-router-dom'
import {
  ApplicationConfigurations,
  ApplicationTypes,
} from '@island.is/application/types'
import { useMutation } from '@apollo/client'
import { UPDATE_APPLICATION } from '@island.is/application/graphql'
import { OJOI_INPUT_HEIGHT } from '../lib/constants'
import set from 'lodash/set'
import { useApplicationCase } from '../hooks/useApplicationCase'
import { YesOrNoEnum } from '@island.is/application/core'
import { AdvertPreview } from '../components/advertPreview/AdvertPreview'
export const Submitted = (props: OJOIFieldBaseProps) => {
  const { formatMessage, locale } = useLocale()

  const navigate = useNavigate()

  const slug =
    ApplicationConfigurations[ApplicationTypes.OFFICIAL_JOURNAL_OF_ICELAND].slug

  const {
    createApplication,
    postApplication,
    postApplicationError,
    postApplicationLoading,
  } = useApplication({
    applicationId: props.application.id,
  })

  // Check if the onEntry postApplication action failed during state transition
  const externalPostStatus = (
    props.application.externalData as Record<string, { status?: string }>
  )?.successfullyPosted?.status
  const onEntryPostFailed = externalPostStatus === 'failure'

  const [resubmitted, setResubmitted] = useState(false)

  const {
    caseData,
    loading,
    error: caseError,
    refetch: refetchCase,
  } = useApplicationCase({
    applicationId: props.application.id,
  })

  const handleResubmit = async () => {
    await postApplication(props.application.id, () => {
      setResubmitted(true)
      refetchCase()
    })
  }

  const showPostError =
    (onEntryPostFailed && !resubmitted) || postApplicationError

  const [updateApplicationMutation, { loading: updateLoading }] =
    useMutation(UPDATE_APPLICATION)

  const updateNewApplication = (id: string) => {
    let currentAnswers = {}

    currentAnswers = set(
      currentAnswers,
      InputFields.requirements.approveExternalData,
      YesOrNoEnum.YES,
    )

    updateApplicationMutation({
      variables: {
        locale,
        input: {
          id: id,
          answers: currentAnswers,
        },
      },
      onCompleted: () => {
        navigate(`/${slug}/${id}`)
      },
    })
  }

  const subject = props.application.answers.advert?.title

  const path = window.location.origin
  const isLocalhost = path.includes('localhost')
  const href = isLocalhost
    ? `http://localhost:4200/minarsidur/umsoknir#${props.application.id}`
    : `${path}/minarsidur/umsoknir#${props.application.id}`

  return (
    <FormGroup>
      <Box>
        {showPostError ? (
          <Stack space={[2, 2, 3]}>
            <AlertMessage
              type="error"
              title={formatMessage(submitted.errors.postApplicationErrorTitle)}
              message={formatMessage(
                submitted.errors.postApplicationErrorMessage,
              )}
            />
            <Button
              loading={postApplicationLoading}
              onClick={handleResubmit}
              variant="primary"
            >
              {formatMessage(submitted.buttons.resubmit)}
            </Button>
          </Stack>
        ) : loading ? (
          <SkeletonLoader
            borderRadius="large"
            repeat={1}
            height={OJOI_INPUT_HEIGHT / 2}
          />
        ) : caseError ? (
          <Stack space={[2, 2, 3]}>
            <AlertMessage
              type="error"
              title={formatMessage(submitted.errors.caseErrorTitle)}
              message={formatMessage(submitted.errors.caseErrorMessage)}
            />
          </Stack>
        ) : (
          <Stack space={[2, 2, 3]}>
            <Inline space={1} flexWrap="wrap">
              <Tag disabled outlined variant="blue">
                {caseData?.status}
              </Tag>
              <Tag disabled outlined variant="blueberry">
                {caseData?.department}
              </Tag>
              <Tag disabled outlined variant="darkerBlue">
                {caseData?.type}
              </Tag>
              {caseData?.categories?.map((category, i) => (
                <Tag disabled outlined variant="purple" key={i}>
                  {category}
                </Tag>
              ))}
            </Inline>
            <Box border="standard" borderRadius="large">
              <AdvertPreview
                advertSubject={subject}
                advertType={caseData?.type}
                advertText={caseData?.html}
              />
            </Box>
          </Stack>
        )}
      </Box>
      <Box display="flex" marginY={4} justifyContent="spaceBetween">
        <Button
          loading={updateLoading}
          onClick={() =>
            createApplication((data) => {
              if (!data) {
                return
              }

              updateNewApplication(data.createApplication.id)
            })
          }
          variant="ghost"
        >
          {formatMessage(submitted.general.newApplication)}
        </Button>
        <LinkV2 href={href}>
          <Button>
            {formatMessage(submitted.general.returnToServicePortal)}
          </Button>
        </LinkV2>
      </Box>
    </FormGroup>
  )
}
