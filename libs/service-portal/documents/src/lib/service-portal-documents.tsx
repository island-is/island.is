import React, { useState, useEffect } from 'react'
import { Typography, Box } from '@island.is/island-ui/core'

const ExternalData = () => {
  const [data, setData] = useState<any>([])

  useEffect(() => {
    async function fetchDocuments() {
      const res = await fetch('/documents', {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await res.json()
      setData(data)
    }
    fetchDocuments()
  }, [])

  return (
    <div>
      {data?.map((item) => (
        <Box border="standard" padding={2} marginTop={1} key={item.id}>
          <Typography variant="h3" as="h3">
            {item.name}
          </Typography>
        </Box>
      ))}
    </div>
  )
}

export const ServicePortalDocuments = () => {
  return (
    <>
      <Typography variant="h3" as="h3">
        Rafræn skjöl
      </Typography>
      <Box border="standard" padding={2} marginTop={1}>
        <Typography variant="h3" as="h3">
          Greiðsluseðill (Bifr.gjöld) - Ríkissjóðsinnheimtur
        </Typography>
      </Box>
      <ExternalData />
    </>
  )
}

export default ServicePortalDocuments
