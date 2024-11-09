<script lang="ts">
    import { apiBaseURL } from '$lib';
    let route = "", pass = "";
</script>

<main class="flex justify-center items-center">
    <div class="bg-ctp-base p-4">
        <h1 class="text-2xl text-center"><a href="https://github.com/partofmyid/api">API Request Client</a></h1>
        <form action={route} method="POST" class="mt-4 flex flex-wrap items-center gap-2">
            <select class="rounded-l-full p-1" bind:value={route}>
                <option value={apiBaseURL + "/git/clone?pass=" + encodeURIComponent(pass)}>Clone Repo</option>
                <option value={apiBaseURL + "/git/pull?pass=" + encodeURIComponent(pass)}>Pull Changes</option>
                <option value={apiBaseURL + "/git/rm?pass=" + encodeURIComponent(pass)}>Remove Directory</option>
                <option value={apiBaseURL + "/db/sync?pass=" + encodeURIComponent(pass)}>Sync Database</option>
            </select>
            <input class="p-1" type="password" placeholder="password" bind:value={pass}>
            <button class="rounded-r-full py-1" type="submit">Submit</button>
        </form>
    </div>
</main>