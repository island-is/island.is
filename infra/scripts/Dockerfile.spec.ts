import { readFileSync } from 'fs'
import { resolve } from 'path'

describe('Helm config runtime image', () => {
  const dockerfile = readFileSync(resolve(__dirname, 'Dockerfile'), 'utf8')
  const finalStage = dockerfile.slice(dockerfile.lastIndexOf('FROM runner'))

  it('packages path-preserved Nx project metadata for the runtime image', () => {
    expect(dockerfile).toContain('COPY nx.json /app/workspace-metadata/nx.json')
    expect(dockerfile).toMatch(
      /find apps libs -type f -name project\.json\s+\\\n\s+-exec cp --parents \{\} workspace-metadata\//,
    )
    expect(finalStage).toContain(
      'COPY --from=build /app/workspace-metadata/ /app/',
    )
  })

  it('loads feature-env after its runtime metadata is copied', () => {
    const metadataCopy = finalStage.indexOf(
      'COPY --from=build /app/workspace-metadata/ /app/',
    )
    const smokeCheck = finalStage.indexOf(
      'RUN node feature-env --help > /dev/null',
    )

    expect(metadataCopy).toBeGreaterThan(-1)
    expect(smokeCheck).toBeGreaterThan(metadataCopy)
  })

  it('does not copy application or library source trees into the runtime stage', () => {
    expect(finalStage).not.toMatch(/^COPY (?:apps|libs)(?:\/|\s)/m)
    expect(finalStage).not.toMatch(
      /^COPY --from=build \/app\/(?:apps|libs)(?:\/|\s)/m,
    )
  })
})
