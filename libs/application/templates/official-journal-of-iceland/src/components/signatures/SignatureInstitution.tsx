import {
  GridRow,
  GridColumn,
  DatePicker,
  Input,
  Button,
} from '@island.is/island-ui/core'
import { signatures } from '../../lib/messages'
import { fraction, half } from './utils'
import * as styles from './SignaturesTab.css'
import { useLocale } from '@island.is/localization'
import { SignatureInstitutionKey } from '../../lib/dataSchema'

type Props = {
  institution?: string
  signatureDate?: string
  onChange: (key: SignatureInstitutionKey, value: string) => void
  onDelete?: () => void
}

export const SignatureInstitution = ({
  institution,
  signatureDate,
  onChange,
  onDelete,
}: Props) => {
  const { formatMessage: f, formatDate } = useLocale()
  const today = formatDate(new Date())

  return (
    <GridRow className={styles.gridRowSpacing}>
      <GridColumn className={styles.gridColumnSpacing} span={half}>
        <Input
          name="signature-institution"
          maxLength={100}
          label={f(signatures.inputs.institution.label)}
          placeholder={f(signatures.inputs.institution.placeholder)}
          size="sm"
          backgroundColor="blue"
          defaultValue={institution}
          onChange={(e) => onChange('institution', e.target.value)}
        />
      </GridColumn>
      <GridColumn className={styles.gridColumnSpacing} span={half}>
        <DatePicker
          locale="is"
          name="signature-date"
          label={f(signatures.inputs.date.label)}
          placeholderText={today}
          size="sm"
          backgroundColor="blue"
          selected={signatureDate ? new Date(signatureDate) : undefined}
          handleChange={(date) => onChange('signatureDate', date.toISOString())}
        />
      </GridColumn>
      <GridColumn
        className={`${styles.gridColumnSpacing} ${styles.alignBottom}`}
        span={fraction}
      >
        <Button
          disabled={!onDelete}
          onClick={onDelete}
          variant="utility"
          icon="trash"
          iconType="outline"
        />
      </GridColumn>
    </GridRow>
  )
}
