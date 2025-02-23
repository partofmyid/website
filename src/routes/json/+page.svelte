<script lang="ts">
    import RecordsForm from "$lib/RecordsForm.svelte";
    import { page } from "$app/state";
    import { Octokit } from "octokit";
    import { onMount } from "svelte";
    import type { SubdomainJSON } from "$lib";
    const octokit = new Octokit({
        // @ts-ignore
        auth: page.data.session?.access_token || '',
    });

    let username = $state('');
    let json: SubdomainJSON | {} = $state({});

    onMount(async () => {
        try {
            username = (await octokit.rest.users.getAuthenticated()).data.login || '';
        } catch {}
        json = {
            owner: { username },
            record: {},
        };
    });
</script>

<main class=" flex flex-col sm:flex-row justify-center items-center gap-2">
    <div class="p-4 bg-ctp-base">
        <h2 class="mb-2">JSON Generator</h2>
        <RecordsForm onConvert={(generated) => {
            json = generated;
        }} {username} />
    </div>
    <div class="p-4 bg-ctp-base">
        <pre>{JSON.stringify(json, null, 2)}</pre>
    </div>
</main>