  <script>
    import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  function startWith(choice) {
    // Magic => vertical 0, horizontal 1  (Slide1)
    // Math  => vertical 1, horizontal 0  (Slide3)
    if (choice === "Magic") dispatch("goto", { y: 0, x: 1 });
    else if (choice === "Math") dispatch("goto", { y: 1, x: 0 });
    else                    dispatch("goto", { y: 0, x: 0 });
  }


  import { onMount } from 'svelte';
  
  onMount(() => {
    document.fonts.ready.then(() => {
      document.documentElement.classList.add('fonts-ready');
    });
  });

  </script>
  
  <main>
    <h1 style="font-family: 'Kumbh Sans', sans-serif;">Math is Magic!</h1>
    <p class='title' style="font-family: 'Kumbh Sans', sans-serif;">I want to present you with a card trick that uses math as the mastermind.</p>
    <p style="font-family: 'Kumbh Sans', sans-serif;">But you get to choose,<br/>Start with the</p>
    <div class="buttons">
      <button class="magic" on:click={() => startWith('Magic')}>Magic</button>
      <span>Or</span>
      <button class="math"  on:click={() => startWith('Math')}>Math</button>
    </div>
  </main>
  

  <style>

    @import url('https://fonts.googleapis.com/css2?family=Kumbh+Sans:wght@400;700&display=swap');

    html:not(.fonts-ready) main { visibility: hidden; }

    main {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      background-color: #DAFDBA;
      text-align: center;
      padding: 1rem;
    }
  
    h1 {
      padding: 1rem;
      padding-right: 3rem;
      padding-left: 3rem;
      font-size: 5rem;
      color: #DAFDBA;
      margin-bottom: 1rem;
      font-weight: bold;
      background-color: #45C4B0;
    }

    .title {
        font-weight: 500;
        font-size: 2rem ;
    }
  
    p {
      font-size: 1.25rem;
      margin-bottom: 2rem;
      color: #13678A;
      font-weight: 300;
      max-width: 30%;
    }
  
    .buttons {
      display: flex;
      gap: 1rem;
    }

    span {
        margin-top: 5%;
      font-size: 1.5rem;
      color: #13678A;
      font-weight: 500;
    }


    button {
      font-size: 2rem;
      padding: 0.7rem 2rem;
      border: 4px solid;
      cursor: pointer;
      font-weight: bold;
      font-weight: 900;
    }
  
    .magic {
      color: #3d348b;
      border-color: #3d348b;
      background-color: #f3f1ff;
    }
  
    .math {
      color: #a63232;
      border-color: #a63232;
      background-color: #ffeaea;
    }
  
    button:hover {
      opacity: 0.9;
      transform: scale(1.05);
    }
  </style>