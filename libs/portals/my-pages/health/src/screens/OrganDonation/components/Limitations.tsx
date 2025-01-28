import { HealthDirectorateOrganDonationOrgan } from '@island.is/api/schema'
import {
  Box,
  Checkbox,
  Divider,
  GridColumn,
  GridContainer,
  GridRow,
  Input,
  Stack,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { useState } from 'react'
import { messages } from '../../../lib/messages'
import * as styles from '../OrganDonation.css'

interface LimitationsProps {
  data: HealthDirectorateOrganDonationOrgan[]
  selected?: string[] | null
  exceptionComment?: string
}

const Limitations = ({
  data,
  selected,
  exceptionComment,
}: LimitationsProps) => {
  useNamespaces('sp.health')
  const { formatMessage } = useLocale()
  const [checked, setChecked] = useState<Array<string>>(selected ?? [])
  const [comment, setComment] = useState<string>(exceptionComment ?? '')

  const handleCheckboxChange = (id: string, isChecked: boolean) => {
    setChecked((prevState) =>
      isChecked ? [...prevState, id] : prevState.filter((item) => item !== id),
    )
  }

  return (
    <Box marginTop={2} position="relative">
      <Stack space={2}>
        <Divider />
        <Box display="flex" flexDirection="row" flexWrap="wrap" width="full">
          {data?.map((y, yi) => (
            <Box
              key={`organ-donation-limitation-${yi}`}
              width="half"
              marginY="smallGutter"
            >
              <Checkbox
                id={y.id?.toString()}
                name={`selected-limitations-${y.id}`}
                label={y.name}
                value={y.id ?? ''}
                onChange={(e) =>
                  handleCheckboxChange(y.id ?? '', e.target.checked)
                }
                checked={checked.includes(y.id ?? '')}
              />
            </Box>
          ))}
          <Box
            key={`organ-donation-limitation-other`}
            width="half"
            marginY="smallGutter"
          >
            <Checkbox
              id={'other'}
              name={`selected-limitations-other`}
              label={formatMessage(messages.otherPascalCase)}
              value={comment}
              onChange={(e) => {
                setComment(e.target.value)
                handleCheckboxChange('other', e.target.checked)
              }}
              checked={checked.includes('other')}
            />
          </Box>
        </Box>
      </Stack>
      {checked.includes('other') && (
        <GridContainer
          className={
            checked.includes('other')
              ? styles.commentVisible
              : styles.commentHidden
          }
        >
          <GridRow>
            <GridColumn span={['7/7', '5/7']}>
              <Box marginY="gutter">
                <Input
                  id="organ-donation-limitation"
                  name="otherLimitatons"
                  textarea
                  label={formatMessage(messages.organRegistrationOtherLabel)}
                  placeholder={formatMessage(
                    messages.organRegistrationOtherText,
                  )}
                  maxLength={220}
                  onChange={(e) => setComment(e.target.value)}
                  value={comment}
                />
              </Box>
            </GridColumn>
          </GridRow>
        </GridContainer>
      )}
    </Box>
  )
}

export default Limitations
