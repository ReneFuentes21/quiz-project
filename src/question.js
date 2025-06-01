import questions from "./data/questions.json";
let array_respuesta = JSON.parse(localStorage.getItem('quiz')) || [];

export function getQuestions(){
    const questionsList = document.querySelector('.container-pregunta');

    questions.map(pregunta =>{
        const article = document.createElement('article');

        article.classList.add('col-md-4');

        const {id, title, correct, incorrect1, incorrect2, incorrect3} = pregunta

        // Se busca si hay respuesta previa guardada para esta pregunta
        const respuestaGuardada = array_respuesta.find(r => r.id === id);

        /*El atributo `name="radio-${id}"` agrupa las opciones por pregunta usando el id, 
        asegurando que solo se pueda seleccionar una opción por pregunta.
        Con la parte `${respuestaGuardada?.respuesta === valor ? 'checked' : ''}` 
        se verifica si el usuario ya había seleccionado esa respuesta antes (guardada en localStorage).
        Si es así, se marca esa opción como seleccionada al cargar la página.
         */
        article.innerHTML = `
        <section class="container-ejercicio">
            <section class="preguntaResponder">
                <h1>${id}.${title}</h1>
                <section class="radio-texto">
                <input class="form-check-input" type="radio" name="radio-${id}" value="${correct}" ${respuestaGuardada?.respuesta === correct ? 'checked' : ''}><label>${correct}</label>
                <input class="form-check-input" type="radio" name="radio-${id}" value="${incorrect2}" ${respuestaGuardada?.respuesta === incorrect2 ? 'checked' : ''}><label>${incorrect2}</label>
                <input class="form-check-input" type="radio" name="radio-${id}" value="${incorrect3}" ${respuestaGuardada?.respuesta === incorrect3 ? 'checked' : ''}><label>${incorrect3}</label>
                <input class="form-check-input" type="radio" name="radio-${id}" value="${incorrect1}" ${respuestaGuardada?.respuesta === incorrect1 ? 'checked' : ''}><label>${incorrect1}</label>
            </section>
        </section>
        </section>
        `

         // Se asigna el evento a cada input individualmente
        article.querySelectorAll(`input[name="radio-${id}"]`).forEach(input => {
            input.addEventListener('change', (e) => respuesta(e, id));
        });

        questionsList.appendChild(article)
    })
}

export function respuesta(e, idPregunta) {
    console.log(e.target.value);

    const valor = e.target.value;
    // Se reemplaza si ya existe una respuesta para esa pregunta
    const index = array_respuesta.findIndex(r => r.id === idPregunta);
    if (index !== -1) {
        array_respuesta[index].respuesta = valor;
    } else {
        array_respuesta.push({ id: idPregunta, respuesta: valor });
    }

    localStorage.setItem('quiz', JSON.stringify(array_respuesta))
}

// Función para mostrar el puntaje
function mostrarPuntaje() {
    let correctas = 0;
    questions.forEach(pregunta => {
        const respuestaUsuario = array_respuesta.find(r => r.id === pregunta.id);
        if (respuestaUsuario?.respuesta === pregunta.correct) {
            correctas++;
        }
    });
    alert(`Puntaje: ${correctas} de ${questions.length}`);
}

/*funcion para mostrar preguntas*/
function mostrarPregunta(index) {
    const questionsList = document.querySelector('.container-pregunta');
    questionsList.innerHTML = ""; // Limpiar pregunta anterior

    const pregunta = questions[index];
    if (!pregunta) return;

    const article = document.createElement('article');
    article.classList.add('col-md-4');

    const { id, title, correct, incorrect1, incorrect2, incorrect3 } = pregunta;
    const respuestaGuardada = array_respuesta.find(r => r.id === id);

    article.innerHTML = `
    <section class="container-ejercicio">
        <section class="preguntaResponder">
            <h1>${id}. ${title}</h1>`
            `<input class="form-check-input" type="radio" name="radio-${id}" value="${correct}" ${respuestaGuardada?.respuesta === correct ? 'checked' : ''}><label>${correct}</label><br>
            <input class="form-check-input" type="radio" name="radio-${id}" value="${incorrect1}" ${respuestaGuardada?.respuesta === incorrect1 ? 'checked' : ''}><label>${incorrect1}</label><br>
            <input class="form-check-input" type="radio" name="radio-${id}" value="${incorrect2}" ${respuestaGuardada?.respuesta === incorrect2 ? 'checked' : ''}><label>${incorrect2}</label><br>
            <input class="form-check-input" type="radio" name="radio-${id}" value="${incorrect3}" ${respuestaGuardada?.respuesta === incorrect3 ? 'checked' : ''}><label>${incorrect3}</label><br>
        </section>
    </section>
    `;

    article.querySelectorAll(`input[name="radio-${id}"]`).forEach(input => {
        input.addEventListener('change', (e) => respuesta(e, id));
    });

    questionsList.appendChild(article);'0'
}


export function agregarBotonEnviar() {
    const questionsList = document.querySelector('.container-pregunta');
    const btn = document.createElement('button');
    btn.textContent = 'Enviar respuestas';
    btn.addEventListener('click', mostrarPuntaje);
    questionsList.appendChild(btn);
}
