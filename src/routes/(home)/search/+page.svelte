<script lang="ts">
    import { onMount } from "svelte";
    import { apiBaseURL } from "$lib";
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";

    const search = new URLSearchParams($page.url.search);
    const q = search.get("q");

    onMount(() => {
        if (!q) return goto("/");
        fetch(`${apiBaseURL}/query/check/${q}`)
            .then(res => res.json()).then(data => {
                console.log(data);
            });
    });
</script>

<main class="flex flex-col gap-2 justify-center items-center">
    <h1>WIP</h1>
    <p>Work in progress, please register manually.</p>
</main>
