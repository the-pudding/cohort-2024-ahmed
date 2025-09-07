<script>
    	import SliderDemo from '$components/demo/Demo.Slider.svelte'

        // let show= false;

        // function toggle() {
        //      show = !show;
        // }
</script>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Kumbh+Sans:wght@300;400;700&display=swap');

  body {
    font-family: 'Kumbh Sans', sans-serif;
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #dfffd6;
  }

  .container {
    text-align: center;
    color: #0b3d91;
  }

  .title {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
  }

  .subtitle {
    font-size: 1.25rem;
    font-weight: 300;
    margin-bottom: 2rem;
  }

  .buttons {
    display: flex;
    justify-content: center;
    gap: 2rem;
  }

  .button {
    font-size: 1.25rem;
    font-weight: 400;
    padding: 0.75rem 1.5rem;
    border: 3px solid;
    border-radius: 8px;
    cursor: pointer;
    text-transform: uppercase;
    transition: all 0.2s ease-in-out;
  }

  .button.magic {
    border-color: #3b3dff;
    color: #3b3dff;
  }

  .button.magic:hover {
    background-color: #3b3dff;
    color: white;
  }

  .button.math {
    border-color: #a83c3c;
    color: #a83c3c;
  }

  .button.math:hover {
    background-color: #a83c3c;
    color: white;
  }
</style>

<!-- <div class="container">
  <div class="title">Math is Magic!</div>
  <div class="subtitle">
    I want to present you with a card trick that uses math as the mastermind.
    <br />
    But you get to choose, Start with the
  </div>
  <div class="buttons">
    <button class="button magic" on:click={toggle}>Magic</button>
    <button class="button math" on:click={toggle}>Math</button>
  </div>

  {#if show} -->
  <SliderDemo/>
  <!-- {/if}
</div> -->

