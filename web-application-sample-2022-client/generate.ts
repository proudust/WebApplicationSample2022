import { CodeGenerator } from "@himenon/openapi-typescript-code-generator";
import * as Templates from "@himenon/openapi-typescript-code-generator/templates";
import * as fs from "fs/promises";
import { watch } from "chokidar";

async function generate() {
  const codeGenerator = new CodeGenerator("../openapi.json");

  const typesTs = codeGenerator.generateTypeDefinition();
  const appClientTs = codeGenerator.generateCode([
    {
      generator: () => [`import { Schemas } from "./types";`],
    },
    codeGenerator.getAdditionalTypeDefinitionCustomCodeGenerator(),
    {
      generator: Templates.ApiClient.generator,
      option: {},
    },
  ]);

  await fs.mkdir("src/api", { recursive: true });

  await Promise.all([
    fs.writeFile("src/api/types.ts", typesTs, { encoding: "utf-8" }),
    fs.writeFile("src/api/client.ts", appClientTs, { encoding: "utf-8" }),
  ]);
}

async function retry<T>(fn: () => Promise<T>) {
  while (true) {
    try {
      return await fn();
    } catch {}
  }
}

const hasWatch = process.argv.includes("--watch");

if (hasWatch) {
  watch("../openapi.json")
    .on("ready", () => retry(generate))
    .on("change", () => retry(generate));
} else {
  generate();
}
