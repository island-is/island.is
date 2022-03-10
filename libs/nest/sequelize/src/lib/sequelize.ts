import { SequelizeModuleOptions } from '@nestjs/sequelize'
import addSeconds from 'date-fns/addSeconds'
import differenceInSeconds from 'date-fns/differenceInSeconds'

import type { Logger } from '@island.is/logging'

interface GetOptionsParams {
  logger?: Logger
  recycleConnections?: boolean
}

const baseConnectionAgeInSeconds = 1 * 60 // 1 minute

const getRandomWithinRange = (min: number, max: number) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const validate = (obj: { recycleWhen?: Date }) => {
  // Recycle connections periodically
  if (!obj.recycleWhen) {
    // Setup expiry on new connections and return the connection as valid
    obj.recycleWhen = addSeconds(
      new Date(),
      getRandomWithinRange(
        baseConnectionAgeInSeconds,
        baseConnectionAgeInSeconds * 2,
      ),
    )
    return true
  }
  // Recycle the connection if it has expired
  return differenceInSeconds(new Date(), obj.recycleWhen) < 0
}

export const getOptions = (
  { logger, recycleConnections }: GetOptionsParams = {
    recycleConnections: false,
  },
): SequelizeModuleOptions => ({
  define: {
    underscored: true,
    timestamps: true,
    createdAt: 'created',
    updatedAt: 'modified',
  },
  dialectOptions: {
    useUTC: true,
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
    validate: recycleConnections ? validate : undefined,
  },
  logging: logger ? (message) => logger.debug(message) : false,
  autoLoadModels: true,
  synchronize: false,
})
