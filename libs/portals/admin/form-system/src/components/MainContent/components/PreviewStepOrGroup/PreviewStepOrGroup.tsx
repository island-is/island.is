import { Dispatch, SetStateAction, useContext, useEffect } from 'react'
import { Box, Button, Text } from '@island.is/island-ui/core'
import { ControlContext } from '../../../../context/ControlContext'
import { FormSystemGroup, FormSystemInput } from '@island.is/api/schema'
import { NavbarSelectStatus } from '../../../../lib/utils/interfaces'
import { Preview } from '../Preview/Preveiw'
import { MultiSet } from './components/MultiSet'

interface Props {
  setOpenPreview: Dispatch<SetStateAction<boolean>>
}

export const PreviewStepOrGroup = ({ setOpenPreview }: Props) => {
  const { control, setSelectStatus } = useContext(ControlContext)
  const { activeItem, form } = control
  const { groupsList: groups, inputsList: inputs } = form
  const { type } = activeItem

  useEffect(() => {
    setSelectStatus(NavbarSelectStatus.ON_WITHOUT_SELECT)
  }, [])
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
            <Text variant="h2">{activeItem?.data?.name?.is}</Text>
          </Box>
          {groups
            ?.filter((g) => g?.stepGuid === activeItem?.data?.guid)
            .map((g) => (
              <Box key={g?.guid} marginBottom={2}>
                <Box marginBottom={1}>
                  <Text variant="h3">{g?.name?.is}</Text>
                </Box>
                {g?.multiSet !== 0 ? (
                  <MultiSet group={g as FormSystemGroup} />
                ) : (
                  inputs
                    ?.filter((i) => i?.groupGuid === g?.guid)
                    .map((i) => (
                      <Preview key={i?.guid} data={i as FormSystemInput} />
                    ))
                )}
              </Box>
            ))}
        </>
      )}
      {type === 'Group' && (
        <div>
          <div>
            <Text variant="h2">{activeItem?.data?.name?.is}</Text>
          </div>
          {(activeItem.data as FormSystemGroup).multiSet !== 0 ? (
            <MultiSet group={activeItem.data as FormSystemGroup} />
          ) : (
            inputs
              ?.filter((i) => i?.groupGuid === activeItem?.data?.guid)
              .map((i) => <Preview key={i?.guid} data={i as FormSystemInput} />)
          )}
        </div>
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
