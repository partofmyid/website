<script lang="ts">
    import type { SubdomainJSON } from "$lib";
    import { writable, type Writable } from "svelte/store";

    const fqdn = '.*'; // "^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\\.)+[a-zA-Z]{2,}$";
    // TODO: fix pattern errors ^^^

    const pattern: Record<string, string> = {
        "A": "^(?:[0-9]{1,3}\\.){3}[0-9]{1,3}$",
        "AAAA": "^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$",
        "CNAME": fqdn,
        "MX": fqdn,
        "TXT": ".*",
        "NS": fqdn,
    };

    const example: Record<string, string> = {
        "A": "1.1.1.1",
        "AAAA": "2001:0db8:85a3:0000:0000:8a2e:0370:7334",
        "CNAME": "username.github.io",
        "MX": "mx1.example.com",
        "TXT": "key=value",
        "NS": "something.cloudflare.com",
    };

    interface Props {
        onConvert?: (json: SubdomainJSON) => void;
        readonly?: boolean;
        username?: string;
        autogen?: boolean;
        json?: SubdomainJSON;
    }

    let {
        onConvert = () => {},
        readonly = false,
        username = '',
        autogen = false,
        json = $bindable({
        owner: { username },
        record: {},
    })
    }: Props = $props();

    let usingCNAME = $state(false);
    let busy = $state(false);
    let inputs: HTMLInputElement[] = $state([]);
    let proxy = writable(false);
    let CNAME = writable('');
    let record: Writable<[
        string, string,
    ][]> = writable([
        ["A",""],
    ]);

    export function getRecordFor(type: string) {
        const values = $record.filter(([t]) => t === type).map(([,v]) => v);
        return values.length > 0 ? values : undefined;
    }

    export function reportValidity() {
        if (usingCNAME) return inputs[0]?.reportValidity();
        return inputs.filter((_,i) => i > 0).every((input) => input.reportValidity());
    }

    export function convert(e?: Event) {
        e?.preventDefault();
        busy = true;
        
        json = {
            owner: { username },
            record: usingCNAME ? { CNAME: $CNAME } : {
                A: getRecordFor("A"),
                AAAA: getRecordFor("AAAA"),
                MX: getRecordFor("MX"),
                TXT: getRecordFor("TXT"),
            },
            proxy: $proxy,
        };
    
        busy = false;
        onConvert(json);
    }

    
    if (autogen) {
        const gen = () => {
            if (!usingCNAME && !reportValidity()) return;
            convert();
        };
        record.subscribe(gen);
        proxy.subscribe(gen);
        CNAME.subscribe(gen);
        gen();
    }
</script>

<form onsubmit={convert}>
    <div class="flex flex-col gap-1 mb-1">
        <label>
            <input type="checkbox" bind:checked={$proxy} disabled={readonly} />
            Use cloudflare proxy
        </label>
        {#if !usingCNAME}
            {#each $record as _,i}
                <div class="flex justify-center items-center gap-1">
                    <select bind:value={$record[i][0]} required disabled={readonly}>
                        <option value="A">A</option>
                        <option value="AAAA">AAAA</option>
                        <option value="MX">MX</option>
                        <option value="TXT">TXT</option>
                        <option value="NS" disabled>NS</option>
                    </select>
                    <input 
                        class="p-1" type="text" required bind:value={$record[i][1]}
                        placeholder={example[$record[i][0]]}
                        pattern={pattern[$record[i][0]]}
                        disabled={readonly} bind:this={inputs[i+1]}
                    />
                    {#if !readonly}
                        <button
                            type="button" disabled={$record.length === 1}
                            onclick={() => $record = $record.filter((_,j) => j !== i)}
                        >Remove</button>
                    {/if}
                </div>
            {/each}
        {:else}
            <input 
                class="p-1" type="text" required bind:value={$CNAME} bind:this={inputs[0]} disabled={readonly}
                placeholder={example.CNAME} pattern={pattern.CNAME}
            />
        {/if}
    </div>
    {#if !readonly}
        <div class="flex justify-between items-center gap-4">
            <div>
                <button
                    type="button"
                    onclick={() => $record = [...$record, ["A",""]]}
                    disabled={usingCNAME}
                >Add</button>
                {#if !autogen}
                    <button type="submit" disabled={busy}>Generate</button>
                {/if}
            </div>
            <label>
                <input type="checkbox" bind:checked={usingCNAME} />
                Use CNAME
            </label>
        </div>
    {/if}
</form>