import { FC, ReactNode } from 'react'

import {
  Box,
  Checkbox,
  Input,
  RadioButton,
  Text,
} from '@island.is/island-ui/core'
import {
  BlueBox,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'
import {
  Case,
  CaseState,
  Defendant,
  SubpoenaType as SubpoenaTypeEnum,
  UpdateDefendantInput,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { grid } from '@island.is/judicial-system-web/src/utils/styles/recipes.css'

import * as styles from '../../Indictments/Subpoena/Subpoena.css'

interface SubpoenaTypeProps {
  subpoenaItems: {
    defendant: Defendant
    onUpdate: (update: UpdateDefendantInput) => void
    alternativeServiceDescriptionDisabled?: boolean
    subpoenaDisabled?: boolean
    children?: ReactNode
    toggleNewAlternativeService?: () => void
  }[]
  workingCase: Case
  required?: boolean
}

const SubpoenaType: FC<SubpoenaTypeProps> = ({
  subpoenaItems,
  workingCase,
  required = true,
}) => {
  return (
    <div>
      <SectionHeading title={'Tegund fyrirkalls'} required={required} />
      {subpoenaItems.map((item, index) => (
        <Box
          key={item.defendant.id}
          marginBottom={
            index === subpoenaItems.length - 1 ? 0 : item.children ? 5 : 3
          }
        >
          <Box marginBottom={item.children ? 2 : 0}>
            <BlueBox className={grid({ gap: 2 })}>
              <Text as="h4" variant="h4">
                {item.defendant.name}
              </Text>
              <Checkbox
                id={`alternativeService-${item.defendant.id}`}
                label={'Ákæra var birt með öðrum hætti'}
                checked={Boolean(item.defendant.isAlternativeService)}
                onChange={() => {
                  const { id: defendantId } = item.defendant
                  const { id: caseId } = workingCase
                  const isAlternativeService =
                    !item.defendant.isAlternativeService

                  item.toggleNewAlternativeService &&
                    item.toggleNewAlternativeService()

                  item.onUpdate({ caseId, defendantId, isAlternativeService })
                }}
                tooltip={
                  'Ef ákæra og fyrirkall eru birt utan gáttarinnar, t.d. í þinghaldi eða í Lögbirtingablaðinu, þá er hægt að haka í þennan reit til að komast áfram án þess að gefa út fyrirkall í gegnum Réttarvörslugátt.'
                }
                disabled={workingCase.state === CaseState.CORRECTING}
                backgroundColor="white"
                large
                filled
              />
              {item.defendant.isAlternativeService && (
                <Input
                  name="alternativeServiceDescription"
                  label={'Skráðu hvernig birting fór fram'}
                  autoComplete="off"
                  value={item.defendant.alternativeServiceDescription ?? ''}
                  placeholder={'T.d. í þinghaldi eða í Lögbirtingablaðinu'}
                  onChange={(evt) => {
                    const { id: defendantId } = item.defendant
                    const { id: caseId } = workingCase
                    const alternativeServiceDescription = evt.target.value

                    item.onUpdate({
                      caseId,
                      defendantId,
                      alternativeServiceDescription,
                    })
                  }}
                  disabled={
                    item.alternativeServiceDescriptionDisabled ||
                    workingCase.state === CaseState.CORRECTING
                  }
                  required
                />
              )}
              <Box className={styles.subpoenaTypeGrid}>
                <RadioButton
                  large
                  name={`subpoenaType-${item.defendant.id}`}
                  id={`subpoenaTypeAbsence${item.defendant.id}`}
                  backgroundColor="white"
                  label={'Útivistarfyrirkall'}
                  checked={
                    item.defendant.subpoenaType === SubpoenaTypeEnum.ABSENCE
                  }
                  onChange={() => {
                    const { id: defendantId } = item.defendant
                    const { id: caseId } = workingCase
                    const subpoenaType = SubpoenaTypeEnum.ABSENCE

                    item.onUpdate({ caseId, defendantId, subpoenaType })
                  }}
                  disabled={
                    item.subpoenaDisabled ||
                    workingCase.state === CaseState.CORRECTING
                  }
                />
                <RadioButton
                  large
                  name={`subpoenaType-${item.defendant.id}`}
                  id={`subpoenaTypeArrest${item.defendant.id}`}
                  backgroundColor="white"
                  label={'Handtökufyrirkall'}
                  checked={
                    item.defendant.subpoenaType === SubpoenaTypeEnum.ARREST
                  }
                  onChange={() => {
                    const { id: defendantId } = item.defendant
                    const { id: caseId } = workingCase
                    const subpoenaType = SubpoenaTypeEnum.ARREST

                    item.onUpdate({ caseId, defendantId, subpoenaType })
                  }}
                  disabled={
                    item.subpoenaDisabled ||
                    workingCase.state === CaseState.CORRECTING
                  }
                />
              </Box>
            </BlueBox>
          </Box>
          {item.children}
        </Box>
      ))}
    </div>
  )
}

export default SubpoenaType
