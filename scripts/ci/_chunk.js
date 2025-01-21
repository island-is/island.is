// This a script that given a list of strings, returns a list of comma-separated chunks of the original list

const chunkSize = parseInt(process.env['CHUNK_SIZE'] || '2')
const disableChunks = process.env['DISABLE_CHUNKS'] === 'true'
console.log('Initial settings:', { chunkSize, disableChunks })

const projects = process.argv[2].split(',').map((s) => s.trim()) ?? []
console.log('Input projects:', projects)

const problematicProjects = [
  'judicial-system-backend',
  'application-system-api',
  'services-auth-delegation-api',
  'services-auth-personal-representative',
]
console.log('Problematic projects:', problematicProjects)

function groupbByPrefix(arr) {
  console.log('Grouping by prefix. Input:', arr)
  arr.sort()
  const parts = new Map()

  for (const item of arr) {
    const key = item.split('-')[0] // Get prefix, or default to project name
    if (!parts.has(key)) {
      parts.set(key, [])
    } // Initialize with empty array
    parts.get(key).push(item) // Add item to array
    console.log(`Grouped "${item}" under prefix "${key}"`)
  }

  // Extract items grouped by prefix
  const values = Array.from(parts.values())
  console.log('Grouped by prefix:', values)
  return values
}

function chunk(groups, chunkSize) {
  console.log('Chunking groups. Input:', groups)
  if (disableChunks) {
    console.log('Chunks disabled, returning groups as-is')
    return groups
  }

  console.log(`Chunking with size: ${chunkSize}`)
  const chunks = []
  for (let i = 0; i < groups.length; i += chunkSize) {
    const chunk = groups.slice(i, i + chunkSize)
    chunks.push(chunk)
    console.log(`Created chunk: ${chunk}`)
  }
  console.log('Chunked result:', chunks)
  return chunks
}

// Projects which require running solo due to timelimits
const soloProjects = problematicProjects.filter((p) => projects.includes(p))
console.log('Solo projects:', soloProjects)

const filteredProjects = projects.filter((p) => !soloProjects.includes(p))
console.log('Filtered projects (excluding solo projects):', filteredProjects)

const groups = groupbByPrefix(filteredProjects)
console.log('Groups after grouping by prefix:', groups)

const chunkedGroups = disableChunks
  ? groups
  : groups.map((group) => chunk(group, chunkSize)).flat()
console.log('Chunked groups:', chunkedGroups)

const chunksJoined = chunkedGroups.map((chunk) => chunk.join(','))
console.log('Chunks joined:', chunksJoined)

const chunksFiltered = chunksJoined.filter((job) => job.length > 0)
console.log('Chunks filtered (removing empty chunks):', chunksFiltered)

const chunksWithSolos = chunksFiltered.concat(soloProjects)
console.log('Chunks with solo projects added:', chunksWithSolos)

const chunks = chunksWithSolos.sort()
console.log('Final sorted chunks:', chunks)

new console.Console(process.stderr).log(`Chunk debug:`, {
  projects,
  soloProjects,
  filteredProjects,
  groups,
  chunkedGroups,
  chunksJoined,
  chunksFiltered,
  chunksWithSolos,
  disableChunks,
})

process.stdout.write(JSON.stringify(chunks))
