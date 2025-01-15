import { defineEventHandler, getQuery, createError } from "h3";
import { promises as fs } from "fs";
import { resolve, join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const path = query.path as string;

  console.log("Raw content request for path:", path);

  if (!path) {
    throw createError({
      statusCode: 400,
      message: "Path parameter is required",
    });
  }

  try {
    // Get the project root directory
    const __filename = fileURLToPath(import.meta.url);
    const projectRoot = resolve(dirname(__filename), "../../..");
    console.log("Project root:", projectRoot);

    // Clean up the path
    const normalizedPath = path
      .replace(/^content\//, '') // Remove content/ prefix if present
      .replace(/\\/g, '/') // Convert backslashes to forward slashes
      .replace(/^\/+/, ''); // Remove leading slashes
    
    console.log("Normalized path:", normalizedPath);
    
    // Resolve the path relative to the content directory
    const contentPath = join(projectRoot, 'content', normalizedPath);
    console.log("Full content path:", contentPath);

    // Verify the path exists
    try {
      await fs.access(contentPath);
    } catch (err) {
      console.error("File not accessible:", contentPath);
      throw createError({
        statusCode: 404,
        message: `File not found: ${normalizedPath}`,
      });
    }

    // Verify the path is within the content directory
    const contentDir = resolve(projectRoot, 'content');
    if (!contentPath.startsWith(contentDir)) {
      console.error("Path traversal attempt:", contentPath);
      throw createError({
        statusCode: 403,
        message: 'Invalid path: Must be within content directory',
      });
    }

    // Read the file content
    const content = await fs.readFile(contentPath, "utf-8");
    console.log("Content loaded successfully, length:", content.length);

    return {
      content,
      path: contentPath,
    };
  } catch (error) {
    console.error("Error reading file:", error);
    if (error.statusCode) {
      throw error; // Re-throw HTTP errors
    }
    throw createError({
      statusCode: 500,
      message: `Failed to read file content: ${error.message}`,
    });
  }
});
