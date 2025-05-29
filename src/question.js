import questions from "./data/questions.json";
let array_respuesta = JSON.parse(localStorage.getItem('quiz')) || [];

export function getQuestions(){
    const questionsList = document.querySelector('.container-pregunta');

    questions.map(pregunta =>{
        const article = document.createElement('article');

        article.classList.add('col-md-4');

        const {id, title, correct, incorrect1, incorrect2, incorrect3} = pregunta

        article.innerHTML = `
        <section class="container-ejercicio">
            <section class="preguntaResponder">
                <h1>${id}.${title}</h1>
                <input class="form-check-input" type="radio" name="radioDefault" id="radioDefault1" value=${correct}><label>${correct}</label>
                <input class="form-check-input" type="radio" name="radioDefault" id="radioDefault1" value=${incorrect2}><label>${incorrect2}</label>
                <input class="form-check-input" type="radio" name="radioDefault" id="radioDefault1" value=${incorrect3}><label>${incorrect3}</label>
                <input class="form-check-input" type="radio" name="radioDefault" id="radioDefault1" value=${incorrect1}><label>${incorrect1}</label>
            </section>
        </section>
        `

        questionsList.appendChild(article)
    })
}

export function respuesta(e){
    console.log(e.target.value);
    array_respuesta.push(e.target.value)
    localStorage.setItem('quiz', JSON.stringify(array_respuesta))
}