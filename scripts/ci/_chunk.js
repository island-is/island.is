/**
 * Project Chunking Script
 *
 * This script takes a list of project names as input and returns a list of
 * comma-separated chunks of the original list. It provides flexible processing
 * options through environment variable control flags.
 *
 * Functionality:
 * 1. Groups projects by their prefix (part before the first hyphen)
 * 2. Optionally chunks these groups into smaller sizes
 * 3. Optionally handles "problematic" projects separately
 * 4. Sorts the final list of chunks
 *
 * Control Flags (Environment Variables):
 * - CHUNK_SIZE: Determines the size of each chunk (default: 2)
 * - DISABLE_CHUNKS: If 'true', prevents breaking groups into smaller chunks
 * - DISABLE_GROUPING: If 'true', prevents grouping projects by their prefixes
 * - DISABLE_PROBLEMATIC: If 'true', prevents special handling of problematic projects
 *
 * Usage:
 * node script.js "project1,project2,project3,..."
 *
 * You can combine control flags for different behaviors:
 * 1. Default (all flags false):
 *    Groups by prefix, chunks each group, handles problematic projects separately
 * 2. DISABLE_CHUNKS=true:
 *    Groups by prefix only, doesn't chunk further, handles problematic projects separately
 * 3. DISABLE_GROUPING=true:
 *    Doesn't group by prefix, chunks the entire list, handles problematic projects separately
 * 4. DISABLE_PROBLEMATIC=true:
 *    Groups by prefix, chunks each group, treats all projects equally
 * 5. DISABLE_GROUPING=true and DISABLE_CHUNKS=true:
 *    Returns the input list as-is, with no special processing (except for problematic projects)
 * 6. All flags true:
 *    Returns the input list as-is, with no special processing
 *
 * The script provides detailed logging to stderr throughout the process,
 * and outputs the final chunked list as a JSON string to stdout.
 */

const chunkSize = parseInt(process.env['CHUNK_SIZE'] || '2')
const disableChunks = process.env['DISABLE_CHUNKS'] === 'true'
const disableGrouping = process.env['DISABLE_GROUPING'] === 'true'
const disableProblematic = process.env['DISABLE_PROBLEMATIC'] === 'true'

new console.Console(process.stderr).log(`Initial settings:`, {
  chunkSize,
  disableChunks,
  disableGrouping,
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

function groupbByPrefix(arr) {
  if (disableGrouping) {
    new console.Console(process.stderr).log(`Grouping disabled, skipping ...`)
    return [arr]
  }

  new console.Console(process.stderr).log(`Grouping by prefix. Input:`, arr)
  arr.sort()
  const parts = new Map()

  for (const item of arr) {
    const key = item.split('-')[0] // Get prefix, or default to project name
    if (!parts.has(key)) {
      parts.set(key, [])
    } // Initialize with empty array
    parts.get(key).push(item) // Add item to array
    new console.Console(process.stderr).log(
      `Grouped "${item}" under prefix "${key}"`,
    )
  }

  // Extract items grouped by prefix
  const values = Array.from(parts.values())
  new console.Console(process.stderr).log(`Grouped by prefix:`, values)
  return values
}

function chunk(groups, chunkSize) {
  new console.Console(process.stderr).log(`Chunking groups. Input:`, groups)
  if (disableChunks) {
    new console.Console(process.stderr).log(`Chunks disabled, skipping ...`)
    return groups
  }

  new console.Console(process.stderr).log(`Chunking with size: ${chunkSize}`)
  const chunks = []
  for (const group of groups) {
    for (let i = 0; i < group.length; i += chunkSize) {
      const chunk = group.slice(i, i + chunkSize)
      chunks.push(chunk)
      new console.Console(process.stderr).log(`Created chunk:`, chunk)
    }
  }
  new console.Console(process.stderr).log(`Chunked result:`, chunks)
  return chunks
}

// Projects which require running solo due to timelimits
const soloProjects = disableProblematic
  ? []
  : problematicProjects.filter((p) => projects.includes(p))
new console.Console(process.stderr).log(`Solo projects:`, soloProjects)

const filteredProjects = disableProblematic
  ? projects
  : projects.filter((p) => !soloProjects.includes(p))
new console.Console(process.stderr).log(`Filtered projects:`, filteredProjects)

const groups = groupbByPrefix(filteredProjects)
new console.Console(process.stderr).log(
  `Groups after grouping by prefix:`,
  groups,
)

const chunkedGroups = chunk(groups, chunkSize)
new console.Console(process.stderr).log(`Chunked groups:`, chunkedGroups)

const chunksJoined = chunkedGroups.map((chunk) => chunk.join(','))
new console.Console(process.stderr).log(`Chunks joined:`, chunksJoined)

const chunksFiltered = chunksJoined.filter((job) => job.length > 0)
new console.Console(process.stderr).log(
  `Chunks filtered (removing empty chunks):`,
  chunksFiltered,
)

const chunksWithSolos = chunksFiltered.concat(soloProjects)
new console.Console(process.stderr).log(
  `Chunks with solo projects added:`,
  chunksWithSolos,
)

const chunks = chunksWithSolos.sort()
new console.Console(process.stderr).log(`Final sorted chunks:`, chunks)

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
  disableGrouping,
  disableProblematic,
})

// Only write the final JSON output to stdout
console.log(JSON.stringify(chunks))
