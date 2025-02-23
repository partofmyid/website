<script>
    import { page } from '$app/stores';

    let params = new URLSearchParams(page.url.search);
    let subdomain = params.get('d');
</script>

<main class="flex gap-4 justify-center items-center max-w-3xl mx-auto">
    <div class="flex flex-col gap-2 justify-center items-center mx-4">
        {#if subdomain}
            <h2>{subdomain}.part-of.my.id is available!</h2>
        {/if}
        <p>If you're seeing this page, then theres a couple of possibilities:</p>
        <div class="flex flex-col gap-2 items-stretch max-w-3xl">
            <div class="bg-ctp-mantle p-4">
                <h2 class="text-lg">1. This subdomain is unregistered</h2>
                <p class="text-sm">in which case you can claim this subdomain by registering!</p>
            </div>
            <div class="bg-ctp-mantle p-4">
                <h2 class="text-lg">2. DNS records are still updating</h2>
                <p class="text-sm">in which case you should wait a bit longer for the records to update.</p>
            </div>
            <div class="bg-ctp-mantle p-4">
                <h2 class="text-lg">3. This subdomain is banned</h2>
                <p class="text-sm">in which case you should contact maintainers for more information.</p>
            </div>
        </div>
    </div>
</main>