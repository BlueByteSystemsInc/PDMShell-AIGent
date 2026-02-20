<script setup lang="ts">
import type { QuotaState } from '../composables/useQuota'

const props = defineProps<{
  quota: QuotaState | null
  provider?: string
}>()

interface MetricConfig {
  key: keyof QuotaState
  label: string
  icon: string
  short: string
}

const metrics: MetricConfig[] = [
  { key: 'rpm', label: 'Requests / min', icon: 'i-lucide-zap', short: 'RPM' },
  { key: 'rpd', label: 'Requests / day', icon: 'i-lucide-calendar', short: 'RPD' },
  { key: 'tpm', label: 'Tokens / min', icon: 'i-lucide-hash', short: 'TPM' },
  { key: 'tpd', label: 'Tokens / day', icon: 'i-lucide-coins', short: 'TPD' }
]

function formatNum(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`
  return String(n)
}

function pct(metric: { used: number, limit: number }): number {
  if (metric.limit === 0) return 0
  return Math.min(Math.round((metric.used / metric.limit) * 100), 100)
}

function progressColor(percent: number): 'success' | 'warning' | 'error' {
  if (percent >= 85) return 'error'
  if (percent >= 60) return 'warning'
  return 'success'
}

const worstPct = computed(() => {
  if (!props.quota) return 0
  return Math.max(
    pct(props.quota.rpm),
    pct(props.quota.rpd),
    pct(props.quota.tpm),
    pct(props.quota.tpd)
  )
})

const dotColor = computed(() => {
  const p = worstPct.value
  if (p >= 85) return 'bg-error'
  if (p >= 60) return 'bg-warning'
  return 'bg-success'
})

const shouldPulse = computed(() => worstPct.value >= 60)

function formatReset(resetsAt: number): string {
  const diff = resetsAt - Date.now()
  if (diff <= 0) return 'now'
  const secs = Math.floor(diff / 1000)
  if (secs < 60) return `${secs}s`
  const mins = Math.floor(secs / 60)
  if (mins < 60) return `${mins}m`
  const hours = Math.floor(mins / 60)
  return `${hours}h ${mins % 60}m`
}

const resetText = computed(() => {
  if (!props.quota) return ''
  const minReset = formatReset(Math.min(props.quota.rpm.resetsAt, props.quota.tpm.resetsAt))
  const dayReset = formatReset(Math.min(props.quota.rpd.resetsAt, props.quota.tpd.resetsAt))
  return `Per-minute resets in ${minReset} · Daily resets in ${dayReset}`
})
</script>

<template>
  <UPopover v-if="quota" :ui="{ content: 'p-0' }">
    <button
      type="button"
      class="inline-flex items-center gap-1 text-xs text-muted hover:text-highlighted cursor-pointer transition-colors"
    >
      <span
        class="size-1.5 rounded-full shrink-0"
        :class="[dotColor, shouldPulse ? 'animate-pulse' : '']"
      />
      <UIcon name="i-lucide-gauge" class="size-3.5" />
      <span>Quota</span>
    </button>

    <template #content>
      <div class="w-72 p-3">
        <p class="text-xs font-medium text-highlighted mb-3">
          {{ provider || 'API' }} Free Tier Usage
        </p>

        <div class="space-y-2.5">
          <div v-for="m in metrics" :key="m.key">
            <div class="flex items-center justify-between mb-1">
              <span class="inline-flex items-center gap-1 text-xs text-muted">
                <UIcon :name="m.icon" class="size-3" />
                {{ m.label }}
              </span>
              <span class="text-xs tabular-nums text-dimmed">
                {{ formatNum(quota[m.key].used) }} / {{ formatNum(quota[m.key].limit) }}
              </span>
            </div>
            <UProgress
              :model-value="pct(quota[m.key])"
              size="xs"
              :color="progressColor(pct(quota[m.key]))"
            />
          </div>
        </div>

        <p class="text-[10px] text-dimmed mt-3 leading-tight">
          {{ resetText }}
        </p>
      </div>
    </template>
  </UPopover>
</template>
