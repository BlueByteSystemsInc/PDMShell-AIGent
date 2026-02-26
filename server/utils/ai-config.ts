import { createGroq } from '@ai-sdk/groq'

export const aiConfig = {
  modelId: process.env.AI_MODEL_ID || 'llama-3.3-70b-versatile'
} as const

if (!process.env.GROQ_API_KEY) {
  throw new Error('GROQ_API_KEY environment variable is required. Set it in .env or your deployment dashboard.')
}

export const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY
})

export function getModel() {
  return groq(aiConfig.modelId)
}
