#!/usr/bin/env -S deno run -A
import { Command } from "cliffy/command/mod.ts";
import extract from "./commands/extract.ts";
import map from "./commands/map.ts";
import unmap from "./commands/unmap.ts";

const main = await new Command()
  .name("depmap")
  .version("0.0.1")
  .description("Deno import map manager")
  .globalOption("-f, --config <file:file>", "Custom deno configuration file");

main.command("map,m", map);
main.command("unmap,u", unmap);
main.command("extract", extract);

main.parse(Deno.args);
