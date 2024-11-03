<script lang="ts">
    import { onMount } from "svelte";
    import { apiBaseURL } from "$lib";
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";

    const search = new URLSearchParams($page.url.search);
    const q = search.get("q");
    let available = false;

    onMount(() => {
        if (!q) return goto("/");
        fetch(`${apiBaseURL}/query/check/${q}`)
            .then(res => res.json()).then(data => {
                available = data?.available || false;
            });
    });
</script>

<main class="flex flex-col sm:flex-row gap-2 justify-center items-center">
    <div>
        <h1><span class="underline">{q}</span><span class="text-ctp-subtext0">.is-a.dev</span></h1>
        <h2 class="text-base italic text-ctp-red data-[available=true]:text-ctp-green" data-available={available}>is {available ? 'available!' : 'taken... sorry'}</h2>
    </div>
</main>
