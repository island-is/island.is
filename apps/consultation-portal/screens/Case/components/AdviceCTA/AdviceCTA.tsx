import { SimpleCardSkeleton } from '../../../../components/Card'
import StackedTitleAndDescription from '../../../../components/StackedTitleAndDescription/StackedTitleAndDescription'
import { UserContext } from '../../../../context'
import { useLogIn } from '../../../../hooks'
import {
  advicePublishTypeKey,
  advicePublishTypeKeyHelper,
  pastAdvicePublishTypeKey,
} from '../../../../types/enums'
import { Case } from '../../../../types/interfaces'
import { Box, Button, Text } from '@island.is/island-ui/core'
import Link from 'next/link'
import { useContext } from 'react'
import localization from '../../Case.json'

interface Props {
  chosenCase: Case
}
export const AdviceCTACard = ({ chosenCase }: Props) => {
  const { isAuthenticated } = useContext(UserContext)
  const loc = localization['adviceCTACard']
  const LogIn = useLogIn()

  return (
    <SimpleCardSkeleton>
      {chosenCase.statusName === 'Til umsagnar' ? (
        <>
          <StackedTitleAndDescription
            title={loc.forReview.StackedTitleAndDescription.title}
          >
            <Text>
              {`
                 ${loc.forReview.StackedTitleAndDescription.text}
                 ${
                   advicePublishTypeKey[
                     advicePublishTypeKeyHelper[chosenCase.advicePublishTypeId]
                   ]
                 }
                 ${
                   !isAuthenticated
                     ? loc.forReview.StackedTitleAndDescription.loginText
                     : ''
                 }
              `}
            </Text>
          </StackedTitleAndDescription>
          <Box paddingTop={2}>
            {isAuthenticated ? (
              <Link href="#write-review" shallow>
                <Button fluid iconType="outline" nowrap as="a">
                  {loc.forReview.buttons.sendAdvice}
                </Button>
              </Link>
            ) : (
              <Button fluid iconType="outline" nowrap onClick={LogIn}>
                {loc.forReview.buttons.logIn}
              </Button>
            )}
          </Box>
        </>
      ) : chosenCase.statusName === 'Niðurstöður í vinnslu' ? (
        <StackedTitleAndDescription
          headingColor="blue400"
          title={loc.inProgress.StackedTitleAndDescription.title}
        >
          <Text>
            {`
              ${loc.inProgress.StackedTitleAndDescription.text}
            ${
              pastAdvicePublishTypeKey[
                advicePublishTypeKeyHelper[chosenCase.advicePublishTypeId]
              ]
            }
            ${loc.inProgress.StackedTitleAndDescription.textCont}
            `}
          </Text>
        </StackedTitleAndDescription>
      ) : (
        <StackedTitleAndDescription
          headingColor="blue400"
          title={loc.published.titleAndDescription.title}
        >
          <Text>
            {` 
              ${loc.published.titleAndDescription.text}
              ${
                pastAdvicePublishTypeKey[
                  advicePublishTypeKeyHelper[chosenCase.advicePublishTypeId]
                ]
              } 
              ${loc.published.titleAndDescription.textCont}

            `}
          </Text>
        </StackedTitleAndDescription>
      )}
    </SimpleCardSkeleton>
  )
}
export default AdviceCTACard
