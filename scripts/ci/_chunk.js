// This a script that given a list of strings, returns a list of comma-separated chunks of the original list

const chunkSize = parseInt(process.env['CHUNK_SIZE'] || '2')
const projects = process.argv[2].split(',').map((s) => s.trim()) ?? []
const problematicProjects = ['judicial-system-backend']

function groupbByPrefix(arr) {
  arr.sort()
  const parts = new Map()

  for (const item of arr) {
    const key = item.split('-')[0] // Get prefix, or defaut to project name
    if (!parts.has(key)) {
      parts.set(key, [])
    } // Initialise with empty array
    parts.get(key).push(item) // Add item to array
  }

  // Extract items grouped by prefix
  const values = []
  for (const part of parts.values()) {
    values.push(part)
  }

  // console.error("Values:", values)
  return values
}

function chunk(groups, chunkSize) {
  const chunks = []
  for (let i = 0; i < groups.length; i += chunkSize) {
    chunks.push(groups.slice(i, i + chunkSize))
  }
  // console.error('Chunked group:', chunks)
  return chunks
}

// Projects which require running solo due to timelimits
const soloProjects = problematicProjects.filter((p) => projects.includes(p))
const filteredProjects = projects.filter((p) => !soloProjects.includes(p))
const groups = groupbByPrefix(filteredProjects)
const chunkedGroups = groups.map((group) => chunk(group, chunkSize)).flat()
const chunksJoined = chunkedGroups.map((chunk) => chunk.join(','))
const chunksFiltered = chunksJoined.filter((job) => job.length > 0)
const chunksWithSolos = chunksFiltered.concat(soloProjects)
const chunks = chunksWithSolos.sort()

new console.Console(process.stderr).log(`Chunk debug:`, {
  projects,
  soloProjects,
  filteredProjects,
  groups,
  chunkedGroups,
  chunksJoined,
  chunksFiltered,
  chunksWithSolos,
})

process.stdout.write(JSON.stringify(chunks))
