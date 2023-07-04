const fs = require('fs');

try {
    fs.accessSync('libs/application/template-api-modules/src/lib/modules/templates/general-petition/gen/fetch/endorsements', fs.constants.F_OK);
} catch (err) {
    console.log('File template does not exists');
    process.exit(1);
}

try {
    fs.accessSync('apps/services/endorsements/api/src/openapi.yaml', fs.constants.F_OK)
    console.log("File exists");
    process.exit(0);
} catch (err) {
    console.log("File openapi.yaml does not exists");
    process.exit(1);
}