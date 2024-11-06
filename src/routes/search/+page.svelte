<script lang="ts">
    import { onMount } from "svelte";
    import { apiBaseURL } from "$lib";
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";
    import { Octokit } from "octokit";
    
    let available = false;
    let editable = false;
    let file = "{}";
    let user = '';
    let values: [string, string][] = [];
    let records: {
        "A"?: string[],
        "AAAA"?: string[],
        "CNAME"?: string,
        "MX"?: string[],
        // "NS"?: string[],
        "TXT"?: string[],
        // "CAA"?: {
        //     "flags": number,
        //     "tag": string,
        //     "value": string,
        // }[],
        "SRV"?: {
            "priority": number,
            "weight": number,
            "port": number,
            "target": string,
        }[],
        // "PTR"?: string[],
        "ALIAS"?: string,
    } = {};
    const search = new URLSearchParams($page.url.search);
    const q = search.get("q");
    const octokit = new Octokit({
        // @ts-ignore
        auth: $page.data.session?.access_token || '',
    });

    function convertAndRegister(e: Event) {
        e.preventDefault();
        records = {};
        register(records);
    }

    function register(record: Record<string, any>) {
        window.open('https://github.com/partofmyid/register/new/main/domains?filename=' + q + '.json'
            + '&value=' + encodeURIComponent(JSON.stringify({
                owner: {
                    username: user,
                }, record,
            }, null, 4)));
    }

    onMount(async () => {
        if (!q) return goto("/");
        const res = await fetch(`${apiBaseURL}/query/check/${q}`).then((res) => res.json());
        available = res.available;

        if (!available) file = await fetch(`https://raw.githubusercontent.com/partofmyid/register/main/domains/${q}.json`).then(res => res.text());
        if ($page.data.session) {
            user = (await octokit.rest.users.getAuthenticated()).data.login;
            if (JSON.parse(file)?.owner?.username === user) editable = true;
        }
    });
</script>

<main class="flex justify-center items-center">
    <div class="flex flex-col md:flex-row gap-4 mx-2">
        <div class="bg-ctp-base p-4 flex flex-col h-min">
            <div>
                <h1><span class="underline">{q}</span><span class="text-ctp-subtext0">.part-of.my.id</span></h1>
                <h2 class="text-base italic text-ctp-red data-[available=true]:text-ctp-green" data-available={available || editable}>is {available ? 'available!' : (editable ? 'owned by you!' : 'taken... sorry')}</h2>
                {#if !available && JSON.parse(file).description}
                    <p>
                        {JSON.parse(file).description}
                    </p>
                {/if}
                {#if editable}
                    <input type="text" placeholder="Commit message..." class=" p-2 w-full my-2" disabled>
                {/if}
            </div>
            <div class="my-2">
                {#if !available}
                    <button class="rounded-l-full bg-ctp-sapphire"><a class="no-underline text-ctp-crust" href={
                        'https://github.com/partofmyid/register/blob/main/domains/' + q + '.json'
                    }>File</a></button>
                    <button class="rounded-r-full"><a  class="text-ctp-text no-underline" href={
                        'https://github.com/' + JSON.parse(file)?.owner?.username
                    }>Owner</a></button>
                {:else}
                    <button class="rounded-full bg-ctp-sapphire"><a class="no-underline text-ctp-crust" href={
                        'https://github.com/partofmyid/register/new/main/domains?filename=' + q + '.json'
                    }>Register</a></button>
                {/if}
            </div>
        </div>
        <div class="bg-ctp-base p-4">
            {#if !available}
                    <div class="flex justify-between">
                        <code>domains/{q}.json</code>
                        {#if editable}
                            <button class="bg-ctp-green text-ctp-crust" disabled>
                                Commit
                            </button>
                        {/if}
                    </div>
                    <textarea class="block" cols="30" rows={file.split('\n').length + 1} readonly={!editable} value={file} spellcheck={false}></textarea>
            {:else}
                <form on:submit={convertAndRegister}>
                    <div class="my-2">
                        {#each values as _, i}
                            <div class="flex gap-2">
                                <select class="rounded-l-full p-2 w-24" bind:value={values[i][0]}>
                                    <option value="A">A</option>
                                    <option value="AAAA">AAAA</option>
                                    <option value="CNAME">CNAME</option>
                                    <option value="MX">MX</option>
                                    <option value="TXT">TXT</option>
                                    <option value="SRV">SRV</option>
                                    <option value="ALIAS">ALIAS</option>
                                </select>
                                <input type="text" placeholder="Value" class="p-2 w-32" bind:value={values[i][1]}>
                                <button class="bg-ctp-red text-ctp-crust rounded-r-full" type="button" on:click={() => values.splice(i, 1)}>Remove</button>
                            </div>
                        {/each}
                    </div>
                    <button class="rounded-l-full bg-ctp-sapphire text-ctp-crust" type="submit" disabled={!values.length}>Register</button>
                    <button class="rounded-r-full bg-ctp-green text-ctp-crust" type="button" on:click={() => {
                        values.push(['','']);
                        values = [...values];
                    }}>Add record</button>
                </form>
            {/if}
        </div>
    </div>
</main>
