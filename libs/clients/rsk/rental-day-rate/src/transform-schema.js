const fs = require('fs');
const path = require('path');

// Read the original schema
const schemaPath = path.join(__dirname, 'clientConfig.json');
const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));

// Remove additionalProperties from ProblemDetails
if (schema.components?.schemas?.ProblemDetails) {
  delete schema.components.schemas.ProblemDetails.additionalProperties;
}

// Write the transformed schema
const transformedPath = path.join(__dirname, 'transformed-clientConfig.json');
fs.writeFileSync(transformedPath, JSON.stringify(schema, null, 2)); 