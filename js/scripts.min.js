const calcs = document.querySelectorAll(".calc");
const innerRanges = document.querySelectorAll(".calc__inner-range");
const sliderElements = document.querySelectorAll(".calc__range");
const inputs = document.querySelectorAll(".calc__input");
const variants = document.querySelectorAll(".calc__radio");
const amounts = document.querySelectorAll(".calc__sum-descr");
const numbers = document.querySelectorAll(".calc__number");
const priceOptions = [
	{ name: "Ламинат", price: 250 },
	{ name: "Паркет", price: 350 },
	{ name: "Линолеум", price: 150 },
	{ name: "Наливной пол", price: 300 },
];
let variant = "Ламинат";
let tempSliderValue = 32;
let progress = 0;
let sliderElValue = 32;
let input = 32;
let timerId = null;
let interval = null;

variants[0].checked = "true";

function priceCalculation(e) {
	const isRange = e.target.className === "calc__range";
	const isInput = e.target.className === "calc__input";
	const isPlus = e.target.className === "calc__button btn-reset";
	const isMinus =
		e.target.className === "calc__button calc__button--minus btn-reset";

	if (isRange) {
		sliderElValue = e.target.value;
		tempSliderValue = e.target.value;
		input = tempSliderValue;
	} else if (isInput && e.target.value <= 400 && e.target.value >= 0) {
		if (e.target.value === "0" || e.target.value === "") {
			tempSliderValue = 0;
		} else if (e.target.value.length !== 4) {
			tempSliderValue = e.target.value;
		} else {
			tempSliderValue = e.target.value.replace(0, "");
		}
		sliderElValue = tempSliderValue;
		input = tempSliderValue;
	} else if (
		(isInput && isNaN(Number(e.target.value))) ||
		e.target.value > 400 ||
		e.target.value < 0
	) {
		input = tempSliderValue;
		tempSliderValue = tempSliderValue;
		sliderElValue = tempSliderValue;
	} else if (isPlus && tempSliderValue >= 0 && tempSliderValue < 400) {
		tempSliderValue = ++tempSliderValue;
		input = tempSliderValue;
		sliderElValue = tempSliderValue;
	} else if (isMinus && tempSliderValue > 0 && tempSliderValue <= 400) {
		tempSliderValue = --tempSliderValue;
		input = tempSliderValue;
		sliderElValue = tempSliderValue;
	}

	distributionResults();
}

function distributionResults() {
	sliderElements.forEach((sliderEl) => {
		sliderEl.value = sliderElValue;
		progress = (tempSliderValue / sliderEl.max) * 100;
		sliderEl.style.background = `linear-gradient(to right, #5A483F ${progress}%, rgba(0, 0, 0, 0.15) ${progress}%)`;
	});

	inputs.forEach((item) => {
		item.value = input;
	});

	amounts.forEach((sum) => {
		const floorType = priceOptions.find((item) => item.name === variant);
		const money = `${tempSliderValue * floorType.price}`.split("");
		let id = money.length % 3 === 2 ? 1 : money.length % 3 === 1 ? 2 : 0;
		const filteredBudget = money.map((item) => {
			id++;
			if (id % 3 !== 0) {
				return item;
			} else {
				return `${item} `;
			}
		});
		const filteredBudgetLength = filteredBudget.join("").length;
		sum.textContent =
			id % 3 === 0
				? filteredBudget.join("").substring(0, filteredBudgetLength - 1)
				: filteredBudget.join("");
	});
}

function changeValueInput(e) {
	const isPlus = e.target.className === "calc__button btn-reset";
	const isMinus =
		e.target.className === "calc__button calc__button--minus btn-reset";

	if (isPlus && tempSliderValue >= 0 && tempSliderValue < 400) {
		timerId = setTimeout(() => {
			interval = setInterval(() => {
				tempSliderValue =
					tempSliderValue < 400 ? ++tempSliderValue : tempSliderValue;
				input = tempSliderValue;
				sliderElValue = tempSliderValue;
				distributionResults();
			}, 50);
		}, 300);
	} else if (isMinus && tempSliderValue > 0 && tempSliderValue <= 400) {
		timerId = setTimeout(() => {
			interval = setInterval(() => {
				tempSliderValue =
					tempSliderValue > 0 ? --tempSliderValue : tempSliderValue;
				input = tempSliderValue;
				sliderElValue = tempSliderValue;
				distributionResults();
			}, 50);
		}, 200);
	}

	distributionResults();
}

function clearTimers() {
	clearTimeout(timerId);
	clearInterval(interval);
}

function maskPhone(selector, masked = "+7 (___) ___-__-__") {
	const elems = document.querySelectorAll(selector);

	function mask(event) {
		const keyCode = event.keyCode;
		const template = masked,
			def = template.replace(/\D/g, ""),
			val = this.value.replace(/\D/g, "");
		let i = 0,
			newValue = template.replace(/[_\d]/g, function (a) {
				return i < val.length ? val.charAt(i++) || def.charAt(i) : a;
			});
		i = newValue.indexOf("_");
		if (i !== -1) {
			newValue = newValue.slice(0, i);
		}
		let reg = template
			.substr(0, this.value.length)
			.replace(/_+/g, function (a) {
				return "\\d{1," + a.length + "}";
			})
			.replace(/[+()]/g, "\\$&");
		reg = new RegExp("^" + reg + "$");
		if (
			!reg.test(this.value) ||
			this.value.length < 5 ||
			(keyCode > 47 && keyCode < 58)
		) {
			this.value = newValue;
		}
		if (event.type === "blur" && this.value.length < 5) {
			this.value = "";
		}
	}

	for (const elem of elems) {
		elem.addEventListener("input", mask);
		elem.addEventListener("focus", mask);
		elem.addEventListener("blur", mask);
	}
}

variants.forEach((item) => {
	item.addEventListener("click", (e) => {
		variants.forEach((variant) => {
			if (variant.value === e.target.value) {
				variant.checked = "true";
			}
		});

		variant = item.value;
		priceCalculation(e);
	});
});

innerRanges.forEach((innerRange) => {
	innerRange.addEventListener("input", (e) => {
		const isRange = e.target.className === "calc__range";
		const isInput = e.target.className === "calc__input";

		if (isRange || isInput) {
			priceCalculation(e);
		}
	});

	innerRange.addEventListener("mousedown", (e) => {
		const isPlus = e.target.className === "calc__button btn-reset";
		const isMinus =
			e.target.className === "calc__button calc__button--minus btn-reset";

		if (isPlus || isMinus) {
			changeValueInput(e, "mousedown");
		}
	});

	innerRange.addEventListener("mouseup", (e) => {
		const isPlus = e.target.className === "calc__button btn-reset";
		const isMinus =
			e.target.className === "calc__button calc__button--minus btn-reset";

		if (isPlus || isMinus) {
			clearTimers();
		}
	});

	innerRange.addEventListener("mouseout", (e) => {
		const isPlus = e.target.className === "calc__button btn-reset";
		const isMinus =
			e.target.className === "calc__button calc__button--minus btn-reset";

		if (isPlus || isMinus) {
			clearTimers();
		}
	});

	innerRange.addEventListener("click", (e) => {
		const isPlus = e.target.className === "calc__button btn-reset";
		const isMinus =
			e.target.className === "calc__button calc__button--minus btn-reset";

		if (isPlus || isMinus) {
			priceCalculation(e);
		}
	});
});

calcs.forEach((calc) => {
	calc.addEventListener("submit", (e) => {
		e.preventDefault();
	});
});

distributionResults();

maskPhone(".calc__number", "+7 (___) ___-__-__");
