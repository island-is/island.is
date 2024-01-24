import { useState } from 'react'
import { regularSignatureTemplate } from '../../components/HTMLEditor/templates/signatures'
import { getErrorViaPath } from '@island.is/application/core'
import { Box, StringOption } from '@island.is/island-ui/core'
import { FormGroup } from '../../components/FromGroup/FormGroup'
import { HTMLEditor } from '../../components/HTMLEditor/HTMLEditor'
import { signatureConfig } from '../../components/HTMLEditor/config/signatureConfig'
import { newCase } from '../../lib/messages'
import {
  CommitteeSignatureState,
  InputFields,
  OJOIFieldBaseProps,
  RegularSignatureState,
} from '../../lib/types'
import { useFormatMessage } from '../../hooks'
import { useLocale } from '@island.is/localization'
import { Signatures } from '../../components/Signatures/Signatures'
import { AdditionalSignature } from '../../components/Signatures/Additional'
type Props = Pick<OJOIFieldBaseProps, 'errors' | 'application'>

const emptyChairman = {
  textAbove: '',
  name: '',
  textBelow: '',
  textAfter: '',
}

const emptyCommitteeMember = {
  name: '',
  textAfter: '',
}

const emptyRegularSignature = {
  institution: '',
  date: '',
  members: [{ ...emptyChairman }],
}

export type TabLabel = 'regular' | 'committee'

export const SignatureSection = ({ application, errors }: Props) => {
  const { f } = useFormatMessage(application)
  const { answers } = application

  const [tabSelected, setTabSelected] = useState<TabLabel>('regular')

  const [regularSignatures, setRegularSignatures] =
    useState<RegularSignatureState>(
      answers?.case?.signature?.regular ?? [{ ...emptyRegularSignature }],
    )

  const [committeeSignatures, setCommitteeSignatures] =
    useState<CommitteeSignatureState>({
      institution: answers?.case?.signature?.committee.institution ?? '',
      date: answers?.case?.signature?.committee.date ?? '',
      chairman: answers?.case?.signature?.committee.chairman ?? {
        ...emptyChairman,
      },
      members: answers?.case?.signature?.committee.members ?? [
        { ...emptyCommitteeMember },
      ],
    })

  const [additonalSignature, setAdditionalSignature] = useState('')

  return (
    <FormGroup
      title={f(newCase.signatureChapter.title)}
      description={f(newCase.signatureChapter.intro)}
    >
      <Box width="full">
        <Signatures
          selectedTab={tabSelected}
          setSelectedTab={setTabSelected}
          application={application}
          errors={errors}
          regularState={regularSignatures}
          setRegularState={setRegularSignatures}
          committeeState={committeeSignatures}
          setCommitteeState={setCommitteeSignatures}
        />
        <AdditionalSignature
          application={application}
          errors={errors}
          signature={additonalSignature}
          setSignature={setAdditionalSignature}
        />
      </Box>
      <Box width="full">
        <HTMLEditor
          title={f(newCase.general.preview)}
          value={
            tabSelected === 'regular'
              ? regularSignatureTemplate({
                  signatureGroups: regularSignatures,
                  additionalSignature: additonalSignature,
                })
              : ''
          }
          config={signatureConfig}
          readOnly
          name={InputFields.case.signatureContents}
          error={
            errors &&
            getErrorViaPath(errors, InputFields.case.signatureContents)
          }
        />
      </Box>
    </FormGroup>
  )
}
