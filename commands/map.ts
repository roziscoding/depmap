import { colors } from "cliffy/ansi/colors.ts";
import { Command } from "cliffy/command/mod.ts";
import { z } from "zod/mod.ts";
import { readDenoFile, writeDenoFile } from "../lib/config.ts";
import { fatal, info } from "../lib/log.ts";

export const ModuleVersion = z.object({
  "latest_version": z.string(),
}).transform((data) => data.latest_version);

const getUrl = async (name: string) => {
  if (name.toLowerCase() === "x") return `https://deno.land/x/`;

  info(`Fetching latest version of ${colors.blue(name)}...`);
  const response = await fetch(`https://apiland.deno.dev/v2/modules/${name}`);

  if (!response.ok) return fatal(response);

  const version = ModuleVersion.parse(await response.json());

  info(`Using version ${colors.blue(version)}`);

  const url = name.toLowerCase() === "std"
    ? `https://deno.land/std@${version}/`
    : `https://deno.land/x/${name}@${version}/`;

  return url;
};

export default new Command<{ config?: string }>()
  .description("Creates a new import map entry")
  .arguments("<name:string>")
  .option("-c, --cache <file:string>", `Caches specified file with ${colors.yellow.italic("deno cache")}`)
  .action(async ({ cache, config: configFileName }, name) => {
    const url = await getUrl(name);

    const denoFile = await readDenoFile(configFileName);

    info(`Adding import map entry...`);
    denoFile.imports = denoFile.imports ?? {};
    denoFile.imports[`${name}/`] = url;

    await writeDenoFile(denoFile, configFileName);

    info(`Added ${colors.blue(`${name}/ -> ${colors.blue(url)}`)} to import map`);

    if (!cache) return;

    info(`Caching" ${colors.blue(`${url}${cache}`)}...`);

    const cacheCommand = new Deno.Command(Deno.execPath(), { args: ["cache", `${url}${cache}`] });
    const { code, stderr } = cacheCommand.outputSync();
    if (code !== 0) throw new Error(new TextDecoder().decode(stderr));
    info(colors.green("Done"));
  });
