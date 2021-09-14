import React from 'react'
import { Box, Button, Divider, Icon, Text } from '@island.is/island-ui/core'
import { useRouter } from 'next/router'

interface InfoProps {
  id: string
  label: string
  url: string
  info: string | undefined
}

interface Props {
  info: InfoProps[]
  error: boolean
}

const FormInfo = ({ info, error }: Props) => {
  const router = useRouter()

  return (
    <>
      {info.map((item, index) => {
        const err = error && item.info === undefined
        return (
          <span key={'overview-' + index} id={item.id}>
            <Divider />

            <Box
              display="flex"
              justifyContent="spaceBetween"
              alignItems="flexStart"
              paddingY={[4, 4, 5]}
            >
              <Box marginRight={3}>
                <Text fontWeight="semiBold" color={err ? 'red600' : 'dark400'}>
                  {item.label}
                  {err && '*'}
                </Text>
                <Text>{item.info}</Text>
              </Box>

              <Button
                icon="pencil"
                iconType="filled"
                variant="utility"
                onClick={() => {
                  router.push(item.url)
                }}
              >
                Breyta
              </Button>
            </Box>
          </span>
        )
      })}
    </>
  )
}

export default FormInfo
