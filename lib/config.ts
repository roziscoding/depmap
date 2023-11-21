import { existsSync } from "https://deno.land/std@0.207.0/fs/mod.ts";
import { colors } from "../deps.ts";
import { info } from "./log.ts";

export function denoFilePath(fileName?: string, fallback?: string) {
  const result = [
    ...(fileName ? [fileName] : []),
    "deno.jsonc",
    "deno.json",
  ].find((name) => existsSync(name)) ?? fallback;

  if (!result) throw new Error(colors.red("Deno configuration file not found"));

  return result;
}

export const readDenoFile = (configFileName?: string) => {
  info(`Reading Deno configuration...`);

  return Deno.readTextFile(denoFilePath(configFileName))
    .then(JSON.parse)
    .catch(() => ({}));
};

export const writeDenoFile = (data: unknown, configFileName?: string) => {
  info(`Writing Deno configuration...`);

  const fileName = denoFilePath(configFileName, configFileName);

  return Deno.writeTextFile(fileName, JSON.stringify(data, null, 2));
};
