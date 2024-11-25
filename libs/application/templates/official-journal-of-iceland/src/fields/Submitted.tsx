import { FormGroup } from '../components/form/FormGroup'
import { InputFields, OJOIFieldBaseProps } from '../lib/types'
import {
  Box,
  Button,
  Inline,
  LinkV2,
  SkeletonLoader,
  Tag,
} from '@island.is/island-ui/core'
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
import {
  AnswerOption,
  DEFAULT_COMMITTEE_SIGNATURE_MEMBER_COUNT,
  DEFAULT_REGULAR_SIGNATURE_COUNT,
  DEFAULT_REGULAR_SIGNATURE_MEMBER_COUNT,
  OJOI_INPUT_HEIGHT,
} from '../lib/constants'
import set from 'lodash/set'
import { getCommitteeSignature, getRegularSignature } from '../lib/utils'
import { HTMLEditor } from '../components/htmlEditor/HTMLEditor'
import { HTMLText } from '@island.is/regulations-tools/types'
import { useApplicationCase } from '../hooks/useApplicationCase'
export const Submitted = (props: OJOIFieldBaseProps) => {
  const { formatMessage, locale } = useLocale()

  const navigate = useNavigate()

  const slug =
    ApplicationConfigurations[ApplicationTypes.OFFICIAL_JOURNAL_OF_ICELAND].slug

  const { createApplication } = useApplication({
    applicationId: props.application.id,
  })

  const { caseData, loading } = useApplicationCase({
    applicationId: props.application.id,
  })

  const [updateApplicationMutation, { loading: updateLoading }] =
    useMutation(UPDATE_APPLICATION)

  const updateNewApplication = (id: string) => {
    let currentAnswers = {}

    currentAnswers = set(
      currentAnswers,
      InputFields.requirements.approveExternalData,
      AnswerOption.YES,
    )

    currentAnswers = set(currentAnswers, InputFields.signature.regular, [
      ...getRegularSignature(
        DEFAULT_REGULAR_SIGNATURE_COUNT,
        DEFAULT_REGULAR_SIGNATURE_MEMBER_COUNT,
      ),
    ])

    currentAnswers = set(currentAnswers, InputFields.signature.committee, {
      ...getCommitteeSignature(DEFAULT_COMMITTEE_SIGNATURE_MEMBER_COUNT),
    })

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

  const path = window.location.origin
  const isLocalhost = path.includes('localhost')
  const href = isLocalhost
    ? `http://localhost:4200/minarsidur/umsoknir#${props.application.id}`
    : `${path}/minarsidur/umsoknir#${props.application.id}`

  return (
    <FormGroup>
      <Box>
        {loading ? (
          <SkeletonLoader
            borderRadius="large"
            repeat={1}
            height={OJOI_INPUT_HEIGHT / 2}
          />
        ) : (
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
        )}
      </Box>
      {loading ? (
        <SkeletonLoader
          repeat={3}
          space={2}
          height={OJOI_INPUT_HEIGHT}
          borderRadius="large"
        />
      ) : (
        <Box border="standard" borderRadius="large">
          <HTMLEditor
            name="submitted.document"
            readOnly={true}
            hideWarnings={true}
            value={caseData?.html as HTMLText}
            config={{ toolbar: false }}
          />
        </Box>
      )}
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
