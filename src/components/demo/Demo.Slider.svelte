<script>
	import { tick } from "svelte";
	import Slider from "$components/helpers/Slider.svelte";
	import Slide  from "$components/helpers/Slider.Slide.svelte";
  
	import Keyboard  from "../items/KeyboardDown.svelte";
	import Keyboard2 from "../items/KeyboardUp.svelte";
  
	import Slide0   from "../content/Welcome.svelte";
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
	const ROW_LEN = [7, 10]; // row0: 6 (0..5), row1: 10 (0..9)
  
	// --- Forbidden cell (keyboard cannot land here) ---
	const FORBIDDEN = { y: 0, x: 0 };
	const isForbidden = (ry, rx) => (ry === FORBIDDEN.y && rx === FORBIDDEN.x);
  
	// --- Timing & guard ---
	const STEP_MS = 280;
	const sleep = (ms) => new Promise(r => setTimeout(r, ms));
	let busy = false;
	async function run(task) {
	  if (busy) return;
	  busy = true;
	  try { await task(); } finally { busy = false; }
	}
  
	// --- Slider step helpers ---
	async function nextH(row) { sliderX[row]?.next?.(); await sleep(STEP_MS); }
	async function prevH(row) { sliderX[row]?.prev?.(); await sleep(STEP_MS); }
	async function nextV()    { sliderY?.next?.();      await sleep(STEP_MS); }
	async function prevV()    { sliderY?.prev?.();      await sleep(STEP_MS); }
  
	// --- Move horizontal to an exact index (sanitized) ---
	async function moveHTo(row, target) {
	  // never allow landing on v0-h0 from keyboard/programmatic moves
	  if (row === 0 && target === 0) target = 1;
  
	  const max = ROW_LEN[row] - 1;
	  target = Math.max(0, Math.min(max, target));
  
	  let delta = target - x[row];
	  while (delta > 0) { await nextH(row); delta--; }
	  while (delta < 0) { await prevH(row); delta++; }
	  x[row] = target;
	}
  
	// --- Change vertical row (0 <-> 1) ---
	async function setVertical(targetY) {
	  if (targetY === y) return;
	  if (targetY > y) { await nextV(); } else { await prevV(); }
	  y = targetY;
	  await tick(); // ensure the new row's slider is mounted
	}
  
	// --- Routing rules between rows ---
	// Down from row 0 -> row 1
	const downMapFromY0 = { 0: null, 1: 0, 2: 2, 3: 4, 4: 6, 5: 8, 6:9 }; // h0 is blocked
	// Up from row 1 -> row 0 (bucketed)
	function upMapFromY1(h) {
	  if (h <= 1) return 1;      // 0/1 -> 1
	  if (h <= 3) return 2;      // 2/3 -> 2
	  if (h <= 5) return 3; 
	  if (h <= 7) return 4;
	  if (h <= 8) return 5;       // 4/5/6/7 -> 4
	  return 6;                  // 8/9 -> 5
	}
  
	// --- Wrap-around inside a row (skip v0-h0) ---
	function wrapRight(row) {
	  const max = ROW_LEN[row] - 1;
	  let next = (x[row] === max) ? 0 : x[row] + 1;
	  if (row === 0 && next === 0) next = 1; // skip forbidden
	  return next;
	}
	function wrapLeft(row) {
	  const max = ROW_LEN[row] - 1;
	  let next = (x[row] === 0) ? max : x[row] - 1;
	  if (row === 0 && next === 0) next = max; // skip forbidden
	  return next;
	}
  
	// --- Unified keyboard/tap handler ---
	const onTap = ({ detail }) => run(async () => {
	  // Safety: if we're visually at v0-h0, keys do nothing
	  if (y === 0 && x[0] === 0) return;
  
	  if (detail === "right") { await moveHTo(y, wrapRight(y)); return; }
	  if (detail === "left")  { await moveHTo(y, wrapLeft(y));  return; }
  
	  if (detail === "down") {
		if (y !== 0) return; // already bottom row
		const targetX = downMapFromY0[x[0]];
		if (targetX == null) return; // from v0-h0 down is blocked
		await setVertical(1);
		await moveHTo(1, targetX);
		return;
	  }
  
	  if (detail === "up") {
		if (y !== 1) return; // already top row
		const targetX = upMapFromY1(x[1]);
		await setVertical(0);
		await moveHTo(0, targetX);
		return;
	  }
	});
  
	// --- Programmatic goto (slides may emit this) ---
	function handleGoto(e) {
	  const { y: targetY, x: targetX } = e.detail || {};
	  // If a slide requests v0-h0, ignore (keeps "keyboard-unreachable" invariant)
	  if (isForbidden(targetY, targetX)) return;
	  run(async () => {
		if (targetY !== y) await setVertical(targetY);
		await moveHTo(targetY, targetX);
	  });
	}
  
	// --- Reactive UI guards for keyboard widgets ---
	$: atTopLeft = (y === 0 && x[0] === 0);
  
	// Which directions are visually disabled?
	$: disabledDirs = atTopLeft
	  ? ["up", "down", "left", "right"]   // nothing works at v0-h0
	  : (y === 0 ? ["up"] : ["down"]);    // block off-grid vertical moves
  
	// Hardware keyboard on/off
	$: keyboardEnabled = !atTopLeft;
  </script>
  
  <article>
	<Slider direction="vertical" bind:this={sliderY}>
	  <!-- Row 0 -->
	  <Slide index={0}>
		<Slider direction="horizontal" bind:this={sliderX[0]}>
		  <Slide index={0}>
			<Slide0 on:goto={handleGoto} />
		  </Slide>
		  <Slide index={1}><Slide1/></Slide>
		  <Slide index={2}><Slide2/></Slide>
		  <Slide index={3}><Slide2_2/></Slide>
		  <Slide index={4}><Slide2_3/></Slide>
		  <Slide index={5}><Slide2_4/></Slide>
		  <Slide index={6}><Slide10 on:goto={handleGoto} /></Slide>
		</Slider>
	  </Slide>
  
	  <!-- Row 1 -->
	  <Slide index={1}>
		<Slider direction="horizontal" bind:this={sliderX[1]}>
		  <Slide index={0}><Slide3/></Slide>
		  <Slide index={1}><Slide4/></Slide>
		  <Slide index={2}><Slide5/></Slide>
		  <Slide index={3}><Slide5_5/></Slide>
		  <Slide index={4}><Slide6/></Slide>
		  <Slide index={5}><Slide6_5/></Slide>
		  <Slide index={6}><Slide7/></Slide>
		  <Slide index={7}><Slide7_5/></Slide>
		  <Slide index={8}><Slide8/></Slide>
		  <Slide index={9}><Slide9/></Slide>
		</Slider>
	  </Slide>
	</Slider>
  </article>
  
  <!-- Keyboard UI -->
  {#if !atTopLeft}
	{#if y === 0}
	  <Keyboard
		directions={["up","down","left","right"]}
		disable={disabledDirs}
		enableKeyboard={keyboardEnabled}
		on:tap={onTap}
	  />
	{:else}
	  <Keyboard2
		directions={["up","down","left","right"]}
		disable={disabledDirs}
		enableKeyboard={keyboardEnabled}
		on:tap={onTap}
	  />
	{/if}
  {/if}
  
  <style>
	article { height: 100vh; }
  </style>
  