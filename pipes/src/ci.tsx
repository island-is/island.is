import React from 'react'
import {
  PipesDOM,
  createPipe,
  createZodStore,
  render,
  z,
} from './pipes-core.js'
import { PipesGitHub, PipesGitHubModule } from './pipes-github.js'
import { PipesNode, PipesNodeModule } from './pipes-module-node.js'
import { fileURLToPath } from 'url'
import { join } from 'path'

const CONFIG = {
  GITHUB_TOKEN: z.string().default(undefined, {
    arg: {
      long: "token"
    },
    env: "GITHUB_TOKEN"
  })
}

await createPipe(({ createPipesCore }) => {
  const mainContext = createPipesCore()
    .addModule<PipesGitHubModule>(PipesGitHub)
    .addModule<PipesNodeModule>(PipesNode)
  mainContext.addScript(async (context, config) => {
    const state = createZodStore({
      errorMSG: z.string().default(""),
      state: z
        .union([z.literal('Running'), z.literal('Finished'), z.literal("Error")])
        .default('Running'),
      changedFiles: z.boolean().default(false),
    })
    render(() => {
      return ((state, changedFiles, errorMSG) => (
        <PipesDOM.Group title="Fix dirty files">
          {state === 'Running' ? <PipesDOM.Info>Running</PipesDOM.Info> : <></>}
          {state === 'Finished' ? (
            <PipesDOM.Success>
              Finished {changedFiles ? 'changed files commited' : 'no changes'}
            </PipesDOM.Success>
          ) : (
            <></>
          )}
          {
            state === 'Error' ? (
              <PipesDOM.Failure>
                Failed with error: {errorMSG}
              </PipesDOM.Failure>
            ) : <></>
          }
        </PipesDOM.Group>
      ))(state.state, state.changedFiles, state.errorMSG)
    })
    try {
      // Default configs.
      config.nodeWorkDir = "/app";
      config.nodeSourceDir = join(fileURLToPath(import.meta.url), "..", "..", "..");
      config.nodeSourceIncludeOrExclude = "exclude";
      
      // Normal behavior is to skip `node_modules` but we want to include it not
      config.nodeSourceExclude = ['.yarn/cache']
      // This can also be determined automatically from nvmrc or package.json
      config.nodeVersion = '18.16.0'

      // Prepare node container
      // Gets image from Image Store which was made in previous step -
      // Image Store is just a store to keep the images for all context locally
      const container = await context.nodePrepareContainer()
      
      const stdout = await container
        .withExec(['yarn', 'nx', 'format:write', '--all'])
        .stdout()
    } catch(e) {
        state.errorMSG = JSON.stringify(e);
        state.state = "Error";
        setTimeout(() => {
          throw new Error("Failed running formatting");
        }, 1000);
    }
  })
  return [mainContext]
})
