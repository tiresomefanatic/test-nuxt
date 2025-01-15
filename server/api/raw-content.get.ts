import { promises as fs } from "fs";
import { resolve, join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const path = query.path as string;

  console.log("Raw content request for path:", path);

  if (!path) {
    console.error("No path provided");
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

    // Check if file exists before trying to access
    const exists = await fs.stat(contentPath).then(() => true).catch(() => false);
    console.log("File exists:", exists);

    if (!exists) {
      console.error("File does not exist:", contentPath);
      throw createError({
        statusCode: 404,
        message: `File not found: ${normalizedPath}`,
      });
    }

    // Verify the path is within the content directory
    const contentDir = resolve(projectRoot, 'content');
    console.log("Content directory:", contentDir);
    console.log("Path starts with content dir:", contentPath.startsWith(contentDir));

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
