<script>
    import FlipPhotoButton from "../items/FlipButton.svelte";
    import BackMagic from "../../../src/svg/backend-03.png"
    import FrontMagic from "../../../src/svg/frontend.png"
    import BackMath from "../../../src/svg/backend-04.png"
    import FrontMath from "../../../src/svg/frontend2.png"
    import { triggerReset } from "../../stores/misc.js";

    import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  function startWith(choice) {
  
    // Magic => vertical 0, horizontal 1  (Slide1)
    // Math  => vertical 1, horizontal 0  (Slide3)
    if (choice === "Math") dispatch("goto", { y: 0, x: 0 });
    else                    dispatch("goto", { y: 1, x: 0 })
    triggerReset();;
  }


  </script>


<section class='end'>
    <div class="text">
        <h1>
           <span class='title'>That's the trick!</span> 
        </h1>
        <p>Now, do you think you figured it out ?</p>
        <p> <span class='yes'>Yes</span> or <span class='no'>No</span> ?</p>
    </div>
 

    <div class="wrap">

        <FlipPhotoButton
        frontSrc= {BackMath}
        backSrc= {FrontMath}
        alt="Magic option"
        label="Choose Math"
        width={200}
        on:select={() => startWith('Magic')}
      />


        <FlipPhotoButton
          frontSrc= {BackMagic}
          backSrc= {FrontMagic}
          alt="Math option"
          label="Choose Magic"
          width={200}
          on:select={() => startWith("Math")}
        />
      
      
      </div>
    </section>
  
  
  <style>

.end {
    min-height: 100%;
    background-color: #BEAFF7; 
    padding-top: 2em;
  }

@import url('https://fonts.googleapis.com/css2?family=Kumbh+Sans:wght@400;700&display=swap'); 

    .text{
        text-align: center;
        margin-top: 5%;

    }

   .title {
        font-family: 'Kumbh Sans', sans-serif;
        background-color: #5B4D88;
        color: #E5DEFE;
        padding-left: 5%;
        padding-right: 5%;
    }


    .no{
        background-color: #5B4D88;
        color: #E5DEFE;
        padding-left: 1%;
        padding-right: 1%;
    }


    .yes{
        background-color: #D47D79;
        color: #FCD4D4;
        padding-left: 1%;
        padding-right: 1%;
    }

    p {
        font-family: 'Kumbh Sans', sans-serif;
        color: #5B4D88;;
        font-size: 1.4rem;
    }
    .wrap {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 24px;
      justify-items: center;
      align-items: center;
    }
  
    @media (max-width: 520px) {
      .wrap { grid-template-columns: 1fr; }
    }


</style>