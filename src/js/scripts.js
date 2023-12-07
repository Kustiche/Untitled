const sliderEl = document.querySelector(".form__range");
const form = document.querySelector(".form");
const output = document.querySelector(".form__output");
const variants = document.querySelectorAll(".form__radio");
const sum = document.querySelector(".form__sum-descr");
const innerRange = document.querySelector(".form__inner-range");
const priceOptions = [
	{ name: "Ламинат", price: 250 },
	{ name: "Паркет", price: 350 },
	{ name: "Линолеум", price: 150 },
	{ name: "Наливной пол", price: 300 },
];
let variant = JSON.parse(localStorage.getItem("variant")) ?? "Ламинат";
let tempSliderValue = JSON.parse(localStorage.getItem("tempSliderValue")) ?? 0;
let progress = 0;

function substitution() {
	sliderEl.value = tempSliderValue;
	output.value = tempSliderValue;
	sliderEl.style.background =
		JSON.parse(localStorage.getItem("rangeBackground")) ??
		`linear-gradient(to right, #5A483F 0%, #fff 0%)`;
	sum.textContent = JSON.parse(localStorage.getItem("sum")) ?? 0;
}

function priceCalculation(e) {
	const isRange = e.target.className === "form__range";
	const isOutout = e.target.className === "form__output";
	const isPlus = e.target.className === "form__button btn-reset";
	const isMinus =
		e.target.className === "form__button form__button--minus btn-reset";
	const floorType = priceOptions.find((item) => item.name === variant);

	if (isRange) {
		tempSliderValue = e.target.value;
		output.value = tempSliderValue;
	} else if (isOutout && e.target.value <= 400 && e.target.value >= 0) {
		tempSliderValue = e.target.value;
		sliderEl.value = tempSliderValue;
	} else if (
		(isOutout && isNaN(Number(output.value))) ||
		output.value > 400 ||
		output.value < 0 ||
		output.value === ""
	) {
		output.value = tempSliderValue;
		tempSliderValue = tempSliderValue;
		sliderEl.value = tempSliderValue;
	} else if (isPlus && tempSliderValue >= 0 && tempSliderValue < 400) {
		tempSliderValue = ++tempSliderValue;
		output.value = tempSliderValue;
		sliderEl.value = tempSliderValue;
	} else if (isMinus && tempSliderValue > 0 && tempSliderValue <= 400) {
		tempSliderValue = --tempSliderValue;
		output.value = tempSliderValue;
		sliderEl.value = tempSliderValue;
	}

	progress = (tempSliderValue / sliderEl.max) * 100;
	sliderEl.style.background = `linear-gradient(to right, #5A483F ${progress}%, #fff ${progress}%)`;
	sum.textContent = tempSliderValue * floorType.price;

	localStorage.setItem(
		"rangeBackground",
		JSON.stringify(sliderEl.style.background)
	);
	localStorage.setItem("tempSliderValue", JSON.stringify(tempSliderValue));
	localStorage.setItem("sum", JSON.stringify(sum.textContent));
}

function blockSending(e) {
	const isOutput = e.target.className === "form__output";

	if (isOutput && e.keyCode === 13) {
		e.preventDefault();
	}
}

variants.forEach((item) => {
	if (item.value === variant) {
		item.checked = "true";
	}

	item.addEventListener("click", (e) => {
		variant = item.value;
		priceCalculation(e);
		localStorage.setItem("variant", JSON.stringify(variant));
	});
});

innerRange.addEventListener("input", (e) => {
	priceCalculation(e);
});

innerRange.addEventListener("click", (e) => {
	priceCalculation(e);
});

form.addEventListener("keydown", (e) => {
	blockSending(e);
});

substitution();
