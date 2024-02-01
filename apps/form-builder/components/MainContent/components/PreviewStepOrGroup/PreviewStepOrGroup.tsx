import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react'
import { Box, Button, Text } from '@island.is/island-ui/core'
import Preview from '../Preview/Preview'
import MultiSet from './MultiSet/MultiSet'
import FormBuilderContext from '../../../../context/FormBuilderContext'
import { IGroup, NavbarSelectStatus } from '../../../../types/interfaces'

interface Props {
  setOpenPreview: Dispatch<SetStateAction<boolean>>
}

export default function PreviewStepOrGroup({ setOpenPreview }: Props) {
  const { lists, setSelectStatus } = useContext(FormBuilderContext)
  const { activeItem, groups, inputs } = lists
  const { type } = activeItem
  const [groups2DArr, setGroups2DArr] = useState<IGroup[][]>([])

  useEffect(() => {
    setSelectStatus(NavbarSelectStatus.ON_WITHOUT_SELECT)
    groups.forEach((g) => {
      if (g.multiSet !== 0) {
        setGroups2DArr((prev) => [...prev, [g]])
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    console.log(groups2DArr)
  }, [groups2DArr])

  return (
    <Box
      display="flex"
      flexDirection="column"
      height="full"
      background="blue100"
      padding={2}
    >
      {type === 'Step' && (
        <>
          <Box marginBottom={2}>
            <Text variant="h2">{activeItem.data.name.is}</Text>
          </Box>
          {groups
            .filter((g) => g.stepGuid === activeItem.data.guid)
            .map((g) => (
              <Box key={g.guid} marginBottom={2}>
                <Box marginBottom={1}>
                  <Text variant="h3">{g.name.is}</Text>
                </Box>
                {g.multiSet !== 0 ? (
                  <MultiSet group={g} />
                ) : (
                  inputs
                    .filter((i) => i.groupGuid === g.guid)
                    .map((i) => (
                      <Preview
                        key={i.guid}
                        data={i}
                        isLarge={false}
                        inputSettings={i.inputSettings}
                      />
                    ))
                )}
              </Box>
            ))}
        </>
      )}
      {type === 'Group' && (
        <Box>
          <Box>
            <Text variant="h2">{activeItem.data.name.is}</Text>
          </Box>
          {(activeItem.data as IGroup).multiSet !== 0 ? (
            <MultiSet group={activeItem.data as IGroup} />
          ) : (
            inputs
              .filter((i) => i.groupGuid === activeItem.data.guid)
              .map((i) => (
                <Preview
                  key={i.guid}
                  data={i}
                  isLarge={false}
                  inputSettings={i.inputSettings}
                />
              ))
          )}
        </Box>
      )}
      <Box display="flex" justifyContent="flexEnd" alignItems="flexEnd">
        <Button
          onClick={() => {
            setSelectStatus(NavbarSelectStatus.OFF)
            setOpenPreview(false)
          }}
        >
          exit
        </Button>
      </Box>
    </Box>
  )
}
