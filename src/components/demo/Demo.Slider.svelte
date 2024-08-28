<script>
	import Slider from "$components/helpers/Slider.svelte";
	import Slide from "$components/helpers/Slider.Slide.svelte";
	import Tap from "$components/helpers/Tap.svelte";
	import Slide1 from "../content/Slide1.svelte";
	import Slide2 from "../content/Slide2.svelte";
	import Slide2_2 from "../content/Slide2_2.svelte";
	import Slide2_3 from "../content/Slide2_3.svelte";
	import Slide3 from "../content/Slide3.svelte";
	import Slide4 from "../content/Slide4.svelte";

	let sliderX = [];
	let sliderY;

	const onTap = ({ detail }) => {
		if (detail === "left") {
			sliderX[0].prev();
			sliderX[1].prev();
		} else if (detail === "right") {
			sliderX[0].next();
			sliderX[1].next();
		} else if (detail === "up") {
			sliderY.prev();
		} else if (detail === "down") {
			sliderY.next();
		}
	};
</script>

<article>
	<Slider direction="vertical" bind:this={sliderY}>
		<Slide index={0}>
			<Slider direction="horizontal" bind:this={sliderX[0]}>
				<Slide index={0}>
					<Slide1/>
				</Slide>
				<Slide index={1}>
					<Slide2/>
				</Slide>
				<Slide index={2}>
					<Slide2_2/>
				</Slide>
				<Slide index={3}>
					<Slide2_3/>
				</Slide>
			</Slider>
		</Slide>

		<Slide index={1}>
			<Slider direction="horizontal" bind:this={sliderX[1]}>
				<Slide index={0}>
					<Slide3/>
				</Slide>
				<Slide index={1}>
					<Slide4/>
				</Slide>
			</Slider>
		</Slide>
</Slider>
</article>

<Tap 
	directions={["up", "down", "left", "right"]}
	on:tap={onTap} debug={true} 
/>

<style>
	article {
		height: 100vh;
	}
</style>
