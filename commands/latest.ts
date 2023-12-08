import { colors, Command, zod as z } from "../deps.ts";
import { readDenoFile, writeDenoFile } from "../lib/config.ts";
import { fatal, info } from "../lib/log.ts";

export const ModuleVersion = z.object({
  "latest_version": z.string(),
}).transform((data) => data.latest_version);

const getLatestVersion = async (name: string) => {
  if (name.toLowerCase() === "x") throw new Error(`Invalid module name: ${name}`);

  const response = await fetch(`https://apiland.deno.dev/v2/modules/${name}`);

  if (!response.ok) return fatal(response);

  const version = ModuleVersion.parse(await response.json());

  return version
};

export default new Command<{ config?: string }>()
  .description("Gets the latest version of a package")
  .arguments("<name:string>")
  .action(async (_, name) => {
    const version = await getLatestVersion(name)
    Deno.writeAllSync(Deno.stdout, new TextEncoder().encode(`https://deno.land/x/${name}@${version}/`))
  });
