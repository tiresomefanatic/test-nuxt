import { d as defineEventHandler, r as readBody, c as createError } from '../../../nitro/nitro.mjs';
import { mkdir, writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:path';
import '@iconify/utils';
import 'consola/core';

const update_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { id, content } = body;
  const contentDir = join(process.cwd(), "content");
  const filePath = join(contentDir, `${id}.md`);
  try {
    await mkdir(dirname(filePath), { recursive: true });
    await writeFile(filePath, content);
    return { success: true };
  } catch (error) {
    console.error("Error writing file:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to save content"
    });
  }
});

export { update_post as default };
//# sourceMappingURL=update.post.mjs.map
