<script>
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';
    import ColorView from './views/ColorView.svelte';
    import EffectsView from './views/EffectsView.svelte';
    import SettingsView from './views/SettingsView.svelte';
    import { Storage } from './api/Storage';
    import { HyperionAPI } from './api/HyperionAPI';
    import { Server } from './models/Server';

    let isConnected = false;
    let api;
    let currentView = 'color';
    let servers = [];
    let effects = [];
    let selectedServer;
    let message = '';
    let messageTimer;

    $: {
        selectedServer = servers.find((server) => server.selected);
        console.log('Selected server: ' + selectedServer?.getDisplayName());
        if (selectedServer) {
            connect();
        } else if (api) {
            api.disconnect();
            api = null;
            effects = [];
        }
    }

    onMount(() => {
        servers = Storage.loadServers();
        return () => {
            if (api) {
                api.disconnect();
            }
            if (messageTimer) {
                clearTimeout(messageTimer);
            }
        };
    });

    function showMessage(msg) {
        // Clear any existing timer
        if (messageTimer) {
            clearTimeout(messageTimer);
        }

        // Set the message
        message = msg;

        // Set a timer to clear the message after 2 seconds
        messageTimer = setTimeout(() => {
            message = '';
            messageTimer = null;
        }, 2000);
    }

    function addServer(event) {
        const newServer = event.detail;
        if (servers.length === 0) {
            newServer.selected = true;
        }
        servers.push(newServer);
        servers = servers;
        Storage.saveServers(servers);
    }

    function changeServer(event) {
        const updatedServer = event.detail.server;
        servers[event.detail.index] = updatedServer;
        Storage.saveServers(servers);
    }

    function connect() {
        if (api) {
            api.disconnect();
        }
        if (selectedServer) {
            api = new HyperionAPI(selectedServer);
        } else {
            showMessage('No server selected');
            return;
        }

        api.connect()
            .then(() => {
                isConnected = true;
                showMessage('Connected to ' + selectedServer.getDisplayName());
            })
            .then(() => {
                return api.getServerInfo();
            })
            .then((info) => {
                effects = info.effects;
            })
            .catch((error) => {
                console.error(error);
                isConnected = false;
                showMessage('Connection failed: ' + error.message);
            });
    }

    function removeServer(event) {
        const updatedServers = servers.filter(
            (_server, i) => i !== event.detail,
        );
        servers = updatedServers;
        Storage.saveServers(servers);
    }

    function selectServer(event) {
        const updatedServers = servers.map((server, i) => {
            server.selected = i === event.detail;
            return server;
        });
        servers = updatedServers;
        Storage.saveServers(servers);
    }

    function handleColorChange(event) {
        if (api) {
            api.setColor(event.detail);
        }
    }

    function handleEffectSelect(event) {
        if (api) {
            api.runEffect(event.detail);
        }
    }

    function handleClear() {
        if (api) {
            api.clear();
        }
    }

    function handleClearAll() {
        if (api) {
            api.clearall();
        }
    }
</script>

<div id="app">
    <div id="main">
        {#if currentView === 'color'}
            <ColorView
                on:change={handleColorChange}
                on:clear={handleClear}
                on:clearall={handleClearAll}
            />
        {:else if currentView === 'effects'}
            <EffectsView {effects} on:select={handleEffectSelect} />
        {:else if currentView === 'settings'}
            <SettingsView
                {servers}
                on:add={addServer}
                on:change={changeServer}
                on:remove={removeServer}
                on:select={selectServer}
            />
        {/if}

        {#if message}
            <div id="message" transition:fade={{ duration: 200 }}>
                {message}
            </div>
        {/if}
    </div>
    <div id="footer">
        <div class="button-group">
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div
                class="button"
                class:selected={currentView === 'color'}
                id="colorButton"
                on:click={() => (currentView = 'color')}
            >
                <div class="icon">&#xe800;</div>
                <div class="title">Color</div>
                <div class="touchrect"></div>
            </div>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div
                class="button"
                class:selected={currentView === 'effects'}
                id="effectsButton"
                on:click={() => (currentView = 'effects')}
            >
                <div class="icon">&#xe602;</div>
                <div class="title">Effects</div>
                <div class="touchrect"></div>
            </div>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div
                class="button"
                class:selected={currentView === 'settings'}
                id="settingsButton"
                on:click={() => (currentView = 'settings')}
            >
                <div class="icon">&#x6e;</div>
                <div class="title">Settings</div>
                <div class="touchrect"></div>
            </div>
        </div>
    </div>
</div>

<style>
    #app {
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        min-width: 320px;
        min-height: 460px;
    }

    #main {
        flex: 1;
        position: relative;
        overflow: auto;
    }

    #footer {
        border-top: 1px solid #919f9f;
    }

    #footer .button-group {
        display: flex;
        justify-content: space-around;
        max-width: 500px;
        margin: 0 auto;
    }

    #footer .button {
        width: 100%;
        text-align: center;
        position: relative;
        padding: 6px;
    }

    .touchrect {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 10;
    }

    .icon {
        font-family: 'fontello';
    }

    #footer .button .icon {
        font-size: 30px;
    }

    #footer .button:active,
    #footer .button.selected {
        color: #ffffff;
    }

    #message {
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 8px 16px;
        border-radius: 4px;
        z-index: 100;
        text-align: center;
    }
</style>
