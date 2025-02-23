<script lang="ts">
    import { page } from '$app/stores';
</script>

<main class="flex flex-col gap-2 justify-center items-center">
    <h1 class="text-5xl">{page.status}</h1>
    <span class="text-ctp-subtext0">{page.error?.message}</span>
</main>