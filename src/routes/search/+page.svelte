<script lang="ts">
    import { onMount } from "svelte";
    import { page } from "$app/state";
    import { goto } from "$app/navigation";
    import { Octokit } from "octokit";
    import RecordsForm from "$lib/RecordsForm.svelte";
    import { gfmPlugin } from "svelte-exmarkdown/gfm";
    import { remarkAlert } from "remark-github-blockquote-alert";
    import Markdown from "svelte-exmarkdown";
    import type { Plugin } from "svelte-exmarkdown";
    import rehypeRaw from 'rehype-raw';
    import 'remark-github-blockquote-alert/alert.css';
    
    let available = $state(false);
    let editable = $state(false);
    let file = $state("{}");
    let user = $state('');
    let readme = $state('');
    const plugins: Plugin[] = [ gfmPlugin(), { rehypePlugin: [rehypeRaw] }, { remarkPlugin: [remarkAlert] } ];
    const search = new URLSearchParams(page.url.search);
    const q = search.get("q");
    const octokit = new Octokit({
        // @ts-ignore
        auth: page.data.session?.access_token || '',
    });

    onMount(async () => {
        if (!q) return goto("/");
        const res = await fetch(`https://raw.githubusercontent.com/partofmyid/register/main/domains/${q}.json`).then(async (res) => {
            // if ([404,])
            available = res.status === 404;

            file = available ? JSON.stringify({
                owner: { username: user },
                record: {},
            }, null, 2) : await res.text();
        });

        if (page.data.session) {
            user = (await octokit.rest.users.getAuthenticated()).data.login;
            if (JSON.parse(file)?.owner?.username === user || available) editable = true;
        }

        await fetch('https://raw.githubusercontent.com/partofmyid/register/main/README.md').then(res => res.text()).then(data => readme = data);
    });

    function commit() {
        const url = available ? 'https://github.com/partofmyid/register/new/main/domains?' + new URLSearchParams({
            filename: q + '.json',
            value: file,
            message: ('[dashboard] add ' + q + '.part-of.my.id'),
        }) : 'https://github.com/partofmyid/register/edit/main/domains/' + q + '.json';
        window.open(url, '_blank');
    }
</script>

<main class="flex justify-center items-center">
    <div class="flex flex-col md:flex-row gap-4 mx-2">
        <div class="flex flex-col gap-4 w-min">
            <div class="bg-ctp-base p-4 flex flex-col h-min">
                <div>
                    <h1 class="text-nowrap"><span class="underline">{q}</span><span class="text-ctp-subtext0">.part-of.my.id</span></h1>
                    <h2 class="text-base italic text-ctp-red data-[available=true]:text-ctp-green" data-available={available || editable}>is {available ? 'available!' : (editable ? 'owned by you!' : 'taken... sorry')}</h2>
                    {#if !available && JSON.parse(file).description}
                        <p>
                            {JSON.parse(file).description}
                        </p>
                    {/if}
                </div>
                <div class="my-2">
                    {#if !available}
                        <button class="rounded-l-full bg-ctp-sapphire"><a class="no-underline text-ctp-crust" href={
                            'https://' + q + '.part-of.my.id'
                        } target="_blank">Visit</a></button>
                        <button data-owner={editable} class="data-[owner=true]:rounded-r-full"><a class="no-underline text-ctp-text" href={
                            'https://github.com/partofmyid/register/blob/main/domains/' + q + '.json'
                        }>File</a></button>
                        {#if !editable}
                            <button class="rounded-r-full"><a  class="text-ctp-text no-underline" href={
                                'https://github.com/' + JSON.parse(file)?.owner?.username
                            }>Owner</a></button>
                        {/if}
                    {:else}
                        <button class="rounded-full bg-ctp-sapphire text-ctp-crust" onclick={commit}>Register</button>
                    {/if}
                </div>
            </div>
            <div class="bg-ctp-base p-4 flex flex-col h-min max-w-container">
                <details open={editable}>
                    <summary>README.md</summary>
                    <Markdown md={readme} {plugins} />
                </details>
            </div>
        </div>
        <div class="bg-ctp-base p-4 h-min">
            {#if available}
                <RecordsForm onConvert={(generated) => {
                    file = JSON.stringify(generated, null, 2);
                }} username={user} autogen={true}/>
            {:else}
                <div class="flex justify-between">
                    <code>domains/{q}.json</code>
                    {#if editable}
                        <button class="bg-ctp-green text-ctp-crust" onclick={commit}>
                            Edit
                        </button>
                    {/if}
                </div>
                <textarea class="block" cols="30" rows={file.split('\n').length + 1} readonly bind:value={file} spellcheck={false}></textarea>
            {/if}
        </div>
    </div>
</main>
