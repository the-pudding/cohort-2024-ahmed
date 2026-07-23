<script>
    export let titleBg = "#A85C52"; // title badge color
  </script>


  <body>
 <main class="slide" style="--titleBg:{titleBg}">
    <div class="title">Variations</div>
  
    <p class="lead">
      This self-working card trick can be done using 15, 21, 33 cards—or any other number of cards—
      as long as it follows these rules:
    </p>
  
    <div class="defs">
      <p>With Number of Cards: <b>N</b></p>
      <p>Number of Piles: <b>P</b></p>
      <p>Number of Iterations: <b>I</b></p>
    </div>
  
    <ol class="rules">
      <li><b>N</b> must be divisible by <b>P</b>.</li>
      <li>
        To generalize the position <b>S</b> of the selected card after <b>I</b> iterations:
      </li>
    </ol>
  
    <div class="formula">
      S = (N / P)<sup>I − 1</sup> mod (P + ½)
    </div>
  </main>
  </body>
 
  
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Kumbh+Sans:wght@400;700&display=swap');
  
    .slide {
      background: var(--bg);
      color: #6b3c38;
      font-family: "Kumbh Sans", system-ui, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 6rem 1.5rem 3rem;
    }
  
    .title {
      background: var(--titleBg);
      color: #fff;
      font-weight: 700;
      font-size: clamp(1.3rem, 2.2vw, 1.8rem);
      padding: .7rem 1.6rem;
      border-radius: .4rem;
      margin-bottom: 2.5rem;
    }
  
    .lead {
      max-width: 900px;
      line-height: 1.6;
      font-size: clamp(1rem, 1.4vw, 1.15rem);
      margin: 0 auto 2.2rem;
    }
  
    .defs {
      line-height: 1.9;
      font-size: clamp(1rem, 1.3vw, 1.15rem);
      margin: 1.8rem 0 1rem;
    }
  
    .rules {
      list-style: decimal;
      text-align: left;
      max-width: 640px;
      margin: 0 auto .6rem;
      padding-left: 1.3rem;
      font-size: clamp(1rem, 1.3vw, 1.12rem);
    }
    .rules li { margin: .45rem 0; }
  
    .formula {
      font-weight: 700;
      font-size: clamp(1.05rem, 1.6vw, 1.3rem);
      margin-top: .4rem;
    }
    body{
            height: 100%;
            margin-top: 0;
            background-color: #FDD4D4;
        }
  
    @media (max-width: 600px) {
      .slide { padding: 4rem 1rem 2rem; }
      .rules { padding-left: 1rem; }
    }
  </style>
  