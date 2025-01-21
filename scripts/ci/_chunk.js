// This script takes a list of strings and returns a list of comma-separated chunks of the original list

const chunkSize = parseInt(process.env['CHUNK_SIZE'] || '2')
const disableChunks = process.env['DISABLE_CHUNKS'] === 'true'
new console.Console(process.stderr).log(`Initial settings:`, {
  chunkSize,
  disableChunks,
})

const projects = process.argv[2].split(',').map((s) => s.trim()) ?? []
new console.Console(process.stderr).log(`Input projects:`, projects)

const problematicProjects = [
  'judicial-system-backend',
  'application-system-api',
  'services-auth-delegation-api',
  'services-auth-personal-representative',
]
new console.Console(process.stderr).log(
  `Problematic projects:`,
  problematicProjects,
)

function chunk(arr, size) {
  new console.Console(process.stderr).log(`Chunking. Input:`, arr)
  if (disableChunks) {
    new console.Console(process.stderr).log(`Chunks disabled, skipping ...`)
    return [arr]
  }

  new console.Console(process.stderr).log(`Chunking with size: ${size}`)
  const chunks = []
  for (let i = 0; i < arr.length; i += size) {
    const chunk = arr.slice(i, i + size)
    chunks.push(chunk)
    new console.Console(process.stderr).log(`Created chunk:`, chunk)
  }
  new console.Console(process.stderr).log(`Chunked result:`, chunks)
  return chunks
}

// Projects which require running solo due to timelimits
const soloProjects = problematicProjects.filter((p) => projects.includes(p))
new console.Console(process.stderr).log(`Solo projects:`, soloProjects)

const filteredProjects = projects.filter((p) => !soloProjects.includes(p))
new console.Console(process.stderr).log(
  `Filtered projects (excluding solo projects):`,
  filteredProjects,
)

const chunkedProjects = chunk(filteredProjects, chunkSize)
new console.Console(process.stderr).log(`Chunked projects:`, chunkedProjects)

const chunksJoined = chunkedProjects.map((chunk) => chunk.join(','))
new console.Console(process.stderr).log(`Chunks joined:`, chunksJoined)

const chunksWithSolos = chunksJoined.concat(soloProjects)
new console.Console(process.stderr).log(
  `Chunks with solo projects added:`,
  chunksWithSolos,
)

const finalChunks = chunksWithSolos.sort()
new console.Console(process.stderr).log(`Final sorted chunks:`, finalChunks)

new console.Console(process.stderr).log(`Chunk debug:`, {
  projects,
  soloProjects,
  filteredProjects,
  chunkedProjects,
  chunksJoined,
  chunksWithSolos,
  finalChunks,
  disableChunks,
})

// Only write the final JSON output to stdout
console.log(JSON.stringify(finalChunks))
