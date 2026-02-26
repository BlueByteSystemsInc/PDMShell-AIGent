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
  quota: QuotaState
}

export function useQuota() {
  const quota = useState<QuotaState | null>('quota', () => null)

  async function fetchQuota() {
    if (quota.value !== null) return
    try {
      const data = await $fetch<AIConfigResponse>('/api/config')
      quota.value = data.quota
    } catch {
      // Non-critical — quota panel just won't show data
    }
  }

  function updateFromStreamData(data: QuotaState) {
    quota.value = data
  }

  return {
    quota,
    fetchQuota,
    updateFromStreamData
  }
}
