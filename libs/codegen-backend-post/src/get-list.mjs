// @ts-check
import { exec } from 'child_process'
import { POST_BACKEND_TARGETS } from './const.mjs'

export const getProjectList = async () => {
  return Array.from(
    new Set(
      (
        await Promise.all(
          POST_BACKEND_TARGETS.map(async (target) => {
            return new Promise((resolve, reject) => {
              exec(
                `yarn nx show projects --target=${target}`,
                (error, stdout) => {
                  if (error) {
                    reject(error)
                  }
                  resolve(
                    stdout
                      .split('\n')
                      .filter((line) => line)
                      .map((project) => `${project}`),
                  )
                },
              )
            })
          }),
        )
      ).flat(),
    ),
  )
}
