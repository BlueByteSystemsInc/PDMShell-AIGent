<script setup lang="ts">
import { useSlots, h, Text, type VNode } from 'vue'

const ALERT_TYPES: Record<string, { icon: string, color: string, label: string }> = {
  NOTE: { icon: 'i-lucide-info', color: 'info', label: 'Note' },
  TIP: { icon: 'i-lucide-lightbulb', color: 'success', label: 'Tip' },
  WARNING: { icon: 'i-lucide-triangle-alert', color: 'warning', label: 'Warning' },
  CAUTION: { icon: 'i-lucide-circle-alert', color: 'error', label: 'Caution' }
}

const slots = useSlots()

function getTextContent(node: VNode): string {
  if (typeof node.children === 'string') {
    return node.children
  }
  if (Array.isArray(node.children)) {
    return node.children.map((child) => {
      if (typeof child === 'string') return child
      if (child && typeof child === 'object' && 'children' in child) {
        return getTextContent(child as VNode)
      }
      return ''
    }).join('')
  }
  return ''
}

function stripAlertPrefix(nodes: VNode[], pattern: string): VNode[] {
  return nodes.map((node, index) => {
    if (index === 0) {
      return stripFromNode(node, pattern)
    }
    return node
  })
}

function stripFromNode(node: VNode, pattern: string): VNode {
  if (typeof node.children === 'string') {
    const stripped = node.children.replace(pattern, '').replace(/^\n/, '')
    return h(Text, stripped)
  }

  if (Array.isArray(node.children)) {
    const newChildren = (node.children as VNode[]).map((child, i) => {
      if (i === 0 && child && typeof child === 'object') {
        return stripFromNode(child as VNode, pattern)
      }
      return child
    })

    return h(
      node.type as string,
      node.props,
      newChildren
    )
  }

  return node
}

const alertType = computed(() => {
  const defaultSlot = slots.default?.()
  if (!defaultSlot?.length) return null

  const firstChild = defaultSlot[0]!
  const text = getTextContent(firstChild)
  const match = text.match(/^\s*\[?(NOTE|WARNING|TIP|CAUTION)\]?/)
    || text.match(/^\s*!(?:\[)?(NOTE|WARNING|TIP|CAUTION)\]?/)
  if (match) {
    return match[1] as keyof typeof ALERT_TYPES
  }
  return null
})

const alertConfig = computed(() => {
  if (!alertType.value) return null
  return ALERT_TYPES[alertType.value]
})

const matchedPrefix = computed(() => {
  if (!alertType.value) return null
  const defaultSlot = slots.default?.()
  if (!defaultSlot?.length) return null
  const text = getTextContent(defaultSlot[0]!)
  const patterns = [
    `[!${alertType.value}]`,
    `!${alertType.value}`,
    alertType.value
  ]
  for (const p of patterns) {
    if (text.includes(p)) return p
  }
  return alertType.value
})

const strippedContent = computed(() => {
  if (!alertType.value || !matchedPrefix.value) return null
  const defaultSlot = slots.default?.()
  if (!defaultSlot?.length) return null
  return stripAlertPrefix(defaultSlot, matchedPrefix.value)
})
</script>

<template>
  <div
    v-if="alertConfig && strippedContent"
    class="my-4 rounded-lg border-l-4 px-4 py-3"
    :class="{
      'border-info bg-info/10': alertConfig.color === 'info',
      'border-success bg-success/10': alertConfig.color === 'success',
      'border-warning bg-warning/10': alertConfig.color === 'warning',
      'border-error bg-error/10': alertConfig.color === 'error'
    }"
  >
    <div
      class="mb-1 flex items-center gap-1.5 font-semibold"
      :class="{
        'text-info': alertConfig.color === 'info',
        'text-success': alertConfig.color === 'success',
        'text-warning': alertConfig.color === 'warning',
        'text-error': alertConfig.color === 'error'
      }"
    >
      <UIcon :name="alertConfig.icon" class="size-4" />
      <span class="text-sm">{{ alertConfig.label }}</span>
    </div>
    <div class="text-sm text-muted [&>p]:my-1 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0">
      <component
        :is="() => strippedContent"
      />
    </div>
  </div>

  <blockquote
    v-else
    class="border-s-4 border-accented ps-4 italic"
  >
    <slot />
  </blockquote>
</template>
