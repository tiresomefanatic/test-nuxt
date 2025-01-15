import { writeFile, mkdir } from 'fs/promises'
import { dirname, join } from 'path'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { id, content } = body

  // Construct the full file path
  const contentDir = join(process.cwd(), 'content')
  const filePath = join(contentDir, `${id}.md`)

  try {
    // Ensure the directory exists
    await mkdir(dirname(filePath), { recursive: true })

    // Write the content to the file
    await writeFile(filePath, content)
    
    return { success: true }
  } catch (error) {
    console.error('Error writing file:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to save content'
    })
  }
})
