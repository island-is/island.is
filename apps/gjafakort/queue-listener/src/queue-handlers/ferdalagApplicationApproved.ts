export const routingKeys = ['approved', 'manual-approved']

export const handler = async ({ Body }) => {
  const parsedBody = JSON.parse(Body)
  const message = JSON.parse(parsedBody.Message)
  console.log(
    'receiving message on gjafakort-ferdalag-application-approved',
    message,
  )
}
