export const routingKeys = ['rejected']

export const handler = async ({ Body }) => {
  const parsedBody = JSON.parse(Body)
  const message = JSON.parse(parsedBody.Message)
  console.log(
    'receiving message on gjafakort-yay-application-rejected',
    message,
  )
}
