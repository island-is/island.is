/**
 * To add dd-trace in tests when running locally
 */
if (process.env["CI"] && !process.env["DD_ENV"]) {
    return;
}
process.env["DD_ENV"] = "local";

require("dd-trace").init();