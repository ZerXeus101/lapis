import { defineEventHandler, readBody, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { prompt } = body
  const config = useRuntimeConfig()
  const apiKey = process.env.GEMINI_API_KEY || config.geminiApiKey

  if (!apiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Gemini API key is not configured'
    })
  }

  // Principle: Ensure payload integrity before hitting an external API
  if (!prompt || typeof prompt !== 'string') {
     throw createError({
      statusCode: 400,
      statusMessage: 'A valid prompt string is required'
    })
  }

  const systemPrompt = `
    You are an AI task assistant for a student app called Lapis.
    Break down the user's request into specific, actionable tasks.
    
    Rules:
    1. If the user specifies a date/time, use it.
    2. If not specified, use today's date (${new Date().toISOString().split('T')[0]}).
    3. If time is not specified, default to late evening (e.g., "20:00:00", "21:00:00").
    4. Categories MUST be one of: Assignments, Exams, Projects, Reading.
    5. Subject should be inferred from the context.
  `

  try {
    const model = 'gemini-2.5-flash'
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`

    interface GeminiResponse {
      candidates?: Array<{
        content?: {
          parts?: Array<{
            text?: string
          }>
        }
      }>
      error?: {
        message: string
        code: number
      }
    }

    const response = await $fetch<GeminiResponse>(url, {
      method: 'POST',
      body: {
        system_instruction: {
          parts: [{ text: systemPrompt }]
        },
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }]
          }
        ],
        generation_config: {
          temperature: 0.7,
          top_k: 40,
          top_p: 0.95,
          max_output_tokens: 2048,
          response_mime_type: "application/json",
          response_schema: {
            type: "array",
            items: {
              type: "object",
              properties: {
                task_name: { type: "string" },
                category: { 
                  type: "string", 
                  enum: ["Assignments", "Exams", "Projects", "Reading"] 
                },
                description: { type: "string" },
                due_date: { type: "string" },
                due_time: { type: "string" },
                subject: { type: "string" }
              },
              required: ["task_name", "category", "description", "due_date", "due_time", "subject"]
            }
          }
        }
      }
    })

    const aiText = response.candidates?.[0]?.content?.parts?.[0]?.text
    
    if (!aiText) {
      throw createError({
        statusCode: 500,
        statusMessage: 'No content received from Gemini'
      })
    }

    return { tasks: JSON.parse(aiText) }

  } catch (error: any) {
    console.error('AI Generate Error:', error)

    // 3. Delegate errors properly. If it's already an H3 error, re-throw it.
    if (error.statusCode && error.statusMessage) {
      throw error 
    }

    // $fetch embeds the raw HTTP response inside the error object.
    // We extract Google's specific API error message here to avoid generic 500s.
    const apiErrorStatus = error.response?.status || 500
    const apiErrorMessage = error.data?.error?.message || 'Failed to process AI task generation'

    throw createError({
      statusCode: apiErrorStatus,
      statusMessage: apiErrorMessage
    })
  }
})