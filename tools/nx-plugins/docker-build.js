// @ts-check
/**
 * Infers a `docker-build` target for every project that has one of the `docker-*` marker targets
 * (e.g. `docker-next`), so building the Docker image of a project is an Nx task. The build and
 * deploy pipeline runs these on Nx Agents, see `scripts/ci/nx-agents/README.md`.
 *
 * The marker targets stay as they are: the pipelines that don't use agents select projects and
 * the type of image with them.
 */
const { createNodesFromFiles } = require('@nx/devkit')
const { readFileSync } = require('fs')
const { dirname, join } = require('path')

const MARKER_TARGET = /^docker-(express|express-yarn|next|static|playwright|jest)$/

/** @type {import('@nx/devkit').CreateNodesV2} */
exports.createNodesV2 = [
  '**/project.json',
  (projectFiles, options, context) =>
    createNodesFromFiles(
      (projectFile) => {
        const project = JSON.parse(
          readFileSync(join(context.workspaceRoot, projectFile), 'utf-8'),
        )
        const dockerType = Object.keys(project.targets ?? {}).find((target) =>
          MARKER_TARGET.test(target),
        )
        if (!dockerType) return {}

        const root = dirname(projectFile)
        return {
          projects: {
            [root]: {
              targets: {
                'docker-build': {
                  executor: 'nx:run-commands',
                  // The Docker build does `nx build` for the project as well, which has the same hash
                  // as this one (see `scripts/ci/nx-agents/README.md`), so in there it is a cache hit.
                  // Building first means the builds are distributed and run in parallel like any
                  // other task, while the images are built one at a time on an agent
                  dependsOn: ['build'],
                  // Pushes an image, nothing to cache
                  cache: false,
                  // Not for a hash, but to make the project affected when a Dockerfile changes
                  inputs: ['production', '^production', 'Dockerfiles'],
                  options: {
                    command: './scripts/ci/nx-agents/docker-build.sh',
                    env: {
                      APP: project.name,
                      APP_HOME: root,
                      DOCKER_TYPE: dockerType,
                    },
                  },
                },
              },
            },
          },
        }
      },
      projectFiles,
      options,
      context,
    ),
]
