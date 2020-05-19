const handler = async ({ Body }) => {
  const parsedBody = JSON.parse(Body)
  const message = JSON.parse(parsedBody.Message)
  console.log('receiving message on yay-updates-queue', message)
}

export default handler
