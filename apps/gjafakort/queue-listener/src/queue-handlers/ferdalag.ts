const handler = async ({ Body }) => {
  const parsedBody = JSON.parse(Body)
  const message = JSON.parse(parsedBody.Message)
  console.log('receiving message on ferdalag-updates-queue', message)
}

export default handler
