<script>
    import { annotations, positions } from "../../stores/misc";
    import Arrow from './Arrow.svelte'
  
    let isAnnotations = true; 
       let note;
       let selectedEl = null;

    let board;   
  
    function toggle() {
      isAnnotations = !isAnnotations;
      annotations.set(isAnnotations);
      positions.set(!isAnnotations);
    }
  
  </script>
  
  <div bind:this={board}>
    <div class='cont' bind:this={selectedEl}>
        <button on:click={toggle} >
      {isAnnotations ? "Show Positions" : "Show Annotations"}
    </button>
    <div class="note" bind:this={note}>Click me!</div>
    </div>
  </div>

  
  <!-- <Arrow mode="viewport" 
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
       color="#5a80c0" /> -->

  
  <style>
       @import url('https://fonts.googleapis.com/css2?family=Kumbh+Sans:wght@400;700&display=swap');
       @import url('https://fonts.googleapis.com/css2?family=Nanum+Pen+Script&display=swap');
  
  .cont{
      position:absolute;
      top:0; 
      right:0;
      margin-top:2%;
      margin-right:4%;
      z-index:1000; }
  
  button {
      font-family: 'Kumbh Sans';
      font-size: 1.3rem;
      background-color:#F09D99;
      color: #874C47;
      border: none;
      padding: 0.4rem
  
  }


  .note{
    font-family: 'Nanum Pen Script';
    color: #558ABB;
    font-size: 2em;
    text-align: center;
  }
      
  </style>
  