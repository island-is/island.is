// This script takes a list of strings and returns a list of comma-separated chunks of the original list

const chunkSize = parseInt(process.env['CHUNK_SIZE'] || '2')
const disableChunks = process.env['DISABLE_CHUNKS'] === 'true'
const disableProblematic = process.env['DISABLE_PROBLEMATIC'] === 'true'
new console.Console(process.stderr).log(`Initial settings:`, {
  chunkSize,
  disableChunks,
  disableProblematic,
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

let soloProjects = []
let filteredProjects = projects

if (!disableProblematic) {
  // Projects which require running solo due to timelimits
  soloProjects = problematicProjects.filter((p) => projects.includes(p))
  new console.Console(process.stderr).log(`Solo projects:`, soloProjects)

  filteredProjects = projects.filter((p) => !soloProjects.includes(p))
  new console.Console(process.stderr).log(
    `Filtered projects (excluding solo projects):`,
    filteredProjects,
  )
} else {
  new console.Console(process.stderr).log(
    `Problematic project handling disabled. Processing all projects together.`,
  )
}

const chunkedProjects = chunk(filteredProjects, chunkSize)
new console.Console(process.stderr).log(`Chunked projects:`, chunkedProjects)

const chunksJoined = chunkedProjects.map((chunk) => chunk.join(','))
new console.Console(process.stderr).log(`Chunks joined:`, chunksJoined)

const finalChunks = disableProblematic
  ? chunksJoined
  : chunksJoined.concat(soloProjects)
new console.Console(process.stderr).log(`Final chunks:`, finalChunks)

const sortedFinalChunks = finalChunks.sort()
new console.Console(process.stderr).log(
  `Final sorted chunks:`,
  sortedFinalChunks,
)

new console.Console(process.stderr).log(`Chunk debug:`, {
  projects,
  soloProjects,
  filteredProjects,
  chunkedProjects,
  chunksJoined,
  finalChunks,
  sortedFinalChunks,
  disableChunks,
  disableProblematic,
})

// Only write the final JSON output to stdout
console.log(JSON.stringify(sortedFinalChunks))
