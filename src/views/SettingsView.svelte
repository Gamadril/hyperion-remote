<script>
    import { createEventDispatcher } from 'svelte';
    import { Server } from '../models/Server';

    const dispatch = createEventDispatcher();

    /**
     * @type {Array<import('../models/Server').Server>}
     */
    export let servers = [];

    let isAdding = false;
    let isEditing = false;

    let editServer;

    let editIndex = -1;

    function startAddServer() {
        editServer = new Server();
        isAdding = true;
        isEditing = false;
    }

    function startEditServer(index) {
        const server = servers[index];
        if (!server) return;

        editServer = {
            address: server.address,
            port: server.port,
            name: server.name,
            selected: server.selected,
            forceWs: server.forceWs,
        };

        editIndex = index;
        isEditing = true;
        isAdding = false;
    }

    function cancelEdit() {
        isAdding = false;
        isEditing = false;
    }

    function submitServer() {
        if (!editServer.address || !editServer.port) {
            return;
        }

        if (isAdding) {
            const newServer = new Server(
                editServer.address,
                editServer.port,
                editServer.name,
                false,
                editServer.forceWs,
            );
            dispatch('add', newServer);
        } else if (isEditing) {
            const updatedServer = new Server(
                editServer.address,
                editServer.port,
                editServer.name,
                servers[editIndex]?.selected || false,
                editServer.forceWs,
            );
            dispatch('change', {
                index: editIndex,
                server: updatedServer,
            });
        }

        isAdding = false;
        isEditing = false;
    }

    function removeServer(index) {
        if (isAdding || isEditing) return;
        dispatch('remove', index);
    }
</script>

<div class="settings-view">
    <h2>Settings</h2>

    {#if isAdding || isEditing}
        <div class="edit-form">
            <h5>{isAdding ? 'Add Server' : 'Edit Server'}</h5>

            <div class="form-group">
                <label for="server-name">Server Name</label>
                <input
                    id="server-name"
                    type="text"
                    bind:value={editServer.name}
                />
            </div>

            <div class="form-group">
                <label for="server-address">IP Address *</label>
                <input
                    id="server-address"
                    type="text"
                    placeholder=""
                    bind:value={editServer.address}
                />
            </div>

            <div class="form-group">
                <label for="server-port">Port *</label>
                <input
                    id="server-port"
                    type="number"
                    placeholder="8090"
                    bind:value={editServer.port}
                />
            </div>

            <div class="form-group">
                <label>
                    <input
                        type="checkbox"
                        name="forceWs"
                        bind:checked={editServer.forceWs}
                    />
                    Force unencrypted connection
                </label>
            </div>

            <div class="form-actions">
                <button class="secondary" on:click={cancelEdit}>Cancel</button>
                <button on:click={submitServer}>Save</button>
            </div>
        </div>
    {:else}
        <div class="server-list">
            {#if servers.length === 0}
                <div class="no-servers">
                    <p>No servers configured.</p>
                    <p>Add a server to get started.</p>
                </div>
            {:else}
                {#each servers as server, index}
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <div
                        class="server-item {server.selected ? 'selected' : ''}"
                        on:click={() => dispatch('select', index)}
                    >
                        <div class="server-info">
                            <div class="server-name">
                                {server.name || 'Unnamed Server'}
                            </div>
                            <div class="server-address">
                                {server.address}:{server.port}
                            </div>
                        </div>
                        <div class="server-actions">
                            <button
                                class="icon-button edit {!server.selected
                                    ? 'secondary'
                                    : ''}"
                                on:click|stopPropagation={() =>
                                    startEditServer(index)}
                                title="Edit server"
                            >
                                ✏️
                            </button>
                            <button
                                class="icon-button delete {!server.selected
                                    ? 'secondary'
                                    : ''}"
                                on:click|stopPropagation={() =>
                                    removeServer(index)}
                                title="Remove server"
                            >
                                🗑️
                            </button>
                        </div>
                    </div>
                {/each}
            {/if}
        </div>

        <div class="settings-actions">
            <button on:click={startAddServer}>Add Server</button>
        </div>
    {/if}
</div>

<style>
    .settings-view {
        height: 100%;
        overflow-y: auto;
        padding: 6px 16px;
        display: flex;
        flex-direction: column;
    }

    h2 {
        text-align: center;
    }

    label {
        margin-bottom: 2px;
    }

    .server-list {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .no-servers {
        text-align: center;
        padding: 2rem;
        color: #666;
    }

    .server-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.3rem 1rem;
        color: var(--pico-secondary-inverse);
        background-color: var(--pico-secondary-background);
        border-radius: 8px;
        cursor: pointer;
        transition: background-color 0.2s;
    }

    .server-item:hover {
        background-color: var(--pico-secondary-hover-background);
    }

    .server-item.selected {
        background-color: var(--pico-primary-background);
    }

    .edit-form {
        max-width: 500px;
        margin: 0 auto;
        width: 100%;
    }

    .form-actions,
    .settings-actions {
        display: flex;
        justify-content: center;
        gap: 1rem;
        margin-top: 1rem;
    }
</style>
