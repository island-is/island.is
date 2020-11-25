import { useEffect } from 'react'

const { PUBLIC_URL } = process.env

const ContentfulEditor = () => {
  const redirectUri = PUBLIC_URL ? PUBLIC_URL : 'http://localhost:4200'
  const clientId = 'ZqbTA3hiGxhtc0K1CVu9F_jxx7AslP_sN6iZIaqKdlQ'

  useEffect(() => {
    location.href = `https://be.contentful.com/oauth/authorize?response_type=token&client_id=${clientId}&redirect_uri=${redirectUri}&scope=content_management_manage`
  }, [])

  return null
}

export default ContentfulEditor
