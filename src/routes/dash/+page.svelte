<script lang="ts">
    import { page } from '$app/stores';
    import { Octokit } from 'octokit';
    import { apiBaseURL } from '$lib';
    import { onMount } from 'svelte';

    let username = '';
    let domains: {
        subdomain: string,
        properties: {
            owner: {
                username: string,
            },
            record: Record<string, string>,
        }
    }[] = [];
    const octokit = new Octokit({
        // @ts-ignore
        auth: $page.data.session?.access_token || '',
    });

    onMount(async () => {
        if ($page.data.session) {
            const user = await octokit.rest.users.getAuthenticated();
            username = user.data.login;
            domains =  await fetch(apiBaseURL + '/query/username/' + username).then(res => res.json());
        }
    });
</script>

<main class="flex flex-col gap-2 justify-center items-center">
    <div class="bg-ctp-base p-4">
        {#if $page.data.session}
            <div class="flex justify-between items-center mb-4">
                <h1 class="text-2xl">{username}'s subdomains:</h1>
                <a href="/">New</a>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Subdomain</th>
                        <th>Records</th>
                    </tr>
                </thead>
                <tbody>
                    {#each domains as domain}
                        <tr>
                            <td>
                                <a class="no-underline" href={'/search?q='+domain.subdomain}><b>{domain.subdomain}</b>.part-of.my.id</a>
                            </td>
                            <td>
                                <ul>
                                    {#each Object.keys(domain.properties?.record || {}) as record}
                                        <li><b>{record}</b>: {domain.properties.record[record]}</li>
                                    {/each}
                                </ul>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        {:else}
            <h1 class="text-2xl">Please log in to view your domains</h1>
        {/if}
    </div>
</main>
<a href="/api">_</a>