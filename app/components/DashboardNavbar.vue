<script setup lang="ts">
withDefaults(defineProps<{
  title?: string
}>(), {
  title: 'PDMShell Assistant'
})
</script>

<template>
  <UDashboardNavbar
    class="sticky lg:absolute top-0 inset-x-0 border-b-0 z-10 bg-default/75 backdrop-blur lg:bg-transparent lg:backdrop-blur-none pointer-events-none"
    :ui="{ left: 'pointer-events-auto', right: 'pointer-events-auto' }"
  >
    <template #title>
      <span class="text-sm font-medium text-muted truncate">{{ title }}</span>
    </template>

    <template #right>
      <UButton
        color="neutral"
        variant="ghost"
        icon="i-lucide-plus"
        aria-label="New chat"
        to="/"
        class="lg:hidden"
      />
    </template>
  </UDashboardNavbar>
</template>
