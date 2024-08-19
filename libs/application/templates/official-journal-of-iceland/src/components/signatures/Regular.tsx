import { Box, SkeletonLoader } from '@island.is/island-ui/core'

import * as styles from './Signatures.css'
import { InputFields } from '../../lib/types'
import {
  DEFAULT_REGULAR_SIGNATURE_COUNT,
  DEFAULT_REGULAR_SIGNATURE_MEMBER_COUNT,
  MINIMUM_REGULAR_SIGNATURE_MEMBER_COUNT,
  OJOJ_INPUT_HEIGHT as OJOI_INPUT_HEIGHT,
  SignatureTypes,
} from '../../lib/constants'
import { useApplication } from '../../hooks/useUpdateApplication'
import { getValueViaPath } from '@island.is/application/core'
import { regularSignatureSchema } from '../../lib/dataSchema'
import { InstitutionSignature } from './Institution'
import { RegularMember } from './RegularMember'
import { getRegularSignature } from '../../lib/utils'
import { AddRegularMember } from './AddRegularMember'
import { AddRegularSignature } from './AddRegularSignature'
import { RemoveRegularMember } from './RemoveRegularMember'

type Props = {
  applicationId: string
}

export const RegularSignature = ({ applicationId }: Props) => {
  const { application } = useApplication({
    applicationId,
  })

  const getSignature = () => {
    const currentSignature = getValueViaPath(
      application.answers,
      InputFields.signature.regular,
    )

    const parsed = regularSignatureSchema.safeParse(currentSignature)

    if (parsed.success) {
      return parsed.data
    }

    return getRegularSignature(
      DEFAULT_REGULAR_SIGNATURE_COUNT,
      DEFAULT_REGULAR_SIGNATURE_MEMBER_COUNT,
    )
  }

  const signature = getSignature()

  if (!signature)
    return <SkeletonLoader space={2} repeat={3} height={OJOI_INPUT_HEIGHT} />

  return (
    <>
      {signature?.map((signature, index) => {
        return (
          <Box key={index} className={styles.signatureWrapper}>
            <InstitutionSignature
              applicationId={applicationId}
              type="regular"
              signatureIndex={index}
            />
            <Box className={styles.wrapper}>
              {signature.members?.map((_, memberIndex) => {
                const member = signature.members?.at(memberIndex)
                return (
                  <RegularMember
                    key={`signature.${index}.member.${memberIndex}`}
                    applicationId={applicationId}
                    signatureIndex={index}
                    memberIndex={memberIndex}
                    member={member}
                  />
                )
              })}
              <AddRegularMember
                applicationId={applicationId}
                signatureIndex={index}
              />
            </Box>
          </Box>
        )
      })}
      <AddRegularSignature applicationId={applicationId} />
    </>
  )
}
