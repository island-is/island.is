import {
  Box,
  Bullet,
  BulletList,
  FocusableBox,
  Icon,
  Inline,
  LinkV2,
  Text,
  Tooltip,
} from '@island.is/island-ui/core'
import { useState } from 'react'
import * as styles from './BlowoutList.css'
import StackedTitleAndDescription from '../Stacked/Stacked'
import { CardSkeleton } from '../../../../components'
import { RelatedCase, Stakeholder } from '../../../../types/interfaces'
import localization from '../../Case.json'
import { sortLocale } from '../../../../utils/helpers'

interface Props {
  list: Array<Stakeholder> | Array<RelatedCase>
  isStakeholder?: boolean
  isEmpty?: boolean
}

export const BlowoutList = ({
  list,
  isStakeholder = false,
  isEmpty = false,
}: Props) => {
  const sortOption = isStakeholder ? 'name' : 'caseNumber'

  const sortedList = sortLocale({ list: list, sortOption: sortOption })
  const [showList, setShowList] = useState(false)
  const loc = isStakeholder
    ? localization['stakeholders']
    : localization['relatedCases']

  return (
    <Box display="block">
      <CardSkeleton className={styles.relativeBox}>
        <StackedTitleAndDescription title={`${loc.title} (${list?.length})`}>
          <FocusableBox
            component="button"
            onClick={() => setShowList(!showList)}
            className={styles.blowout}
          >
            <Icon
              icon={showList ? 'remove' : 'add'}
              type="outline"
              size="small"
              color="blue400"
            />
          </FocusableBox>
          {showList && (
            <>
              {isStakeholder && <Text>{loc.description}</Text>}
              {isStakeholder && isEmpty && <Text>{loc.noList}</Text>}
              {!isEmpty && (
                <Box padding="smallGutter">
                  <BulletList type="ul">
                    {isStakeholder
                      ? sortedList.map((item: Stakeholder, index: number) => {
                          return <Bullet key={index}>{item.name}</Bullet>
                        })
                      : sortedList.map((item: RelatedCase, index: number) => {
                          return (
                            <Bullet key={index}>
                              <Inline
                                flexWrap="nowrap"
                                alignY="bottom"
                                space={1}
                              >
                                <LinkV2
                                  href={`/mal/${item.id}`}
                                  color="blue400"
                                  underline="small"
                                  underlineVisibility="hover"
                                >
                                  {item.caseNumber}
                                </LinkV2>
                                <Tooltip placement="bottom" text={item.name} />
                              </Inline>
                            </Bullet>
                          )
                        })}
                  </BulletList>
                </Box>
              )}
            </>
          )}
        </StackedTitleAndDescription>
      </CardSkeleton>
    </Box>
  )
}

export default BlowoutList
