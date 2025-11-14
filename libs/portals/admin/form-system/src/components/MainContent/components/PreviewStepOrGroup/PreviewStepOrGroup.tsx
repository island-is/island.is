import { FormSystemField, FormSystemScreen } from '@island.is/api/schema'
import { Box, Button, Text } from '@island.is/island-ui/core'
import { Dispatch, SetStateAction, useContext, useEffect } from 'react'
import { ControlContext } from '../../../../context/ControlContext'
import { NavbarSelectStatus } from '../../../../lib/utils/interfaces'
import { Preview } from '../Preview/Preview'
import { MultiSet } from './components/MultiSet'

interface Props {
  setOpenPreview: Dispatch<SetStateAction<boolean>>
}

export const PreviewStepOrGroup = ({ setOpenPreview }: Props) => {
  const { control, setSelectStatus } = useContext(ControlContext)
  const { activeItem, form } = control
  const { screens, fields } = form
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
      {type === 'Section' && (
        <>
          <Box marginBottom={2}>
            <Text variant="h2">{activeItem?.data?.name?.is}</Text>
          </Box>
          {screens
            ?.filter((screen) => screen?.sectionId === activeItem?.data?.id)
            .map((screen) => (
              <Box key={screen?.id} marginBottom={2}>
                <Box marginBottom={1}>
                  <Text variant="h3">{screen?.name?.is}</Text>
                </Box>
                {screen?.multiset !== 0 ? (
                  <MultiSet screen={screen as FormSystemScreen} />
                ) : (
                  fields
                    ?.filter((field) => field?.screenId === screen?.id)
                    .map((field) => (
                      <Preview
                        key={field?.id}
                        data={field as FormSystemField}
                        screenOrSection={true}
                      />
                    ))
                )}
              </Box>
            ))}
        </>
      )}
      {type === 'Screen' && (
        <div>
          <div>
            <Text variant="h2">{activeItem?.data?.name?.is}</Text>
          </div>
          {(activeItem.data as FormSystemScreen).multiset !== 0 ? (
            <MultiSet screen={activeItem.data as FormSystemScreen} />
          ) : (
            fields
              ?.filter((field) => field?.screenId === activeItem?.data?.id)
              .map((field) => (
                <Preview
                  key={field?.id}
                  data={field as FormSystemField}
                  screenOrSection={true}
                />
              ))
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
          Loka
        </Button>
      </Box>
    </Box>
  )
}
