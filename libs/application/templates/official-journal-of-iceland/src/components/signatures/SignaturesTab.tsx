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
import { SignatureInstitution } from './SignatureInstititution'
import { full } from './utils'
import { useSignatures } from '../../hooks/useSignatures'
import { AdvertPreview } from '../advertPreview/AdvertPreview'
type Props = {
  application: OJOIApplication
  variant?: 'regular' | 'committee'
}

export const SignaturesTab = ({ application, variant = 'regular' }: Props) => {
  const { formatMessage: f } = useLocale()

  const {
    handleAddMember,
    handleRemoveMember,
    handleUpdateMember,
    handleAddRecord,
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
              />
              <Box border="standard" borderRadius="large" padding={2}>
                <Stack space={2}>
                  {record.members?.map((member, memberIndex) => (
                    <SignatureMember
                      {...member}
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
        <Button
          variant="utility"
          icon="add"
          iconType="outline"
          onClick={handleAddRecord}
        >
          {f(signatures.buttons.addInstitution)}
        </Button>
        <Stack space={2}>
          <Text variant="h5">{f(signatures.headings.preview)}</Text>
          <AdvertPreview advertText={signatureHtml} />
        </Stack>
      </Stack>
    </Box>
  )
}
