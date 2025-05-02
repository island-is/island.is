import {
  Box,
  Button,
  GridColumn,
  GridRow,
  Input,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { signatures } from '../../lib/messages/signatures'
import { useLocale } from '@island.is/localization'
import * as styles from './SignaturesTab.css'
import { SignatureMember } from './SignatureMember'
import { OJOIApplication } from '../../lib/types'
import { SignatureInstitution } from './SignatureInstitution'
import { full } from './utils'
import { useSignatures } from '../../hooks/useSignatures'
import { AdvertPreview } from '../advertPreview/AdvertPreview'
import { RegularMember } from './RegularMember'
type Props = {
  application: OJOIApplication
  variant?: 'regular' | 'committee'
}

export const SignaturesTab = ({ application, variant = 'regular' }: Props) => {
  const { formatMessage: f } = useLocale()

  const isRegular = variant === 'regular'

  const {
    handleAddMember,
    handleRemoveMember,
    handleUpdateMember,
    handleUpdateChairman,
    handleAddRecord,
    handleRemoveRecord,
    handleUpdateSignature,
    signature,
    signatureHtml,
  } = useSignatures({ applicationId: application.id, variant: variant })

  return (
    <Box paddingY={4}>
      <Stack space={2}>
        <Stack space={4} dividers="regular">
          {signature.records?.map((record, recordIndex) => (
            <Stack space={2} key={recordIndex}>
              <SignatureInstitution
                institution={record.institution}
                signatureDate={record.signatureDate}
                onChange={(key, value) =>
                  handleUpdateSignature(key, value, recordIndex)
                }
                onDelete={
                  recordIndex > 0
                    ? () => handleRemoveRecord(recordIndex)
                    : undefined
                }
              />
              {!isRegular && (
                <Box border="standard" borderRadius="large" padding={2}>
                  <Stack space={2}>
                    <Text variant="h5">{f(signatures.headings.chairman)}</Text>
                    <RegularMember
                      {...record.chairman}
                      onChange={(key, value) =>
                        handleUpdateChairman(key, value, recordIndex)
                      }
                    />
                  </Stack>
                </Box>
              )}
              <Box border="standard" borderRadius="large" padding={2}>
                <Stack space={2}>
                  <Text variant="h5">
                    {isRegular
                      ? f(signatures.headings.signedBy)
                      : f(signatures.headings.committeeMembers)}
                  </Text>
                  {record.members?.map((member, memberIndex) => (
                    <SignatureMember
                      {...member}
                      regular={isRegular}
                      key={`${recordIndex}-${memberIndex}`}
                      onChange={(key, value) =>
                        handleUpdateMember(key, value, recordIndex, memberIndex)
                      }
                      onDelete={
                        memberIndex > 0
                          ? () => handleRemoveMember(recordIndex, memberIndex)
                          : undefined
                      }
                    />
                  ))}

                  <GridRow className={styles.gridRowSpacing}>
                    <GridColumn
                      className={styles.gridColumnSpacing}
                      span={full}
                    >
                      <Button
                        onClick={() => handleAddMember(recordIndex)}
                        variant="utility"
                        icon="add"
                        iconType="outline"
                      >
                        {f(signatures.buttons.addPerson)}
                      </Button>
                    </GridColumn>
                  </GridRow>
                </Stack>
              </Box>
              <Box border="standard" borderRadius="large" padding={2}>
                <Stack space={2}>
                  <Text variant="h5">
                    {f(signatures.headings.additionalSignature)}
                  </Text>
                  <Input
                    label={f(signatures.inputs.name.label)}
                    size="sm"
                    backgroundColor="blue"
                    name={`additional-${recordIndex}`}
                    defaultValue={record.additional}
                    onChange={(e) =>
                      handleUpdateSignature(
                        'additional',
                        e.target.value,
                        recordIndex,
                      )
                    }
                  />
                </Stack>
              </Box>
            </Stack>
          ))}
        </Stack>
        {isRegular && (
          <Button
            variant="utility"
            icon="add"
            iconType="outline"
            onClick={handleAddRecord}
          >
            {f(signatures.buttons.addInstitution)}
          </Button>
        )}
        <Stack space={2}>
          <Text variant="h5">{f(signatures.headings.preview)}</Text>
          <AdvertPreview advertText={signatureHtml} />
        </Stack>
      </Stack>
    </Box>
  )
}
