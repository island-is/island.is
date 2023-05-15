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
    <FocusableBox
      onClick={() => setShowStakeholders(!showStakeholders)}
      display="block"
    >
      <SimpleCardSkeleton className={styles.relativeBox}>
        <StackedTitleAndDescription
          title={`Boð um þátttöku (${chosenCase?.stakeholders?.length})`}
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
                Allir geta sent inn umsögn og verið áskrifendur að málum í
                Samráðsgátt. Í þessu máli var boð um þátttöku að auki sent
                eftirtöldum:
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
