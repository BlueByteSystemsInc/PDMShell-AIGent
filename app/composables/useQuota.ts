import { useState } from '#imports'

interface QuotaMetric {
  used: number
  limit: number
  remaining: number
  resetsAt: number
}

export interface QuotaState {
  rpm: QuotaMetric
  rpd: QuotaMetric
  tpm: QuotaMetric
  tpd: QuotaMetric
}

interface AIConfigResponse {
  provider: string
  modelDisplayName: string
  quota: QuotaState
}

export function useQuota() {
  const quota = useState<QuotaState | null>('quota', () => null)
  const provider = useState<string>('ai-provider', () => '')
  const modelDisplayName = useState<string>('ai-model-name', () => '')

  async function fetchQuota() {
    try {
      const data = await $fetch<AIConfigResponse>('/api/config')
      quota.value = data.quota
      provider.value = data.provider
      modelDisplayName.value = data.modelDisplayName
    } catch {
      // Non-critical — quota panel just won't show data
    }
  }

  function updateFromStreamData(data: QuotaState) {
    quota.value = data
  }

  return {
    quota,
    provider,
    modelDisplayName,
    fetchQuota,
    updateFromStreamData
  }
}
