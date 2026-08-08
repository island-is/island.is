// @ts-check

import fs from 'fs'
import path from 'path'

export function matrixOutputToData(data) {
  if (!data || Object.keys(data).length === 0) {
    return []
  }
  if (typeof data !== 'object' || data == null || !data.value) {
    throw new Error('Invalid data type')
  }

  return Object.keys(data.value).map((key) => {
    const values = Object.keys(data).reduce((a, b) => {
      return {
        ...a,
        [b]: data[b][key],
      }
    }, {})

    return {
      id: key,
      ...values,
    }
  })
}

export function parseJsonEnv(value, fallback) {
  return value ? JSON.parse(value) : fallback
}

export function buildDockerData(jsonData, reusedDockerData) {
  return [
    ...matrixOutputToData(parseJsonEnv(jsonData, {})),
    ...parseJsonEnv(reusedDockerData, []),
  ]
}

export function main() {
  const result = buildDockerData(
    process.env.JSON_DATA,
    process.env.REUSED_DOCKER_DATA,
  )
  const tmpFilePath = path.join('/tmp', 'data.json')
  fs.writeFileSync(tmpFilePath, JSON.stringify(result, null, 2))
}

main()
