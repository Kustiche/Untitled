const quizData = [
	{
		number: 1,
		title: "На какую сумму вы рассчитываете?",
		answer_alias: "money",
		answers: [
			{
				answer_title: "500 рублей",
				type: "checkbox",
			},
			{
				answer_title: "5000 рублей",
				type: "checkbox",
			},
			{
				answer_title: "Введу текстом",
				type: "text",
			},
		],
	},
	{
		number: 2,
		title: "Какой именно вам нужен сайт?",
		answer_alias: "great",
		answers: [
			{
				answer_title: "Лендинг-пейдж",
				type: "radio",
			},
			{
				answer_title: "Корпоративный сайт",
				type: "radio",
			},
			{
				answer_title: "Интернет-магазин",
				type: "radio",
			},
		],
	},
	{
		number: 3,
		title: "Оставьте свой телефон, мы вам перезвоним",
		answer_alias: "phone",
		answers: [
			{
				answer_title: "Введите телефон",
				type: "text",
			},
		],
	},
];

const quizTemplate = (data = [], dataLength, options) => {
	const { number, title } = data;
	const { nextBtnText } = options;
	const answers = data.answers.map((item) => {
		return `
			<label class="quiz-question__label">
				<input class="quiz-question__answer" type="${item.type}" name="${
			data.answer_alias
		}" data-valid="false" ${
			item.type === "text" ? `placeholder="Введите ваш вариант..."` : ""
		} value="${item.type !== "text" ? item.answer_title : ""}"/>
				<span>${item.answer_title}</span>
			</label>
		`;
	});

	return `
		<div class="quiz__content">
			<div class="quiz__questions">${number} из ${dataLength}</div>
			<div class="quiz-question">
				<h3 class="quiz-question__title">${title}</h3>
				<div class="quiz-question__answers">
					${answers.join("")}
				</div>
				<button class="quiz-question__btn" type="button" data-next-btn>${nextBtnText}</button>
			</div>
		</div>
	`;
};

class Quiz {
	constructor(selector, data, options) {
		this.$el = document.querySelector(selector);
		this.options = options;
		this.data = data;
		this.counter = 0;
		this.dataLength = this.data.length;
		this.resultArray = [];
		this.temp = {};
		this.init();
		this.events();
	}

	init() {
		this.$el.innerHTML = quizTemplate(
			quizData[this.counter],
			this.dataLength,
			this.options
		);
	}

	events() {
		this.$el.addEventListener("click", (e) => {
			if (e.target === document.querySelector("[data-next-btn]")) {
				this.addToSend();
				this.nextQuestion();
			}

			if (e.target === document.querySelector("[data-send]")) {
				this.addToSend();
				this.send();
			}
		});

		this.$el.addEventListener("change", (e) => {
			if (e.target.tagName === "INPUT") {
				if (e.target.type !== "checkbox" && e.target.type !== "radio") {
					let elements = this.$el.querySelectorAll("input");

					elements.forEach((element) => {
						element.checked = false;
					});
				}

				this.temp = this.serialize(this.$el);
			}
		});
	}

	nextQuestion() {
		if (this.valid()) {
			if (this.counter + 1 < this.dataLength) {
				this.counter++;

				this.$el.innerHTML = quizTemplate(
					quizData[this.counter],
					this.dataLength,
					this.options
				);

				if (this.counter + 1 === this.dataLength) {
					this.$el.insertAdjacentHTML(
						"beforeend",
						`<button class="quiz-question__btn" type="button" data-send>${this.options.sendBtnText}</button>`
					);
					this.$el.querySelector("[data-next-btn]").remove();
				}
			}
		}
	}

	valid() {
		let isValid = false;
		let elements = this.$el.querySelectorAll("input");

		elements.forEach((element) => {
			switch (element.type) {
				case "text":
					element.value ? (isValid = true) : element.classList.add("error");
				case "checkbox":
					element.checked ? (isValid = true) : element.classList.add("error");
				case "radio":
					element.checked ? (isValid = true) : element.classList.add("error");
			}
		});

		return isValid;
	}

	addToSend() {
		this.resultArray.push(this.temp);
	}

	send() {
		if (this.valid()) {
			let elements = this.$el.querySelectorAll("input");

			elements.forEach((element) => {
				element.classList.remove("error");
			});

			const formData = new FormData();

			for (let item of this.resultArray) {
				for (let obj in item) {
					formData.append(obj, item[obj].substring(0, item[obj].length - 1));
				}
			}

			// const response = fetch("mail.php", {
			// 	method: "POST",
			// 	body: formData,
			// });
		}
	}

	serialize(form) {
		let field,
			s = {};
		let valueString = "";
		if (typeof form == "object" && form.nodeName == "FORM") {
			let len = form.elements.length;
			for (let i = 0; i < len; i++) {
				field = form.elements[i];

				if (
					field.name &&
					!field.disabled &&
					field.type != "file" &&
					field.type != "reset" &&
					field.type != "submit" &&
					field.type != "button"
				) {
					if (field.type == "select-multiple") {
						for (j = form.elements[i].options.length - 1; j >= 0; j--) {
							if (field.options[j].selected)
								s[s.length] =
									encodeURIComponent(field.name) +
									"=" +
									encodeURIComponent(field.options[j].value);
						}
					} else if (
						(field.type != "checkbox" &&
							field.type != "radio" &&
							field.value) ||
						field.checked
					) {
						valueString += field.value + ",";

						s[field.name] = valueString;
					}
				}
			}
		}
		return s;
	}
}

window.quiz = new Quiz(".quiz", quizData, {
	nextBtnText: "Далее",
	sendBtnText: "Отправлять",
});
