import { NextApiRequest, NextApiResponse } from 'next'

async function getByName(name: string) {
  const response = await fetch(
    `https://api.ja.is/skra/v1/people?name=${name}&sort=name`,
    {
      headers: {
        Authorization: process.env.NATIONAL_REGISTRY_API_KEY || '',
      },
    },
  )

  return await response.json()
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  console.log(req.body)
  const people = await getByName('emil')
  res.status(200).json(people)
}
