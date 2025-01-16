import process from 'node:process';globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import { d as defineEventHandler, r as readBody, c as createError } from '../../nitro/nitro.mjs';
import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:path';
import '@iconify/utils';
import 'consola/core';

const rawContent_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { path, content } = body;
  if (!path || !content) {
    throw createError({
      statusCode: 400,
      message: "Path and content are required"
    });
  }
  try {
    const __filename = fileURLToPath(globalThis._importMeta_.url);
    const projectRoot = resolve(dirname(__filename), "../../..");
    const normalizedPath = path.startsWith("content/") ? path.slice(8) : path;
    const fullPath = resolve(projectRoot, "content", normalizedPath);
    console.log("Writing file to:", fullPath);
    writeFileSync(fullPath, content, "utf-8");
    return { success: true };
  } catch (error) {
    console.error("Error writing file:", error);
    throw createError({
      statusCode: 500,
      message: "Error writing file"
    });
  }
});

export { rawContent_post as default };
//# sourceMappingURL=raw-content.post.mjs.map
