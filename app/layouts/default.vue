<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import { LazyModalConfirm } from '#components'

const route = useRoute()
const toast = useToast()
const overlay = useOverlay()
const colorMode = useColorMode()

const open = ref(false)

const deleteModal = overlay.create(LazyModalConfirm, {
  props: {
    title: 'Delete chat',
    description: 'Are you sure you want to delete this chat? This cannot be undone.'
  }
})

// Lazy fetch — don't block layout render while chats load
const { data: chats, status: chatsStatus, refresh: _refreshChats } = useLazyFetch('/api/chats', {
  key: 'chats',
  transform: data => data.map(chat => ({
    id: chat.id,
    label: chat.title || 'Untitled',
    to: `/chat/${chat.id}`,
    createdAt: chat.createdAt
  }))
})

// Fetch quota once at app level — pages share via useState
const { fetchQuota } = useQuota()
onMounted(() => {
  fetchQuota()
})

// Preload first 5 chats for faster navigation (reduced from 10)
onNuxtReady(async () => {
  const first5 = (chats.value || []).slice(0, 5)
  if (first5.length === 0) return
  await Promise.allSettled(
    first5.map(chat => $fetch(`/api/chats/${chat.id}`).catch(() => null))
  )
})

const { groups } = useChats(chats)

const items = computed(() => groups.value?.flatMap((group) => {
  return [{
    label: group.label,
    type: 'label' as const
  }, ...group.items.map(item => ({
    ...item,
    slot: 'chat' as const,
    class: item.label === 'Untitled' ? 'text-muted' : ''
  }))]
}))

const hasChats = computed(() => items.value && items.value.length > 0)

// Mock user for auth placeholder
const mockUser = {
  name: 'Guest User',
  initials: 'GU'
}

const userMenuItems = computed<DropdownMenuItem[][]>(() => ([[{
  type: 'label',
  label: mockUser.name,
  icon: 'i-lucide-user'
}], [{
  label: 'Appearance',
  icon: colorMode.value === 'dark' ? 'i-lucide-moon' : 'i-lucide-sun',
  children: [{
    label: 'Light',
    icon: 'i-lucide-sun',
    type: 'checkbox',
    checked: colorMode.value === 'light',
    onSelect(e: Event) {
      e.preventDefault()
      colorMode.preference = 'light'
    }
  }, {
    label: 'Dark',
    icon: 'i-lucide-moon',
    type: 'checkbox',
    checked: colorMode.value === 'dark',
    onSelect(e: Event) {
      e.preventDefault()
      colorMode.preference = 'dark'
    }
  }]
}], [{
  label: 'Sign in (coming soon)',
  icon: 'i-lucide-log-in',
  disabled: true,
  onSelect() {
    // Placeholder: will wire to auth when ready
  }
}]]))

async function deleteChat(id: string) {
  const instance = deleteModal.open()
  const result = await instance.result
  if (!result) {
    return
  }

  // Optimistic: remove from sidebar immediately
  const backup = chats.value
  chats.value = chats.value?.filter(c => c.id !== id) ?? undefined

  if (route.params.id === id) {
    navigateTo('/')
  }

  try {
    await $fetch(`/api/chats/${id}`, { method: 'DELETE' })
    toast.add({
      title: 'Chat deleted',
      description: 'Your chat has been deleted',
      icon: 'i-lucide-trash'
    })
  } catch {
    // Restore on failure
    chats.value = backup
    toast.add({
      title: 'Failed to delete chat',
      icon: 'i-lucide-alert-circle',
      color: 'error'
    })
  }
}

defineShortcuts({
  c: () => {
    navigateTo('/')
  },
  meta_n: () => {
    navigateTo('/')
  }
})
</script>

<template>
  <UDashboardGroup unit="rem">
    <UDashboardSidebar
      id="default"
      v-model:open="open"
      :min-size="12"
      collapsible
      resizable
      class="bg-elevated/50"
    >
      <template #header="{ collapsed }">
        <NuxtLink to="/" class="flex items-center gap-1.5">
          <img src="/fav.png" alt="PDMShell" class="h-7 w-auto shrink-0">
          <span v-if="!collapsed" class="text-lg font-bold text-highlighted">PDMShell</span>
        </NuxtLink>

        <div v-if="!collapsed" class="flex items-center gap-1.5 ms-auto">
          <UDashboardSearchButton collapsed />
          <UDashboardSidebarCollapse />
        </div>
      </template>

      <template #default="{ collapsed }">
        <div class="flex flex-col gap-1.5">
          <UButton
            v-bind="collapsed ? { icon: 'i-lucide-plus' } : { label: 'New chat' }"
            :aria-label="collapsed ? 'New chat' : undefined"
            variant="soft"
            block
            to="/"
            @click="open = false"
          />

          <template v-if="collapsed">
            <UDashboardSearchButton collapsed />
            <UDashboardSidebarCollapse />
          </template>
        </div>

        <template v-if="!collapsed">
          <!-- Skeleton while chats are loading -->
          <div v-if="chatsStatus === 'pending'" class="flex flex-col gap-2 px-2 py-3">
            <USkeleton class="h-3 w-16 rounded" />
            <USkeleton v-for="i in 5" :key="i" class="h-8 w-full rounded" />
          </div>

          <UNavigationMenu
            v-else-if="hasChats"
            :items="items"
            :collapsed="collapsed"
            orientation="vertical"
            :ui="{ link: 'overflow-hidden' }"
          >
            <template #chat-trailing="{ item }">
              <div class="flex -mr-1.25 translate-x-full group-hover:translate-x-0 transition-transform">
                <UButton
                  icon="i-lucide-x"
                  color="neutral"
                  variant="ghost"
                  size="xs"
                  aria-label="Delete chat"
                  class="text-muted hover:text-primary hover:bg-accented/50 focus-visible:bg-accented/50 p-0.5"
                  tabindex="-1"
                  @click.stop.prevent="deleteChat((item as { id: string }).id)"
                />
              </div>
            </template>
          </UNavigationMenu>

          <div v-else class="flex flex-col items-center gap-2 py-8 px-4 text-center">
            <UIcon name="i-lucide-message-square-dashed" class="size-8 text-dimmed" />
            <p class="text-sm text-muted">
              No conversations yet
            </p>
            <p class="text-xs text-dimmed">
              Start a new chat to get going
            </p>
          </div>
        </template>
      </template>

      <template #footer="{ collapsed }">
        <UDropdownMenu
          :items="userMenuItems"
          :content="{ align: 'center', collisionPadding: 12 }"
          :ui="{ content: collapsed ? 'w-48' : 'w-(--reka-dropdown-menu-trigger-width)' }"
        >
          <UButton
            :label="collapsed ? undefined : mockUser.name"
            :trailing-icon="collapsed ? undefined : 'i-lucide-chevrons-up-down'"
            color="neutral"
            variant="ghost"
            block
            :square="collapsed"
            class="data-[state=open]:bg-elevated"
            :ui="{ trailingIcon: 'text-dimmed' }"
          >
            <template #leading>
              <span class="inline-flex items-center justify-center size-6 rounded-full bg-primary/15 text-primary text-xs font-semibold shrink-0">
                {{ collapsed ? mockUser.initials[0] : mockUser.initials }}
              </span>
            </template>
          </UButton>
        </UDropdownMenu>
      </template>
    </UDashboardSidebar>

    <UDashboardSearch
      placeholder="Search chats..."
      :groups="[{
        id: 'links',
        items: [{
          label: 'New chat',
          to: '/',
          icon: 'i-lucide-square-pen'
        }]
      }, ...groups]"
    />

    <slot />
  </UDashboardGroup>
</template>
