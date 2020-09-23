import { writeFileSync } from 'fs'
import { NestFactory } from '@nestjs/core'
import {
  GraphQLSchemaBuilderModule,
  GraphQLSchemaFactory,
} from '@nestjs/graphql'
import { printSchema } from 'graphql'
import { logger } from '@island.is/logging'

export const buildSchema = async ({
  path,
  resolvers,
}: {
  path: string
  resolvers: Function[]
}) => {
  logger.info('Starting to build autoSchema file ...', { path })

  const app = await NestFactory.create(GraphQLSchemaBuilderModule)
  await app.init()

  const gqlSchemaFactory = app.get(GraphQLSchemaFactory)
  const schema = await gqlSchemaFactory.create(resolvers)

  const data = `# ------------------------------------------------------
# THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
# ------------------------------------------------------

${printSchema(schema)}
  `

  return writeFileSync(path, data)
}
