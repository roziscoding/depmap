#!/usr/bin/env -S deno run -A
import extract from "./commands/extract.ts";
import map from "./commands/map.ts";
import unmap from "./commands/unmap.ts";
import latest from "./commands/latest.ts"
import { Command } from "./deps.ts";

const main = await new Command()
  .name("depmap")
  .version("0.0.1")
  .description("Deno import map manager")
  .globalOption("-f, --config <file:file>", "Custom deno configuration file");

main.command("map,m", map);
main.command("unmap,u", unmap);
main.command("extract", extract);
main.command("latest,l", latest);

main.parse(Deno.args);
