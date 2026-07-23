<script>
	import { tick } from "svelte";
	import Slider from "$components/helpers/Slider.svelte";
	import Slide  from "$components/helpers/Slider.Slide.svelte";
	import rotateIcon from "$svg/rotate.svg";

	import Keyboard  from "../items/KeyboardDown.svelte";
	import Keyboard2 from "../items/KeyboardUp.svelte";
  
	import Slide1   from "../content/MagicPick.svelte";
	import Slide2   from "../content/MagicCycle1.svelte";
	import Slide2_2 from "../content/MagicCycle2.svelte";
	import Slide2_3 from "../content/MagicCycle3.svelte";
	import Slide2_4 from "../content/MagicReveal.svelte";
  
	import Slide3   from "../content/MathPick.svelte";
	import Slide4   from "../content/MathPickedCard.svelte";
	import Slide5   from "../content/MathCycle1.1.svelte";
	import Slide5_5 from "../content/MathCycle1.2.svelte";
	import Slide6   from "../content/MathCycle2.1.svelte";
	import Slide6_5 from "../content/MathCycle2.2.svelte";
	import Slide7   from "../content/MathCycle3.1.svelte";
	import Slide7_5 from "../content/MathCycle3.2.svelte";
	import Slide8   from "../content/MathReveal.svelte";
	import Slide9   from "../content/MathVariation.svelte";
	import Slide10   from "../content/End.svelte";
  
	// --- Refs ---
	let sliderY;          // vertical slider (0..1)
	let sliderX = [];     // per-row sliders: [row0, row1]
  
	// --- State ---
	let y = 0;            // current row: 0 or 1
	let x = [0, 0];       // current column per row
	const ROW_LEN = [6, 10]; // row0: 6 (0..5), row1: 10 (0..9)

	// --- Timing & guard ---
	const TRANSITION_MS = 500; // matches Slider's default transition duration
	const sleep = (ms) => new Promise(r => setTimeout(r, ms));
	let busy = false;
	async function run(task) {
	  if (busy) return;
	  busy = true;
	  try { await task(); } finally { busy = false; }
	}

	// --- Move horizontal to an exact index directly (single continuous slide) ---
	async function moveHTo(row, target) {
	  const max = ROW_LEN[row] - 1;
	  target = Math.max(0, Math.min(max, target));

	  sliderX[row]?.jump?.(target);
	  x[row] = target;
	  await sleep(TRANSITION_MS);
	}

	// --- Jump to an exact cell, switching rows if needed ---
	// When crossing rows, the destination row's horizontal position is snapped
	// *instantly* (no transition) before the vertical transition starts, so it
	// arrives already on the target slide instead of visibly sliding over from
	// its last-visited slide.
	async function goToCell(targetY, targetX) {
	  const max = ROW_LEN[targetY] - 1;
	  targetX = Math.max(0, Math.min(max, targetX));

	  if (targetY === y) {
		await moveHTo(targetY, targetX);
		return;
	  }

	  await sliderX[targetY]?.jumpInstant?.(targetX);
	  x[targetY] = targetX;
	  sliderY?.jump?.(targetY);
	  y = targetY;
	  await sleep(TRANSITION_MS);
	  await tick(); // ensure the new row's slider is mounted
	}
  
	// --- Routing rules between rows ---
	// Down from row 0 -> row 1
	const downMapFromY0 = { 0: 0, 1: 2, 2: 4, 3: 6, 4: 8, 5: 9 };
	// Up from row 1 -> row 0 (bucketed)
	function upMapFromY1(h) {
	  if (h <= 1) return 0;      // 0/1 -> 0
	  if (h <= 3) return 1;      // 2/3 -> 1
	  if (h <= 5) return 2;
	  if (h <= 7) return 3;
	  if (h <= 8) return 4;
	  return 5;                  // 9 -> 5
	}

	// --- Wrap-around inside a row ---
	function wrapRight(row) {
	  const max = ROW_LEN[row] - 1;
	  return (x[row] === max) ? 0 : x[row] + 1;
	}
	function wrapLeft(row) {
	  const max = ROW_LEN[row] - 1;
	  return (x[row] === 0) ? max : x[row] - 1;
	}
  
	// --- Unified keyboard/tap handler ---
	const onTap = ({ detail }) => run(async () => {
	  if (detail === "right") { await moveHTo(y, wrapRight(y)); return; }
	  if (detail === "left")  { await moveHTo(y, wrapLeft(y));  return; }
  
	  if (detail === "down") {
		if (y !== 0) return; // already bottom row
		const targetX = downMapFromY0[x[0]];
		if (targetX == null) return; // from v0-h0 down is blocked
		await goToCell(1, targetX);
		return;
	  }

	  if (detail === "up") {
		if (y !== 1) return; // already top row
		const targetX = upMapFromY1(x[1]);
		await goToCell(0, targetX);
		return;
	  }
	});

	// --- Programmatic goto (slides may emit this) ---
	function handleGoto(e) {
	  const { y: targetY, x: targetX } = e.detail || {};
	  run(() => goToCell(targetY, targetX));
	}
  
	// --- Reactive UI guards for keyboard widgets ---
	// Which directions are visually disabled?
	$: disabledDirs = (y === 0 ? ["up"] : ["down"]);    // block off-grid vertical moves

	// Real-time window size, used only to decide whether the rotate prompt
	// should be listening for keyboard shortcuts (see rotatePromptActive).
	// NOT used for the stage scaling math below -- on iOS Safari,
	// window.innerWidth/innerHeight can report stale pre-rotation values for
	// a while after an orientation change (a known WebKit quirk), which
	// showed up as a visible gutter of page background down the side of the
	// stage. Measuring the .deck element's own rendered box (further down)
	// sidesteps that entirely since it reflects real layout, not a
	// window-level event.
	let innerWidth = 0;
	let innerHeight = 0;

	// --- Rotate-device prompt ---
	// Small screens (phones/small tablets) in portrait get a "please rotate"
	// overlay instead of the cramped experience; landscape (or bigger screens)
	// always shows the deck as usual. Visibility is driven purely by the CSS
	// media query below (not this JS value) so there's no flash of the deck
	// before hydration on prerendered pages -- this is only used to stop the
	// keyboard shortcuts from firing while the overlay covers the screen.
	$: rotatePromptActive =
	  innerWidth > 0 &&
	  innerWidth < 900 &&
	  innerHeight > innerWidth;

	// --- Scale-to-fit stage ---
	// Every slide is authored assuming a roomy ~900px-tall canvas. On short
	// viewports (phone landscape, small windows) that overflows and text
	// starts overlapping the keyboard UI, so slides in that situation render
	// onto a fixed STAGE_HEIGHT canvas that's scaled down uniformly to fit --
	// proportions (and thus the existing per-slide layouts) stay intact.
	// This only triggers below COMPACT_MAX_HEIGHT, which sits comfortably
	// between "phone in landscape" (always well under 500px tall, even on
	// the largest phones) and "any laptop/desktop browser window" (rarely
	// under 600px of content height even on a small screen) -- so ordinary
	// desktop windows keep rendering at 1:1 exactly as they did originally,
	// and only genuinely phone-shaped screens get scaled.
	// deckWidth/deckHeight are bound to .deck's actual rendered box (its CSS
	// size is 100vw/100dvh) rather than read from window.innerWidth/Height,
	// so the math always matches what's really on screen.
	let deckWidth = 0;
	let deckHeight = 0;
	const STAGE_HEIGHT = 900;
	const COMPACT_MAX_HEIGHT = 550;
	$: compact = deckHeight > 0 && deckHeight < COMPACT_MAX_HEIGHT;
	$: scale = compact ? deckHeight / STAGE_HEIGHT : 1;
	$: stageWidth = compact ? deckWidth / scale : null;

	// --- Touch/swipe navigation ---
	// Phones lose the on-screen keyboard buttons (hidden below 900px wide);
	// swiping drives the same onTap handler the buttons and physical arrow
	// keys use, so all three input methods stay in sync.
	const SWIPE_THRESHOLD = 50; // px
	let touchStartX = 0;
	let touchStartY = 0;

	function handleTouchStart(e) {
	  const t = e.touches[0];
	  touchStartX = t.clientX;
	  touchStartY = t.clientY;
	}

	function handleTouchEnd(e) {
	  const t = e.changedTouches[0];
	  const dx = t.clientX - touchStartX;
	  const dy = t.clientY - touchStartY;
	  if (Math.max(Math.abs(dx), Math.abs(dy)) < SWIPE_THRESHOLD) return; // treat as a tap, not a swipe

	  if (Math.abs(dx) > Math.abs(dy)) {
		onTap({ detail: dx < 0 ? "right" : "left" });
	  } else {
		onTap({ detail: dy < 0 ? "down" : "up" });
	  }
	}
  </script>

  <svelte:window bind:innerWidth bind:innerHeight />

  <div class="rotate-prompt">
	<div class="rotate-icon">{@html rotateIcon}</div>
	<p>Please <span class="highlight">rotate</span> your phone for a better experience</p>
  </div>

  <div class="deck" bind:clientWidth={deckWidth} bind:clientHeight={deckHeight}>
  <div
	class="stage"
	class:compact
	style={compact ? `width:${stageWidth}px; height:${STAGE_HEIGHT}px; transform: scale(${scale});` : ""}
	on:touchstart={handleTouchStart}
	on:touchend={handleTouchEnd}
  >
  <article>
	<Slider direction="vertical" bind:this={sliderY}>
	  <!-- Row 0 -->
	  <Slide index={0}>
		<Slider direction="horizontal" bind:this={sliderX[0]}>
		  <Slide index={0}><Slide1/></Slide>
		  <Slide index={1}><Slide2 on:goto={handleGoto} /></Slide>
		  <Slide index={2}><Slide2_2 on:goto={handleGoto} /></Slide>
		  <Slide index={3}><Slide2_3/></Slide>
		  <Slide index={4}><Slide2_4/></Slide>
		  <Slide index={5}><Slide10 on:goto={handleGoto} /></Slide>
		</Slider>
	  </Slide>

	  <!-- Row 1 -->
	  <Slide index={1}>
		<Slider direction="horizontal" bind:this={sliderX[1]}>
		  <Slide index={0}><Slide3/></Slide>
		  <Slide index={1}><Slide4 on:goto={handleGoto} /></Slide>
		  <Slide index={2}><Slide5 on:goto={handleGoto} /></Slide>
		  <Slide index={3}><Slide5_5 on:goto={handleGoto} /></Slide>
		  <Slide index={4}><Slide6 on:goto={handleGoto} /></Slide>
		  <Slide index={5}><Slide6_5 on:goto={handleGoto} /></Slide>
		  <Slide index={6}><Slide7 on:goto={handleGoto} /></Slide>
		  <Slide index={7}><Slide7_5 on:goto={handleGoto} /></Slide>
		  <Slide index={8}><Slide8 on:goto={handleGoto} /></Slide>
		  <Slide index={9}><Slide9/></Slide>
		</Slider>
	  </Slide>
	</Slider>
  </article>

  <!-- Keyboard UI: hidden on phone-width screens via CSS (swipe + physical
	   arrow keys take over there), always shown above that width. -->
  <div class="keyboard-ui">
  {#if y === 0}
	<Keyboard
	  directions={["up","down","left","right"]}
	  disable={disabledDirs}
	  enableKeyboard={!rotatePromptActive}
	  on:tap={onTap}
	/>
  {:else}
	<Keyboard2
	  directions={["up","down","left","right"]}
	  disable={disabledDirs}
	  enableKeyboard={!rotatePromptActive}
	  on:tap={onTap}
	/>
  {/if}
  </div>
  </div>
  </div>

  <style>
	@import url("https://fonts.googleapis.com/css2?family=Kumbh+Sans:wght@400;700&display=swap");

	article { height: 100%; }

	.deck {
	  width: 100vw;
	  height: 100vh;
	  height: 100dvh;
	  overflow: hidden;
	  display: flex;
	  align-items: center;
	  justify-content: center;
	}

	/* Fills .deck naturally (1:1, same as the original unscaled layout) until
	   JS confirms the viewport is actually shorter than STAGE_HEIGHT, at
	   which point inline width/height/transform (see `compact`) take over. */
	.stage {
	  position: relative;
	  width: 100%;
	  height: 100%;
	  flex-shrink: 0;
	  transform-origin: center center;
	}

	.rotate-prompt {
	  display: none;
	  height: 100vh;
	  height: 100dvh;
	  flex-direction: column;
	  align-items: center;
	  justify-content: center;
	  gap: 1.5rem;
	  padding: 2rem;
	  text-align: center;
	  background: #b9aee0;
	  font-family: "Kumbh Sans", sans-serif;
	}

	.rotate-icon {
	  width: 90px;
	  height: 90px;
	  transform: rotate(-20deg);
	  animation: tilt 1.6s ease-in-out infinite;
	}

	.rotate-icon :global(svg) {
	  width: 100%;
	  height: 100%;
	  display: block;
	}

	.rotate-prompt p {
	  font-size: 1.2rem;
	  font-weight: 400;
	  max-width: 20ch;
	  line-height: 1.5;
	  color: #4a3f78;
	}

	.highlight {
	  display: inline-block;
	  font-weight: 700;
	  color: #fff;
	  background: #4a3f78;
	  padding: 0.1em 0.5em;
	  border-radius: 0.3em;
	}

	@keyframes tilt {
	  0%, 100% { transform: rotate(-20deg); }
	  50%      { transform: rotate(0deg); }
	}

	/* Small screens (phones/small tablets) in portrait: show the rotate
	   prompt instead of the deck. Handled in pure CSS so the correct state
	   is painted immediately -- no dependency on JS/hydration timing. */
	@media (max-width: 899px) and (orientation: portrait) {
	  .rotate-prompt { display: flex; }
	  .deck { display: none; }
	}

	/* Phone-width screens (any orientation): the on-screen push buttons are
	   too small/cramped to be worth the space -- swipe and physical arrow
	   keys remain available instead. */
	@media (max-width: 899px) {
	  .keyboard-ui { display: none; }
	}
  </style>
  