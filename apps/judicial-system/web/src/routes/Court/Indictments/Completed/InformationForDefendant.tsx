import React, { useContext } from 'react'
import { AnimatePresence } from 'motion/react'

import { Box, Checkbox, Text } from '@island.is/island-ui/core'
import { informationForDefendantMap } from '@island.is/judicial-system/types'
import {
  BlueBox,
  FormContext,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'
import { Defendant } from '@island.is/judicial-system-web/src/graphql/schema'
import useVerdict from '@island.is/judicial-system-web/src/utils/hooks/useVerdict'

export const InformationForDefendant = ({
  defendant,
}: {
  defendant: Defendant
}) => {
  const { workingCase, setWorkingCase } = useContext(FormContext)

  const { setAndSendVerdictToServer } = useVerdict()

  const { verdict } = defendant
  if (!verdict) return null

  const defendantCheckboxes = Array.from(
    informationForDefendantMap.entries(),
  ).map(([key, value]) => ({
    label: value.label,
    value: key,
    tooltip: value.detail,
  }))

  return (
    <AnimatePresence>
      <Box>
        <SectionHeading
          title={'Upplýsingagjöf til dómfellda'}
          marginBottom={2}
          heading="h4"
        />
        <Text marginBottom={3}>
          Vinsamlegast hakið við þau atriði sem upplýsa verður dómfellda um við
          birtingu dómsins.
        </Text>
        <BlueBox>
          {defendantCheckboxes.map((checkbox, indexChecbox) => (
            <React.Fragment key={`${verdict.id}-${checkbox.value}`}>
              <Checkbox
                label={checkbox.label}
                id={`${verdict.id}-${checkbox.value}`}
                name={`${verdict.id}-${checkbox.value}`}
                checked={verdict.serviceInformationForDefendant?.includes(
                  checkbox.value,
                )}
                tooltip={checkbox?.tooltip}
                large
                filled
                onChange={(target) => {
                  setAndSendVerdictToServer(
                    {
                      defendantId: defendant.id,
                      caseId: workingCase.id,
                      serviceInformationForDefendant: target.target.checked
                        ? [
                            ...(verdict.serviceInformationForDefendant || []),
                            checkbox.value,
                          ]
                        : (verdict.serviceInformationForDefendant || []).filter(
                            (item) => item !== checkbox.value,
                          ),
                    },
                    setWorkingCase,
                  )
                }}
              />
              {defendantCheckboxes.length - 1 !== indexChecbox && (
                <Box marginBottom={2} />
              )}
            </React.Fragment>
          ))}
        </BlueBox>
      </Box>
    </AnimatePresence>
  )
}
