import {UrlManager} from "../utils/url-manager.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {Auth} from "../services/auth.js";

export class Answers {
    constructor() {
        this.quiz = null;
        this.routeParams = UrlManager.getQueryParams();

        this.init();
    }

    async init() {
        const userInfo = Auth.getUserInfo();
        const that = this;

        if (!userInfo) {
            location.href = '#/';
        }

        if (this.routeParams.id) {
            try {
                const result = await CustomHttp.request(config.host + '/tests/' + this.routeParams.id + '/result/details?userId=' + userInfo.userId);

                if (result) {
                    if (result.error) {
                        throw new Error(result.error);
                    }

                    this.quiz = result;
                }
            } catch (error) {
                console.log(error);
            }
        }

        document.getElementById('person').innerHTML = 'Тест выполнил <span>' + userInfo.fullName + ', ' + userInfo.email + '</span>';
        this.showAnswers();

        document.getElementById('return-result').onclick = function () {
            location.href = '#/result?id=' + that.routeParams.id;
        }
    }


    showAnswers() {
        document.getElementById('test-name').innerText = this.quiz.test.name;

        this.answersQuestions = document.getElementById('answers-questions');

        const questions = this.quiz.test.questions;

        questions.forEach((question, i) => {

            const answersQuestionsItem = document.createElement('div');
            answersQuestionsItem.className = 'answers__questions-item';

            const questionName = document.createElement('div');
            questionName.className = 'answers__question-title question-title';

            questionName.innerHTML = '<span>Вопрос ' + (i + 1) + ': </span> ' + question.question;

            const answersItems = document.createElement('div');
            answersItems.className = 'answers__items';

            question.answers.forEach((answer, index) => {
                const answersItem = document.createElement('div');
                answersItem.className = 'answers__item';
                answersItem.setAttribute('id', answer.id);

                const circle = document.createElement('div');
                circle.className = 'answers__item-circle';

                const answersItemText = document.createElement('div');
                answersItemText.className = 'answers__item-text';
                answersItemText.innerText = answer.answer;

                answersItem.appendChild(circle);
                answersItem.appendChild(answersItemText);

                answersItems.appendChild(answersItem);

                if (answer.correct === true) {
                    answersItem.classList.add('right-answer');
                } else if (answer.correct === false) {
                    answersItem.classList.add('wrong-answer');
                }

            })

            answersQuestionsItem.appendChild(questionName);
            answersQuestionsItem.appendChild(answersItems);
            this.answersQuestions.appendChild(answersQuestionsItem);
        })
    }
}
