import { Box, Button, Text } from '@island.is/island-ui/core'
import { SimpleCardSkeleton } from '../../../components/Card'
import StackedTitleAndDescription from '../../../components/StackedTitleAndDescription/StackedTitleAndDescription'
import Link from 'next/link'
import { useLogIn } from '../../../hooks'
import { useContext } from 'react'
import { UserContext } from '../../../context'
import { Case } from '../../../types/interfaces'
import {
  advicePublishTypeKey,
  advicePublishTypeKeyHelper,
  pastAdvicePublishTypeKey,
} from '../../../types/enums'
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
              {`
                 Málið er opið til umsagnar og öllum frjálst að taka þátt.
                 ${
                   advicePublishTypeKey[
                     advicePublishTypeKeyHelper[chosenCase.advicePublishTypeId]
                   ]
                 }
                 ${!isAuthenticated && 'Skráðu þig inn og sendu umsögn.'}
              `}
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
        <StackedTitleAndDescription headingColor="blue400" title="Í vinnslu">
          <Text>
            {`
              Umsagnarfrestur er liðinn.
            ${
              pastAdvicePublishTypeKey[
                advicePublishTypeKeyHelper[chosenCase.advicePublishTypeId]
              ]
            }
              Niðurstöður samráðsins eru væntanlegar.
            `}
          </Text>
        </StackedTitleAndDescription>
      ) : (
        <StackedTitleAndDescription
          headingColor="blue400"
          title="Samráði lokið"
        >
          <Text>
            {` 
              Umsagnarfrestur er liðinn.
              ${
                pastAdvicePublishTypeKey[
                  advicePublishTypeKeyHelper[chosenCase.advicePublishTypeId]
                ]
              } 
              Niðurstöður hafa verið birtar og samráði lokið.
            `}
          </Text>
        </StackedTitleAndDescription>
      )}
    </SimpleCardSkeleton>
  )
}
