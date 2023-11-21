import { colors, Command } from "../deps.ts";
import { readDenoFile, writeDenoFile } from "../lib/config.ts";
import { info } from "../lib/log.ts";

export default new Command<{ config?: string }>()
  .description("Remove an entry from the import map")
  .arguments("<name:string>")
  .action(async ({ config: configFileName }, name) => {
    const denoFile = await readDenoFile(configFileName);

    info("Removing import map entry...");
    delete denoFile.imports[`${name}/`];

    await writeDenoFile(denoFile, configFileName);

    info(`Removed ${colors.blue(name)} entry from import map`);
  });
