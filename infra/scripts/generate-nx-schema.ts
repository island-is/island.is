import { writeFileSync } from 'fs'
import { join } from 'path'
import fetch from 'node-fetch'
import jsonSchemaToZod, { Options } from 'json-schema-to-zod'

const nxVersion = process.argv[2] || 'master'

const schemaUrl = `https://raw.githubusercontent.com/nrwl/nx/refs/heads/${nxVersion}/packages/nx/schemas/project-schema.json`
const outputFilePath = join(__dirname, '../src/generated/nx-project-schema.ts')

const downloadSchema = async (): Promise<Record<string, unknown>> => {
  try {
    const response = await fetch(schemaUrl)
    if (!response.ok) {
      throw new Error(`Failed to fetch schema: ${response.statusText}`)
    }
    const schemaData = await response.json()
    return schemaData
  } catch (error) {
    console.error('Error downloading schema:', error)
    throw error
  }
}

const transformSchemaToZod = async (
  jsonSchema: Record<string, unknown>,
): Promise<string> => {
  try {
    const options: Options = {
      name: 'nxProjectSchema',
      module: 'esm',
      depth: 0,
      type: true,
    }

    const code = jsonSchemaToZod(jsonSchema, options)

    return code
  } catch (error) {
    console.error('Error transforming schema to Zod:', error)
    throw error
  }
}

const writeSchemaToFile = (zodSchema: string): void => {
  const fileContent = `// This file is auto-generated. Do not edit directly.\n\n${zodSchema}`
  writeFileSync(outputFilePath, fileContent, { encoding: 'utf-8' })
  console.log(`Zod schema has been written to ${outputFilePath}`)
}

const main = async (): Promise<void> => {
  try {
    console.log(`Downloading schema for NX version: ${nxVersion}...`)
    const jsonSchema = await downloadSchema()

    console.log('Transforming schema to Zod...')
    const zodSchema = await transformSchemaToZod(jsonSchema)

    console.log('Writing Zod schema to file...')
    writeSchemaToFile(zodSchema)
  } catch (error) {
    console.error('An error occurred:', error)
  }
}

main()
