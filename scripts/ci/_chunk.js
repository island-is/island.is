// This a script that given a list of strings, returns a list of comma-separated chunks of the original list

const chunkSize = parseInt(process.env['CHUNK_SIZE'] || '2')
const projects = process.argv[2].split(',').map((s) => s.trim()) ?? []

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

const groups = groupbByPrefix(projects)
const chunked_groups = groups.map((group) => chunk(group, chunkSize)).flat()
const chunks = chunked_groups
  .map((chunk) => chunk.join(','))
  .filter((job) => job.length > 0)

// console.error("Chunked groups:", chunked_groups)

process.stdout.write(JSON.stringify(chunks))
