import StackedTitleAndDescription from '../../../components/StackedTitleAndDescription/StackedTitleAndDescription'
import { SimpleCardSkeleton } from '../../../components/Card'
import {
  Box,
  Bullet,
  BulletList,
  FocusableBox,
  Icon,
  Text,
} from '@island.is/island-ui/core'
import { useState } from 'react'
import { Case } from '../../../types/interfaces'
import * as styles from './Stakeholders.css'

interface Props {
  chosenCase: Case
}

export const StakeholdersCard = ({ chosenCase }: Props) => {
  const [showStakeholders, setShowStakeholders] = useState<boolean>(false)
  return (
    <FocusableBox onClick={() => setShowStakeholders(!showStakeholders)}>
      <SimpleCardSkeleton className={styles.relativeBox}>
        <StackedTitleAndDescription
          title={`Aðilar sem hafa fengið boð um þátttöku (${chosenCase?.stakeholders?.length})`}
        >
          <FocusableBox
            component="button"
            onClick={() => setShowStakeholders(!showStakeholders)}
            className={styles.blowout}
          >
            <Icon
              icon={showStakeholders ? 'remove' : 'add'}
              type="outline"
              size="small"
              color="blue400"
            />
          </FocusableBox>
          {showStakeholders && (
            <>
              <Text>
                Öllum er frjálst að taka þátt í samráðsgátt en eftirtöldum hefur
                verið boðið að senda inn umsögn:
              </Text>
              {chosenCase?.stakeholders.length < 1 && (
                <Text>Enginn listi skráður.</Text>
              )}
              <Box padding="smallGutter">
                <BulletList type="ul">
                  {chosenCase?.stakeholders.map((stakeholder, index) => {
                    return <Bullet key={index}>{stakeholder.name}</Bullet>
                  })}
                </BulletList>
              </Box>
            </>
          )}
        </StackedTitleAndDescription>
      </SimpleCardSkeleton>
    </FocusableBox>
  )
}

export default StakeholdersCard
