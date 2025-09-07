<script>
    export let x;           // brace x (relative to container)
    export let y1;          // top
    export let y2;          // bottom
    export let side = "right";
  
    export let stroke = "#b25555";
    export let strokeWidth = 4;
    export let w = 26;      // curl width
    export let q = 0.6;     // expressiveness
  
    export let label = "";
    export let labelSize = 24;
    export let fontFamily = 'Kumbh Sans';
    export let labelOffset = { x: -100, y: 5 };
    export let waistRatio = 0.47;
    export let weight = 900;
  
    let d = ""; let labelPos = { x:10, y:0 };
  
    function makeCurlyBrace(x1,y1,x2,y2,w,q){
      let dx=x1-x2, dy=y1-y2, len=Math.hypot(dx,dy); dx/=len; dy/=len;
      const qx1=x1+q*w*dy, qy1=y1-q*w*dx;
      const qx2=(x1-.25*len*dx)+(1-q)*w*dy, qy2=(y1-.25*len*dy)-(1-q)*w*dx;
      const tx1=(x1-.5*len*dx)+w*dy,       ty1=(y1-.5*len*dy)-w*dx;
      const qx3=x2+q*w*dy, qy3=y2-q*w*dx;
      const qx4=(x1-.75*len*dx)+(1-q)*w*dy, qy4=(y1-.75*len*dy)-(1-q)*w*dx;
      return `M ${x1} ${y1} Q ${qx1} ${qy1} ${qx2} ${qy2} T ${tx1} ${ty1}
              M ${x2} ${y2} Q ${qx3} ${qy3} ${qx4} ${qy4} T ${tx1} ${ty1}`;
    }
  
    $:{
      const top=Math.min(y1,y2), bot=Math.max(y1,y2);
      const sign = side==="right" ? 1 : -1;
      d = makeCurlyBrace(x, top, x, bot, sign*w, q);
      const tip = top + waistRatio*(bot-top);
      labelPos = { x: side==="right" ? x+labelOffset.x : x-labelOffset.x, y: tip+labelOffset.y };
    }
  </script>
  
  <svg class="layer" aria-hidden="true">
    <path d={d} fill="none" stroke={stroke} stroke-width={strokeWidth}
          stroke-linecap="round" stroke-linejoin="round"/>
    {#if label}
      <text x={labelPos.x} y={labelPos.y}
            text-anchor={side === "right" ? "start" : "end"}
            dominant-baseline="middle"
            font-family={fontFamily} font-size={labelSize} font-weight={weight} fill={stroke}>{label}</text>
    {/if}
  </svg>
  
  <style>
    .layer{
        position:absolute;
        inset:0;
        width:100%;
        height:100%;
        pointer-events:none;
        overflow:visible;
        z-index: 1000;}
  </style>
  