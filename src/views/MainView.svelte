<script>
import { onMount, createEventDispatcher } from 'svelte';
import tinycolor from 'tinycolor2';
import Slider from './Slider.svelte';
import { b2hexstr } from '../utils/Tools';

const dispatch = createEventDispatcher();

let pointer;
let colorpicker;
let inputbox;
let cpradius = 0;
let cpcenter = 0;
let drag = false;
let color = tinycolor({ h: 0, s: 1, v: 1 });
let brightness = 1.0;
let messageTimer;

$: rgbColor = {
    r: Math.round(color.toRgb().r * brightness),
    g: Math.round(color.toRgb().g * brightness),
    b: Math.round(color.toRgb().b * brightness)
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
        x: colorpicker.offsetLeft + cpradius,
        y: colorpicker.offsetTop + cpradius
    };
    
    const n = Math.sqrt(Math.pow((x - c.x), 2) + Math.pow((y - c.y), 2));

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
        y: Math.round(cpradius - y + colorpicker.offsetTop)
    };
}

function updatePointer() {
    if (!pointer || !color) return;
    
    const point = getPointFromColor(color);
    pointer.style.left = (point.x - pointer.offsetWidth / 2) + 'px';
    pointer.style.top = (point.y - pointer.offsetHeight / 2) + 'px';
    pointer.style.backgroundColor = color.toHexString();
}

function handleColorPickerEvent(event) {
    const { clientX, clientY } = event.touches?.[0] ?? event;
    const point = getCirclePoint(clientX, clientY);
    color = getColorFromPoint(point);
    dispatch('colorChange', rgbColor);
}

function handleBrightnessChange(event) {
    brightness = event.detail;
    dispatch('colorChange', rgbColor);
}

function handleInputChange(event) {
    const rgb = tinycolor(event.target.value).toRgb();

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

    dispatch('colorChange', rgbColor);
}

function handleKeydown(event) {
    const validKeys = [8, 9, 16, 37, 38, 39, 40, 46];
    if (!validKeys.includes(event.keyCode)) {
        if (event.target.value.length >= 6 && 
            (event.target.selectionEnd - event.target.selectionStart) === 0) {
            event.preventDefault();
        } else if (event.keyCode < 48 || event.keyCode > 71) {
            event.preventDefault();
        }
    }
}

function showMessage(text, type) {
    if (messageTimer) clearTimeout(messageTimer);
    dispatch('message', { text, type });
    messageTimer = setTimeout(() => {
        dispatch('message', { text: '', type: '' });
    }, 1600);
}

export function setColor(rgb) {
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
}

onMount(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
});
</script>

<div class="main-view">
    <div id="colorpicker">
        <img 
            bind:this={colorpicker}
            id="colorwheelbg" 
            src="images/colorwheel.png" 
            alt="Color Wheel"
            width="auto" 
            height="100%"
        />
        <div 
            bind:this={pointer} 
            id="pointer"
        ></div>
        <div 
            class="touchrect"
            on:mousedown={() => drag = true}
            on:mousemove={e => drag && handleColorPickerEvent(e)}
            on:mouseup={() => drag = false}
            on:touchstart={() => drag = true}
            on:touchmove={e => drag && handleColorPickerEvent(e)}
            on:touchend={() => drag = false}
        ></div>
    </div>

    <div class="controls">
        <div class="color-input">
            <input
                bind:this={inputbox}
                class="value"
                type="text"
                maxlength="6"
                value={b2hexstr(rgbColor.r) + b2hexstr(rgbColor.g) + b2hexstr(rgbColor.b)}
                on:input={handleInputChange}
                on:keydown={handleKeydown}
            />
        </div>

        <div class="brightness-slider">
            <Slider
                id="brightness"
                min={0}
                max={1}
                step={0.02}
                bind:value={brightness}
                on:change={handleBrightnessChange}
                style="background-image: linear-gradient(to right, #000000 0%, {color.toHexString()} 100%);"
            />
        </div>

        <div class="buttons">
            <button on:click={() => dispatch('clear')}>Clear</button>
            <button on:click={() => dispatch('clearall')}>Clear All</button>
        </div>
    </div>

    <nav class="footer">
        <div class="button" data-area="main" on:click={() => dispatch('barClick', 'main')}>
            <span>Main</span>
        </div>
        <div class="button" data-area="effects" on:click={() => dispatch('barClick', 'effects')}>
            <span>Effects</span>
        </div>
        <div class="button" data-area="transform" on:click={() => dispatch('barClick', 'transform')}>
            <span>Transform</span>
        </div>
        <div class="button" data-area="settings" on:click={() => dispatch('barClick', 'settings')}>
            <span>Settings</span>
        </div>
    </nav>
</div>

<style>
.main-view {
    display: flex;
    flex-direction: column;
    height: 100%;
}

#colorpicker {
    position: relative;
    width: 100%;
    aspect-ratio: 1;
    max-width: 500px;
    margin: 0 auto;
}

#colorwheelbg {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

#pointer {
    position: absolute;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px solid white;
    box-shadow: 0 0 4px rgba(0,0,0,0.5);
    transform: translate(-50%, -50%);
}

.touchrect {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
}

.controls {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.color-input {
    display: flex;
    justify-content: center;
}

.color-input input {
    width: 120px;
    text-align: center;
    font-family: monospace;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.brightness-slider {
    margin: 0 auto;
    width: 100%;
    max-width: 300px;
}

.buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
}

.buttons button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    background: #444;
    color: white;
    cursor: pointer;
}

.buttons button:hover {
    background: #555;
}

.footer {
    margin-top: auto;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    background: #333;
    padding: 0.5rem;
}

.footer .button {
    text-align: center;
    color: white;
    padding: 0.5rem;
    cursor: pointer;
}

.footer .button:hover {
    background: rgba(255,255,255,0.1);
}

.footer .button.selected {
    background: rgba(255,255,255,0.2);
}
</style> 