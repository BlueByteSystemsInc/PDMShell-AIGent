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

export function useQuota() {
  const quota = useState<QuotaState | null>('quota', () => null)

  async function fetchQuota() {
    try {
      quota.value = await $fetch<QuotaState>('/api/quota')
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
