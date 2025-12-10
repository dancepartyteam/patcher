// Taken from DP Gameserver, but modified
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");

const project = require("../package.json");

module.exports = () => {
    console.log()
    console.log(`Patcher for DanceParty (v${project.version})`);
    console.log(`Supports Just Dance 2 to 2020 including the spin-offs for Wii and PS3.`)
    console.log("---------------------------------\n")

    return yargs(hideBin(process.argv))
    .command('<input_file>', 'Patch a ISO / WBFS / DOL / BIN File', (yargs) => {
        return yargs
          .positional('input_file', {
            describe: 'Path to the input file',
            demandOption: true
          })
      }, (argv) => {
        return argv
    })
    .option("debug", {
        type: "boolean",
        alias: "d",
        description: `Is debug?`
    })
    .scriptName(project.name)
    .demandCommand()
    .showHelpOnFail()
    .parse()
}