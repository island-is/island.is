import {
  Button,
  GridColumn,
  GridRow,
  Input,
  Stack,
} from '@island.is/island-ui/core'
import * as styles from './SignaturesTab.css'
import { signatures } from '../../lib/messages/signatures'
import { useLocale } from '@island.is/localization'
import { full, half, fraction } from './utils'
import { SignatureMemberKey } from '../../lib/dataSchema'

type Props = {
  regular?: boolean
  above?: string
  name?: string
  after?: string
  below?: string
  onChange: (key: SignatureMemberKey, value: string) => void
  onDelete?: () => void
}

export const RegularMember = ({
  above,
  name,
  after,
  below,
  onChange,
  onDelete,
}: Props) => {
  const { formatMessage: f } = useLocale()
  return (
    <Stack space={2}>
      <GridRow className={styles.gridRowSpacing}>
        <GridColumn className={styles.gridColumnSpacing} span={full}>
          <Input
            name="signature-member-above"
            maxLength={100}
            label={f(signatures.inputs.above.label)}
            size="sm"
            backgroundColor="blue"
            defaultValue={above}
            onChange={(e) => onChange('above', e.target.value)}
          />
        </GridColumn>
      </GridRow>
      <GridRow className={styles.gridRowSpacing}>
        <GridColumn className={styles.gridColumnSpacing} span={half}>
          <Input
            name="signature-member-name"
            maxLength={100}
            label={f(signatures.inputs.name.label)}
            size="sm"
            backgroundColor="blue"
            defaultValue={name}
            onChange={(e) => onChange('name', e.target.value)}
          />
        </GridColumn>
        <GridColumn className={styles.gridColumnSpacing} span={half}>
          <Input
            name="signature-member-after"
            maxLength={100}
            label={f(signatures.inputs.after.label)}
            size="sm"
            backgroundColor="blue"
            defaultValue={after}
            onChange={(e) => onChange('after', e.target.value)}
          />
        </GridColumn>
      </GridRow>
      <GridRow className={styles.gridRowSpacing}>
        <GridColumn className={styles.gridColumnSpacing} span={full}>
          <Input
            name="signature-member-below"
            maxLength={100}
            label={f(signatures.inputs.below.label)}
            size="sm"
            backgroundColor="blue"
            defaultValue={below}
            onChange={(e) => onChange('below', e.target.value)}
          />
        </GridColumn>
        <GridColumn
          className={`${styles.gridColumnSpacing} ${styles.alignBottom}`}
          span={fraction}
        >
          <Button
            disabled={!onDelete}
            variant="utility"
            icon="trash"
            iconType="outline"
            onClick={onDelete}
          />
        </GridColumn>
      </GridRow>
    </Stack>
  )
}
