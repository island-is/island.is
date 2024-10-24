import { Box, Stack, Text } from '@island.is/island-ui/core'

import * as styles from './Signatures.css'
import { InstitutionSignature } from './Institution'
import { SignatureTypes } from '../../lib/constants'
import { CommitteeMember } from './CommitteeMember'
import { useApplication } from '../../hooks/useUpdateApplication'
import { isCommitteeSignature } from '../../lib/utils'
import { Chairman } from './Chairman'
import { getValueViaPath } from '@island.is/application/core'
import { InputFields } from '../../lib/types'
import { AdditionalSignature } from './Additional'
import { useLocale } from '@island.is/localization'
import { signatures } from '../../lib/messages/signatures'
import { AddCommitteeMember } from './AddCommitteeMember'

type Props = {
  applicationId: string
}

export const CommitteeSignature = ({ applicationId }: Props) => {
  const { formatMessage: f } = useLocale()
  const { application } = useApplication({
    applicationId,
  })

  const getSignature = () => {
    const currentAnswers = getValueViaPath(
      application.answers,
      InputFields.signature.committee,
    )

    if (isCommitteeSignature(currentAnswers)) {
      return currentAnswers
    }
  }

  const signature = getSignature()

  if (!signature) {
    return null
  }

  return (
    <>
      <Box className={styles.signatureWrapper}>
        <InstitutionSignature
          applicationId={applicationId}
          type={SignatureTypes.COMMITTEE}
        />
        <Chairman applicationId={applicationId} member={signature.chairman} />
        <Box className={styles.wrapper}>
          <Text variant="h5" marginBottom={2}>
            {f(signatures.headings.committeeMembers)}
          </Text>
          <Stack space={2} dividers skipLastDivider>
            {signature?.members?.map((member, index) => (
              <CommitteeMember
                key={index}
                applicationId={applicationId}
                memberIndex={index}
                member={member}
              />
            ))}
            <AddCommitteeMember applicationId={applicationId} />
          </Stack>
        </Box>
      </Box>
      <AdditionalSignature
        applicationId={applicationId}
        name={InputFields.signature.additionalSignature.committee}
      />
    </>
  )
}
