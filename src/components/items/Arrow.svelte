<script>
    import { onMount, onDestroy } from "svelte";
  
    export let container;   // positioned ancestor (board)
    export let fromEl;      // HTMLElement start
    export let toEl;        // HTMLElement end
  
    export let fromAnchor = "right";   // "left" | "right" | "top" | "bottom" | "center"
    export let toAnchor   = "left";
    export let width      = 4;
    export let color      = "#5a80c0";
    export let headAt     = "end";     // "start" | "end" | "both" | "none"
    export let curvature  = 0.22;      // along-tangent pull
    export let bulge      = 0.16;      // normal offset
    export let bulgeDir   = "up";      // "up" | "down" | "auto"
  
    let d = "";
    let ro, mounted = false;
  
    const anchorPoint = (el) => {
      const c = container.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      return {
        left:{x:r.left-c.left, y:r.top+r.height/2-c.top},
        right:{x:r.right-c.left, y:r.top+r.height/2-c.top},
        top:{x:r.left+r.width/2-c.left, y:r.top-c.top},
        bottom:{x:r.left+r.width/2-c.left, y:r.bottom-c.top},
        center:{x:r.left+r.width/2-c.left, y:r.top+r.height/2-c.top}
      };
    };
    const tangent=(a,p1,p2)=>({left:{x:-1,y:0},right:{x:1,y:0},top:{x:0,y:-1},bottom:{x:0,y:1}}[a])||
      (()=>{const dx=p2.x-p1.x,dy=p2.y-p1.y,len=Math.hypot(dx,dy)||1;return {x:dx/len,y:dy/len};})();
  
    function update(){
      if(!container||!fromEl||!toEl) return;
      const P1=anchorPoint(fromEl)[fromAnchor]||anchorPoint(fromEl).center;
      const P2=anchorPoint(toEl)[toAnchor]||anchorPoint(toEl).center;
      const dx=P2.x-P1.x, dy=P2.y-P1.y, dist=Math.hypot(dx,dy)||1;
      const k=curvature*dist, t1=tangent(fromAnchor,P1,P2), t2=tangent(toAnchor,P2,P1);
      let nx=-dy/dist, ny=dx/dist;
      const sign=(bulgeDir==="up"?-1:bulgeDir==="down"?1:(dx>=0?-1:1));
      const b=bulge*dist*sign;
      const C1={x:P1.x+t1.x*k+nx*b, y:P1.y+t1.y*k+ny*b};
      const C2={x:P2.x+t2.x*k+nx*b, y:P2.y+t2.y*k+ny*b};
      d=`M ${P1.x} ${P1.y} C ${C1.x} ${C1.y}, ${C2.x} ${C2.y}, ${P2.x} ${P2.y}`;
    }
  
    let ticking=false;
    const onChange=()=>{ if(ticking) return; ticking=true; requestAnimationFrame(()=>{ticking=false; update();}); };
    function wire(){
      ro=new ResizeObserver(onChange);
      [container,fromEl,toEl,document.documentElement].forEach(el=>el&&ro.observe(el));
      window.addEventListener("resize",onChange);
      window.addEventListener("scroll",onChange,{passive:true});
      container&&container.addEventListener("scroll",onChange,{passive:true});
    }
    function unwire(){
      ro&&ro.disconnect(); window.removeEventListener("resize",onChange);
      window.removeEventListener("scroll",onChange);
      container&&container.removeEventListener("scroll",onChange);
    }
    onMount(()=>{ mounted=true; wire(); update(); });
    onDestroy(unwire);
    $: if(mounted) update();
  
    $: markerStart=(headAt==="start"||headAt==="both")?"url(#openV)":undefined;
    $: markerEnd  =(headAt==="end"  ||headAt==="both")?"url(#openV)":undefined;
  </script>
  
  <svg class="layer" aria-hidden="true">
    <defs>
      <marker id="openV" viewBox="0 0 12 12" refX="10" refY="6"
              markerUnits="strokeWidth" markerWidth="6" markerHeight="6"
              orient="auto-start-reverse">
        <path d="M0 0 L10 6 L0 12" fill="none" stroke={color} stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round"/>
      </marker>
    </defs>
    <path d={d} fill="none" stroke={color} stroke-width={width}
          stroke-linecap="round" stroke-linejoin="round"
          marker-start={markerStart} marker-end={markerEnd}/>
  </svg>
  
  <style>
    .layer{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;overflow:visible}
  </style>
  