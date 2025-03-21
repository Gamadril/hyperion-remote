<script>
    import { onMount, createEventDispatcher } from 'svelte';
    import tinycolor from 'tinycolor2';
    import tools from '../tools';

    const dispatch = createEventDispatcher();

    let pointer;
    let colorpicker;
    let cpradius = 0;
    let cpcenter = 0;
    let drag = false;
    let color = tinycolor({ h: 0, s: 0, v: 1 });
    let brightness = 1.0;
    let inputbox;
    let slider;

    $: rgbColor = {
        r: Math.round(color.toRgb().r * brightness),
        g: Math.round(color.toRgb().g * brightness),
        b: Math.round(color.toRgb().b * brightness),
    };

    function handleResize() {
        if (!colorpicker) return;

        const w = colorpicker.parentNode.clientWidth;
        const h = colorpicker.parentNode.clientHeight;
        const attrW = colorpicker.getAttribute('width');
        const attrH = colorpicker.getAttribute('height');
        const side = attrW === 'auto' ? attrH : attrW;

        if (w > h) {
            if (attrH !== side) {
                colorpicker.setAttribute('height', side);
                colorpicker.setAttribute('width', 'auto');
            }
        } else if (attrW !== side) {
            colorpicker.setAttribute('height', 'auto');
            colorpicker.setAttribute('width', side);
        }

        cpradius = colorpicker.offsetWidth / 2;
        cpcenter = colorpicker.offsetLeft + cpradius;
        updatePointer();
    }

    function getCirclePoint(x, y) {
        const p = { x, y };
        const c = {
            x: cpcenter,
            y: colorpicker.offsetTop + cpradius,
        };

        const n = Math.sqrt(Math.pow(x - c.x, 2) + Math.pow(y - c.y, 2));

        if (n > cpradius) {
            p.x = c.x + cpradius * ((x - c.x) / n);
            p.y = c.y + cpradius * ((y - c.y) / n);
        }

        return p;
    }

    function getColorFromPoint(p) {
        const x = p.x - colorpicker.offsetLeft - cpradius;
        const y = cpradius - p.y + colorpicker.offsetTop;
        const t = Math.atan2(y, x);
        const h = (t * (180 / Math.PI) + 360) % 360;
        const s = Math.min(Math.sqrt(x * x + y * y) / cpradius, 1);

        return tinycolor({ h, s, v: 1 });
    }

    function getPointFromColor(color) {
        const t = color.toHsv().h * (Math.PI / 180);
        const s = color.toHsv().s;
        const y = Math.sin(t) * cpradius * s;
        const x = Math.cos(t) * cpradius * s;

        return {
            x: Math.round(x + colorpicker.offsetLeft + cpradius),
            y: Math.round(cpradius - y + colorpicker.offsetTop),
        };
    }

    function updatePointer() {
        if (!pointer || !color) return;

        const point = getPointFromColor(color);
        pointer.style.left = point.x - pointer.offsetWidth / 2 + 'px';
        pointer.style.top = point.y - pointer.offsetHeight / 2 + 'px';
        pointer.style.backgroundColor = color.toHexString();
    }

    function handleColorPickerEvent(event) {
        const { clientX, clientY } = event.touches?.[0] ?? event;
        const point = getCirclePoint(clientX, clientY);
        color = getColorFromPoint(point);
        updatePointer();
        dispatch('change', rgbColor);
    }

    function handleBrightnessChange(event) {
        brightness = event.target.value / 100;
        dispatch('change', rgbColor);
    }

    function handleInputChange(event) {
        const inputValue = event.target.value;

        if (inputValue.length !== 6) return;

        const rgb = tinycolor(inputValue).toRgb();

        if (rgb.r === 0 && rgb.g === 0 && rgb.b === 0) {
            brightness = 0;
            color = tinycolor({ r: 0xff, g: 0xff, b: 0xff });
        } else {
            const bright = Math.max(rgb.r, rgb.g, rgb.b) / 256;
            rgb.r = Math.round(rgb.r / bright);
            rgb.g = Math.round(rgb.g / bright);
            rgb.b = Math.round(rgb.b / bright);
            brightness = bright;
            color = tinycolor(rgb);
        }

        updatePointer();
        dispatch('change', rgbColor);
    }

    function handleKeydown(event) {
        const validKeys = [8, 9, 16, 37, 38, 39, 40, 46];
        if (!validKeys.includes(event.keyCode)) {
            if (
                event.target.value.length >= 6 &&
                event.target.selectionEnd - event.target.selectionStart === 0
            ) {
                event.preventDefault();
            } else if (event.keyCode < 48 || event.keyCode > 71) {
                event.preventDefault();
            }
        }
    }

    onMount(() => {
        setTimeout(() => {
            handleResize();
            window.addEventListener('resize', handleResize);
        }, 700);
        return () => window.removeEventListener('resize', handleResize);
    });
</script>

<div class="color-view">
    <div id="colorpicker">
        <img
            bind:this={colorpicker}
            id="colorwheelbg"
            src="res/colorwheel.png"
            alt="Color Wheel"
            width="auto"
            height="90%"
        />
        <div bind:this={pointer} id="pointer"></div>
        <div
            id="touchrect"
            on:mousedown={() => (drag = true)}
            on:mousemove={(e) => drag && handleColorPickerEvent(e)}
            on:mouseup={() => (drag = false)}
            on:touchstart={() => (drag = true)}
            on:touchmove={(e) => drag && handleColorPickerEvent(e)}
            on:touchend={() => (drag = false)}
        ></div>
    </div>

    <input
        id="brightness"
        class="slider"
        type="range"
        min="0"
        max="100"
        step="2"
        bind:this={slider}
        value={brightness * 100}
        on:input={handleBrightnessChange}
    />
    <div id="buttonctrl">
        <button
            class="icon"
            id="clear_button"
            on:click={() => dispatch('clear')}>&#xe807;</button
        >
        <input
            type="text"
            class="value"
            autocomplete="off"
            autocorrect="off"
            autocapitalize="off"
            maxlength="6"
            bind:this={inputbox}
            value={tools.b2hexstr(rgbColor.r) +
                tools.b2hexstr(rgbColor.g) +
                tools.b2hexstr(rgbColor.b)}
            on:input={handleInputChange}
            on:keydown={handleKeydown}
        />
        <button
            class="icon"
            id="clearall_button"
            on:click={() => {
                color = tinycolor({ h: 0, s: 0, v: 1 });
                updatePointer();
                brightness = 0.0;
                dispatch('clearall');
            }}>&#xe617;</button
        >
    </div>
</div>

<style>
    .color-view {
        display: flex;
        flex-direction: column;
        height: 100%;
        overflow-y: auto;
    }

    #colorpicker {
        position: relative;
        flex: 1;
    }

    #colorwheelbg {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
    }

    #pointer {
        width: 30px;
        height: 30px;
        position: absolute;
        border: 2px solid #ffffff;
        border-radius: 15px;
        left: calc(50% - 15px);
        top: calc(50% - 15px);
    }

    #touchrect {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 10;
    }

    #buttonctrl {
        display: flex;
        justify-content: space-between;
        margin: 10px auto 35px auto;
        align-items: baseline;
    }

    #buttonctrl .icon {
        font-family: 'fontello';
        font-size: 27px;
        line-height: 100%;
        padding: 0 20px;
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        outline: none;
        box-shadow: none;
    }

    #buttonctrl .icon:active {
        color: var(--color-active);
    }

    #buttonctrl .value {
        font-family: Monaco, monospace;
        text-align: center;
        width: 120px;
        user-select: text;
        padding: 6px;
        margin-left: 10px;
        margin-right: 10px;
    }

    #brightness {
        appearance: none;
        width: 70%;
        outline: none;
        margin: 10px auto;
        background-image: linear-gradient(to right, #000000 0%, #ffffff 100%);
        height: 20px;
    }

    #brightness::-moz-range-track {
        appearance: none;
        background-color: transparent;
        background-image: none;
    }

    #brightness::-webkit-slider-runnable-track {
        appearance: none;
        background-color: transparent;
        background-image: none;
        margin-top: -2px;
    }

    #brightness::-webkit-slider-thumb {
        appearance: none;
        background: transparent;
        border: 3px solid #ffffff;
        width: 14px;
        border-radius: 4px;
        top: -4px;
        height: 28px;
        box-sizing: border-box;
        cursor: pointer;
    }

    #brightness::-moz-range-thumb {
        appearance: none;
        background: transparent;
        border: 3px solid rgba(255, 255, 255, 1);
        width: 14px;
        border-radius: 4px;
        height: 28px;
        top: -4px;
        box-sizing: border-box;
        cursor: pointer;
    }
</style>
