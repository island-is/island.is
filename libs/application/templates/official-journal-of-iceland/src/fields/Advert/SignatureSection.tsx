import { useEffect, useState } from 'react'
import {
  committeeSignatureTemplate,
  regularSignatureTemplate,
} from '../../components/HTMLEditor/templates/signatures'
import { getErrorViaPath } from '@island.is/application/core'
import { Box, StringOption } from '@island.is/island-ui/core'
import { FormGroup } from '../../components/FromGroup/FormGroup'
import { HTMLEditor } from '../../components/HTMLEditor/HTMLEditor'
import { signatureConfig } from '../../components/HTMLEditor/config/signatureConfig'
import { advert } from '../../lib/messages'
import {
  CommitteeSignatureState,
  InputFields,
  OJOIFieldBaseProps,
  RegularSignatureState,
  SignatureType,
} from '../../lib/types'
import { useFormatMessage } from '../../hooks'
import { Signatures } from '../../components/Signatures/Signatures'
import { AdditionalSignature } from '../../components/Signatures/Additional'
import { useFormContext } from 'react-hook-form'
type Props = Pick<
  OJOIFieldBaseProps,
  'application' | 'errors' | 'setBeforeSubmitCallback'
>

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

export const SignatureSection = ({
  application,
  errors,
  setBeforeSubmitCallback,
}: Props) => {
  const { f } = useFormatMessage(application)
  const { answers } = application
  const { setValue } = useFormContext()

  const [tabSelected, setTabSelected] = useState<SignatureType>('regular')

  const [regularSignatures, setRegularSignatures] =
    useState<RegularSignatureState>(
      answers?.advert?.signature?.regular ?? [{ ...emptyRegularSignature }],
    )

  const [committeeSignatures, setCommitteeSignatures] =
    useState<CommitteeSignatureState>({
      institution: answers?.advert?.signature?.committee.institution ?? '',
      date: answers?.advert?.signature?.committee.date ?? '',
      chairman: answers?.advert?.signature?.committee.chairman ?? {
        ...emptyChairman,
      },
      members: answers?.advert?.signature?.committee.members ?? [
        { ...emptyCommitteeMember },
        { ...emptyCommitteeMember },
      ],
    })

  useEffect(() => {
    setValue('advert.signature.regular', regularSignatures)
  }, [regularSignatures, setValue])

  useEffect(() => {
    setValue('advert.signature.committee', committeeSignatures)
  }, [committeeSignatures, setValue])

  const [additonalSignature, setAdditionalSignature] = useState(
    answers?.advert?.signature.additionalSignature ?? '',
  )

  return (
    <FormGroup
      title={f(advert.signatureChapter.title)}
      description={f(advert.signatureChapter.intro)}
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
          title={f(advert.general.preview)}
          value={
            tabSelected === 'regular'
              ? regularSignatureTemplate({
                  signatureGroups: regularSignatures,
                  additionalSignature: additonalSignature,
                })
              : committeeSignatureTemplate({
                  signature: committeeSignatures,
                  additionalSignature: additonalSignature,
                })
          }
          config={signatureConfig}
          readOnly={true}
          name={InputFields.advert.signatureContents}
          error={
            errors &&
            getErrorViaPath(errors, InputFields.advert.signatureContents)
          }
        />
      </Box>
    </FormGroup>
  )
}
