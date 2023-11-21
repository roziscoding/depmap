import { colors } from "../deps.ts";

export const fatal = (response: Response) => {
  if (response.status === 404) {
    console.error(colors.red("Module not found"));
    Deno.exit(1);
  }

  throw new Error(`Unexpected response from denoland API: ${response.status}`);
};

export const info = (message: string) => {
  const [action, ...rest] = message.split(" ");
  console.info(colors.green(action), ...rest);
};
