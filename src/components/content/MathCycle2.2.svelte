<script>
  import { onMount, onDestroy, tick } from "svelte";
  import { browser } from "$app/environment";                 // SSR guard
  import { get } from "svelte/store";
  import Arrow from "../items/Arrow.svelte";
  import Annotations from "../items/Annotations.svelte";
  import CurlyBraceCoords from "../items/Brace.svelte";
  import { statuscard, cycle2array, annotations, positions, assembly2 } from "../../stores/misc.js";
  import Up from "../items/JustUpArrow.svelte";

  // ------- helpers -------
  const DisplaySuit = (suit) =>
    suit === "Hearts" ? "♥" :
    suit === "Diamonds" ? "♦" :
    suit === "Clubs" ? "♣" :
    suit === "Spades" ? "♠" : suit;

  const DisplayValue = (v) =>
    v === 11 ? "Jack" :
    v === 12 ? "Queen" :
    v === 13 ? "King" :
    v === 1  ? "Ace"  : v;

  // If your unique key is not `index`, change this to `card.currentIndex`
  const getId = (card) => card.index;

  // -------- overlay logic (braces & arrow) --------
  let board;            // stage element
  let containerEl;      // stack container
  let note;             // "The Selected card" label

  const elMap = new Map();   // id -> DOM element for each card
  let layoutVersion = 0;
  let selectedEl = null;

  let p1 = null, p2 = null, p3 = null; // brace coordinates
  const invalidate = () => { layoutVersion += 1; };

  // action to register each card node — batched with microtask
  function collect(node, card){
    let id = getId(card);
    elMap.set(id, node);
    if (card.selected) selectedEl = node;
    queueMicrotask(invalidate);

    return {
      update(newCard){
        const newId = getId(newCard);
        if (newId !== id) {
          elMap.delete(id);
          id = newId;
          elMap.set(id, node);
        }
        if (newCard.selected) selectedEl = node;
        else if (!newCard.selected && selectedEl === node) selectedEl = null;
        queueMicrotask(invalidate);
      },
      destroy(){
        elMap.delete(id);
        if (selectedEl === node) selectedEl = null;
        queueMicrotask(invalidate);
      }
    };
  }

  // If your piles are 0-based, switch the calls below to (0,1,2)
  function pileBounds(pileNo){
    if (!browser || !board) return null;
    const b = board.getBoundingClientRect();
    let y1 = Infinity, y2 = -Infinity;
    let xLeft = Infinity, xRight = -Infinity;
    let any = false;

    const arr = get(cycle2array); // snapshot store
    for (const card of arr) {
      if (card.cycle2pile !== pileNo) continue;
      const el = elMap.get(getId(card));
      if (!el) continue;
      const r = el.getBoundingClientRect();
      y1 = Math.min(y1, r.top - b.top);
      y2 = Math.max(y2, r.bottom - b.top);
      xLeft  = Math.min(xLeft,  r.left  - b.left);
      xRight = Math.max(xRight, r.right - b.left);
      any = true;
    }
    if (!any) return null;

    const GAP = 16;
    return { y1, y2, leftX: xLeft - GAP, rightX: xRight + GAP };
  }

  // recompute when layout/data change
  $: layoutVersion, p1 = pileBounds(1);  // change to 0 if using 0-based
  $: layoutVersion, p2 = pileBounds(2);  // change to 1 if using 0-based
  $: layoutVersion, p3 = pileBounds(3);  // change to 2 if using 0-based
  $: get(cycle2array), queueMicrotask(invalidate);
  $: if ($annotations) queueMicrotask(invalidate);

  // -------- positions overlay (labels only) --------
  const ord = n => {
    const s = ["th","st","nd","rd"], v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  let posMarks = [];  // [{x, y, text}]
  let posX = 0;

  function computePosMarks(){
    if (!browser || !board || !containerEl) return [];
    const b = board.getBoundingClientRect();
    const c = containerEl.getBoundingClientRect();
    const x = c.left - b.left - 28;     // column left of the stack
    posX = x;

    const marks = [];
    // one label per cycle2pos
    const arr = get(cycle2array);
    for (let p = 0; p < 27; p++) {
      const card = arr.find(d => d.cycle2pos === p);
      if (!card) continue;
      const el = elMap.get(getId(card));
      if (!el) continue;
      const r = el.getBoundingClientRect();
      const y = (r.top + r.bottom) / 2 - b.top; // card center
      marks.push({ x, y, text: ord(p + 1) });
    }
    return marks;
  }

  $: if ($positions) posMarks = computePosMarks();
  $: layoutVersion, $positions && (posMarks = computePosMarks());
  $: get(cycle2array), $positions && (posMarks = computePosMarks());

  // -------- explicit store reactivity for selection & matching --------
  $: c2 = $cycle2array;
  $: selected = (c2 ?? []).find(c => c?.selected) ?? null;
  $: selC1 = selected?.cycle1pile ?? null;
  $: selC2 = selected?.cycle2pile ?? null;

  function matchClass(card){
    const m1 = selC1 != null && card?.cycle1pile === selC1; // cycle 1 (I)
    const m2 = selC2 != null && card?.cycle2pile === selC2; // cycle 2 (II)
    if (m1 && m2) return "both";
    if (m2) return "two";
    if (m1) return "one";
    return "";
  }

  // -------- observers & mount timing (fonts-ready + ticks + RAF, SSR-guarded) --------
  let ro;
  function onWinResize() { invalidate(); }

  onMount(async () => {
    if (!browser) return;

    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => invalidate());
      [document.documentElement, board, containerEl].forEach(el => el && ro.observe(el));
    }
    window.addEventListener("resize", onWinResize);

    await tick();
    if (document.fonts?.ready) {
      try { await document.fonts.ready; } catch {}
    }
    await tick();
    requestAnimationFrame(() => invalidate());
  });

  onDestroy(() => {
    if (!browser) return;
    ro && ro.disconnect();
    window.removeEventListener("resize", onWinResize);
  });
</script>

<main class="body">
  {#if $statuscard && $assembly2}
    {#if $annotations}
      <div class="descPos">
        <div class="desc">
          For each cycle, we place the selected pile in the middle. The green “II” marks cards sharing the selected card’s Cycle-2 pile; blue “I” marks cards sharing its Cycle-1 pile. If a card matches both, you’ll see both bands.
        </div>
      </div>
    {/if}

    <div class="stage" bind:this={board}>
      <div class="container" bind:this={containerEl}>
        {#each $cycle2array as card (getId(card))}
          <div
            class="card {card.selected ? 'selected' : ''} {matchClass(card)}"
            use:collect={card}
            style="top: calc({card.cycle2pos} * 3.5%); margin-bottom: {card.cycle2pos === 8 || card.cycle2pos === 17 ? '10%' : '0'};"
          >
            {DisplayValue(card.value)} of {DisplaySuit(card.suit)}
          </div>
        {/each}
      </div>

      <!-- Positions overlay -->
      {#if $positions}
        <svg class="positions-layer" aria-hidden="true">
          {#each posMarks as m (m.text)}
            <text x={m.x} y={m.y} class="pos-label-svg">
              {m.text === '1st' ? `Card Position : ${m.text}` : m.text}
            </text>
          {/each}
        </svg>

        <div class="brace-layer" aria-hidden="true">
          {#if p1}
            {#key layoutVersion}
              <CurlyBraceCoords side="left"  x={p1.rightX}  y1={p1.y1} y2={p1.y2}
                                stroke="#b25555" strokeWidth={4} w={26} q={0.6} label="Pile 1"/>
            {/key}
          {/if}
          {#if p2}
            {#key layoutVersion}
              <CurlyBraceCoords side="left" x={p2.rightX} y1={p2.y1} y2={p2.y2}
                                stroke="#b25555" strokeWidth={4} w={26} q={0.6} label="Pile 2"/>
            {/key}
          {/if}
          {#if p3}
            {#key layoutVersion}
              <CurlyBraceCoords side="left" x={p3.rightX} y1={p3.y1} y2={p3.y2}
                                stroke="#b25555" strokeWidth={4} w={26} q={0.6} label="Pile 3"/>
            {/key}
          {/if}
        </div>
      {/if}

      <!-- Braces + arrow (annotation mode) -->
      {#if $annotations}
        <div class="note" bind:this={note}>The Selected card</div>

        <div class="brace-layer" aria-hidden="true">
          {#if p1}
            {#key layoutVersion}
              <CurlyBraceCoords side="right"  x={p1.leftX}  y1={p1.y1} y2={p1.y2}
                                stroke="#b25555" strokeWidth={4} w={26} q={0.6} label="Pile 1"/>
            {/key}
          {/if}
          {#if p2}
            {#key layoutVersion}
              <CurlyBraceCoords side="left" x={p2.rightX} y1={p2.y1} y2={p2.y2}
                                stroke="#b25555" strokeWidth={4} w={26} q={0.6} label="Pile 2"/>
            {/key}
          {/if}
          {#if p3}
            {#key layoutVersion}
              <CurlyBraceCoords side="right" x={p3.leftX} y1={p3.y1} y2={p3.y2}
                                stroke="#b25555" strokeWidth={4} w={26} q={0.6} label="Pile 3"/>
            {/key}
          {/if}
        </div>

        {#if selectedEl && note}
          <Arrow
            mode="viewport"
            container={board}
            fromEl={note}
            toEl={selectedEl}
            fromAnchor="left"
            toAnchor="left"
            headAt="end"
            curvature={0.22}
            bulge={0.16}
            bulgeDir="auto"
            width={4}
            color="#5a80c0"
          />
        {/if}
      {/if}
    </div>

    {#if $positions}
      <div class="descPos1">
        <p>
          After completing this cycle, we can be confident that the selected card
          is within a range of 9 cards (the entire pile 2).
        </p>
      </div>
    {/if}

    {#if $annotations}
      <div class="note-cycle">
        we will highlight<br/>
        the middle pile in<br/>
        blue (I) to track<br/>
        Cycle-1 and in<br/>
        green (II) for<br/>
        Cycle-2.
      </div>
    {/if}

    <Annotations/>
    <div class="footer"><p>Assembly II</p></div>
  {:else}
    <div class="else">
      <p>
        Click the <b>Top Arrow or press</b>
        <Up/>
        <b>to jump</b> to the <b>Cycle 2</b> step,<br />
        then start drawing to see what’s really happening here!
      </p>
    </div>
  {/if}
</main>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Kumbh+Sans:wght@400;700&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Nanum+Pen+Script&display=swap');

  .body:has(.else) { justify-content: center; text-align: center; }

  .else{
    font-size: 2rem;
    font-family: 'Kumbh Sans', sans-serif;
    color: #A34C48;
  }

  .body{
    height:100vh; background:#FDD4D4;
    display:flex; flex-direction:column; align-items:center; justify-content:space-between;
    font-family:'Kumbh Sans',sans-serif; color:#A34C48;
  }

  .stage{ position:relative; width:min(780px, 92vw); height:90vh; margin:2rem auto; }

  .container{
    position:relative; width:280px; height:100%; margin:0 auto;
    display:flex; flex-direction:column-reverse; gap:10px; align-items:center;
  }

  .card{
    position:absolute; width:100%; height:23px;
    background-color:#F09D99; /* base color; bands via background-image in variants */
    display:flex; align-items:center; justify-content:center;
    font-size:0.8rem; font-weight:700; color:#fff; transition: transform 0.2s ease;
    border-radius:6px;
    isolation:isolate; /* make ::before/::after layering stable */
  }

  /* Selected card text tint; bands handled by one/two/both */
  .card.selected{ color:#A34C48; }

  /* ====== Cycle matching bands ====== */
  /* I (cycle 1) match → blue 90–100% + "I" */
  .card.one:not(.both){
    background-image: linear-gradient(to right, transparent 0 90%, #558ABB 90% 100%);
  }
  .card.one:not(.both)::after{
    content:"I";
    position:absolute; right:0; top:0;
    width:10%; height:100%;
    display:flex; align-items:center; justify-content:center;
    color:#fff; font-weight:900;
    pointer-events:none;
  }

  /* II (cycle 2) match → green 90–100% + "II" */
  .card.two:not(.both){
    background-image: linear-gradient(to right, transparent 0 90%, #55993D 90% 100%);
  }
  .card.two:not(.both)::after{
    content:"II";
    position:absolute; right:0; top:0;
    width:10%; height:100%;
    display:flex; align-items:center; justify-content:center;
    color:#fff; font-weight:900;
    pointer-events:none;
  }

  /* BOTH matches → green 80–90% (II) + blue 90–100% (I) */
  .card.both{
    background-image: linear-gradient(to right, transparent 0 80%, #55993D 80% 90%, #558ABB 90% 100%);
  }
  .card.both::before{
    content:"II";
    position:absolute; top:0; right:10%;
    width:10%; height:100%;
    display:flex; align-items:center; justify-content:center;
    color:#fff; font-weight:900;
    pointer-events:none;
  }
  .card.both::after{
    content:"I";
    position:absolute; top:0; right:0;
    width:10%; height:100%;
    display:flex; align-items:center; justify-content:center;
    color:#fff; font-weight:900;
    pointer-events:none;
  }

  /* ---- overlay layers ---- */
  .brace-layer{
    position:absolute;
    inset:0;
    pointer-events:none;
    z-index:1100; /* above cards & positions text */
  }

  .positions-layer{
    position:absolute; inset:0; width:100%; height:100%;
    pointer-events:none; overflow:visible; z-index:1000;
  }
  .pos-label-svg{
    font-family:"Nanum Pen Script", cursive;
    font-size:2rem;
    fill:#558ABB;
    dominant-baseline:middle;
    text-anchor:end;
  }

  .note{
    /* position:absolute; */
    left: calc(100% + 40px);
    top:50%;
    transform:translateY(-40%);
    color:#5a80c0;
    font-weight:900;
    font-size:2rem;
    font-family: "Nanum Pen Script", cursive;
  }

  .descPos1{
    font-family: "Nanum Pen Script", cursive;
    font-size:2rem;
    line-height: 1rem;
    max-width: 12rem;
    text-align: center;
    color:#548ABB;
    position: absolute;
    left: clamp(12px, 6vw, 120px);
    top: 48%;
    transform: translateY(-40%);
  }

  .note-cycle{
    font-family: "Nanum Pen Script", cursive;
    font-size:2rem;
    line-height: 1rem;
    max-width: 12rem;
    text-align: center;
    color:#548ABB;
    position: absolute;
    right: clamp(50px, 20vw, 80px);
    top: 48%;
    transform: translateY(-40%);
  }

  .desc{ background:#874c47; color:#FDD4D4; font-size:1.1rem;
         padding:1rem; max-width:18rem; margin:1rem auto; text-align:center; }
  .descPos{ position:absolute; top:0; left:0; margin-top:3rem; margin-left:3rem; }

  .footer{ position:absolute; right:0; bottom:0; margin:4rem; color:#4973B0; font-weight:bold; font-size:1.5rem; }
</style>
