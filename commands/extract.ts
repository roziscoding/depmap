import { colors, Command } from "../deps.ts";
import { readDenoFile } from "../lib/config.ts";
import { info } from "../lib/log.ts";

const extractable = (key: string | [string, unknown]) =>
  !["x/", "std/"]
    .includes(Array.isArray(key) ? key[0] : key);

export default new Command<{ config?: string }>()
  .description("Extract the dependencies to a .ts file")
  .option("-s, --select <name:string>", "Name of the dependencies to extract", { collect: true })
  .option("-o, --output <file:string>", "Name of the file to extract to", { default: "deps.ts" })
  .option("-e, --entrypoint <file:string>", "Name of the entrypoint file", { default: "mod.ts" })
  .option("--cache", "Cache the dependencies", { default: false })
  .action(async ({ config: configFileName, select: moduleNames, output, entrypoint, cache }) => {
    const denoFile = await readDenoFile(configFileName);
    const imports = denoFile.imports ?? {};

    const extracts = Object.entries(imports)
      .filter(([key]) => !moduleNames || moduleNames.includes(key.replace("/", "")))
      .filter(extractable)
      .map(([key, value]) => `export * as ${key.replace("/", "")} from "${value}${entrypoint}";`);

    if (!extracts.length) return console.error(colors.red("No dependencies found"));

    info(`Found ${colors.blue(extracts.length.toString(10))} dependencies`);

    info(`Extracting to ${colors.blue(output)}...`);
    await Deno.writeTextFile(output, extracts.join("\n"));

    if (!cache) return info("Done");

    info(`Caching" ${colors.blue(output)}...`);

    const cacheCommand = new Deno.Command(Deno.execPath(), { args: ["cache", output] });
    const { code, stderr } = cacheCommand.outputSync();
    if (code !== 0) throw new Error(new TextDecoder().decode(stderr));
    info(colors.green("Done"));
  });
