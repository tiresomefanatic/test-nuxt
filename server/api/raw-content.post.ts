import { defineEventHandler, readBody, createError } from "h3";
import { writeFileSync } from "fs";
import { resolve } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { path, content } = body;

  if (!path || !content) {
    throw createError({
      statusCode: 400,
      message: "Path and content are required",
    });
  }

  try {
    // Get the project root directory
    const __filename = fileURLToPath(import.meta.url);
    const projectRoot = resolve(dirname(__filename), "../../..");

    // Remove the 'content/' prefix if present
    const normalizedPath = path.startsWith('content/') ? path.slice(8) : path;
    
    // Resolve the path relative to the content directory
    const fullPath = resolve(projectRoot, "content", normalizedPath);
    console.log("Writing file to:", fullPath);
    
    writeFileSync(fullPath, content, "utf-8");
    return { success: true };
  } catch (error) {
    console.error("Error writing file:", error);
    throw createError({
      statusCode: 500,
      message: "Error writing file",
    });
  }
});
