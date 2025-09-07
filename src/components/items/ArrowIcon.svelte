<script>
    export let dir = 'left'; // 'up' | 'down' | 'left' | 'right'
    export let size = 28;
  
    // base SVG points LEFT; rotate clockwise for UP, 180 for RIGHT, counterclockwise for DOWN
    $: deg = ({ left: 0, up: 90, right: 180, down: -90 })[dir] ?? 0;
  </script>
  
  <svg
    width={size}
    height={size}
    viewBox="0 0 122.88 108.06"
    style="transform: rotate({deg}deg); transform-origin:50% 50%; transform-box:fill-box;"
    aria-hidden="true"
  >
    <path
      d="M63.94,24.28a14.28,14.28,0,0,0-20.36-20L4.1,44.42a14.27,14.27,0,0,0,0,20l38.69,39.35a14.27,14.27,0,0,0,20.35-20L48.06,68.41l60.66-.29a14.27,14.27,0,1,0-.23-28.54l-59.85.28,15.3-15.58Z"
      fill="currentColor"
    />
  </svg>
  