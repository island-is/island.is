import { Box, Button, Text } from '@island.is/island-ui/core'
import { SimpleCardSkeleton } from '../../../components/Card'
import StackedTitleAndDescription from '../../../components/StackedTitleAndDescription/StackedTitleAndDescription'
import Link from 'next/link'
import { useLogIn } from '../../../utils/helpers'
import { useContext } from 'react'
import { UserContext } from '../../../context'
import { Case } from '../../../types/interfaces'
interface Props {
  chosenCase: Case
}
export const AdviceCTACard = ({ chosenCase }: Props) => {
  const { isAuthenticated } = useContext(UserContext)
  const LogIn = useLogIn()

  return (
    <SimpleCardSkeleton>
      {chosenCase.statusName === 'Til umsagnar' ? (
        <>
          <StackedTitleAndDescription title="Viltu senda umsögn?">
            <Text>
              Öllum er frjálst að taka þátt í samráðinu.
              {!isAuthenticated && ' Skráðu þig inn og sendu umsögn.'}
            </Text>
          </StackedTitleAndDescription>
          <Box paddingTop={2}>
            {isAuthenticated ? (
              <Link href="#write-review" shallow>
                <Button fluid iconType="outline" nowrap as="a">
                  Senda umsögn
                </Button>
              </Link>
            ) : (
              <Button fluid iconType="outline" nowrap onClick={LogIn}>
                Skrá mig inn
              </Button>
            )}
          </Box>
        </>
      ) : chosenCase.statusName === 'Niðurstöður í vinnslu' ? (
        <StackedTitleAndDescription
          headingColor="blue400"
          title="Niðurstöður í vinnslu"
        >
          <Text>
            Umsagnarfrestur er liðinn. Umsagnir voru birtar jafnóðum og þær
            bárust.
          </Text>
        </StackedTitleAndDescription>
      ) : (
        <StackedTitleAndDescription headingColor="blue400" title="Lokið">
          <Text>
            Umsagnarfrestur er liðinn. Umsagnir voru birtar jafnóðum og þær
            bárust. Niðurstöður samráðsins hafa verið birtar og málinu lokið.
          </Text>
        </StackedTitleAndDescription>
      )}
    </SimpleCardSkeleton>
  )
}
