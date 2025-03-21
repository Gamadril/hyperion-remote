<script>
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    /**
     * @type {Array<{name: string, type: string, args: object}>}
     */
    export let effects = [];

</script>

<div class="effects-view">
    <h2>Effects</h2>

    {#if effects.length === 0}
        <div class="no-effects">
            <p>No effects available.</p>
            <p>Connect to a server to see available effects.</p>
        </div>
    {:else}
        <div class="effects-list">
            {#each effects as effect}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <article on:click={() => dispatch('select', effect)}>
                    {effect.name}
                </article>
            {/each}
        </div>
    {/if}
</div>

<style>
    .effects-view {
        height: 100%;
        overflow-y: auto;
        padding: 6px 16px;
        display: flex;
        flex-direction: column;
    }

    h2 {
        text-align: center;
    }

    .no-effects {
        text-align: center;
    }

    article {
        cursor: pointer;
        margin-bottom: 10px;
        padding: 12px 20px;
    }

    article:active {
        background-color: var(--pico-primary-hover-background);
        color: var(--pico-primary-inverse);
    }
</style>
