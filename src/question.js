import questions from "./data/questions.json";

let array_respuesta = JSON.parse(localStorage.getItem('quiz')) || [];
let currentQuestionIndex = 0; // Esta variable nos ayudará a saber qué pregunta mostrar

export function getQuestions() {
    const questionsList = document.querySelector('.container-pregunta');
    questionsList.innerHTML = ''; // Importante: Limpiamos el contenedor antes de añadir la nueva pregunta

    // Obtenemos la pregunta actual usando el índice
    const pregunta = questions[currentQuestionIndex];

    // Si ya no hay más preguntas, mostramos el puntaje final
    if (!pregunta) {
        mostrarPuntaje();
        return; // Salimos de la función
    }

    const article = document.createElement('article');
    article.classList.add('col-md-4');

    const { id, title, correct, incorrect1, incorrect2, incorrect3 } = pregunta;

    // Buscamos si ya hay una respuesta guardada para esta pregunta
    const respuestaGuardada = array_respuesta.find(r => r.id === id);

    article.innerHTML = `
        <section class="container-ejercicio">
            <section class="preguntaResponder">
                <h1>${id}.${title}</h1>
                <input class="form-check-input" type="radio" name="radio-${id}" value="${correct}" ${respuestaGuardada?.respuesta === correct ? 'checked' : ''}><label>${correct}</label>
                <input class="form-check-input" type="radio" name="radio-${id}" value="${incorrect2}" ${respuestaGuardada?.respuesta === incorrect2 ? 'checked' : ''}><label>${incorrect2}</label>
                <input class="form-check-input" type="radio" name="radio-${id}" value="${incorrect3}" ${respuestaGuardada?.respuesta === incorrect3 ? 'checked' : ''}><label>${incorrect3}</label>
                <input class="form-check-input" type="radio" name="radio-${id}" value="${incorrect1}" ${respuestaGuardada?.respuesta === incorrect1 ? 'checked' : ''}><label>${incorrect1}</label>
            </section>
        </section>
    `;

    // Asignamos el evento 'change' a cada opción de respuesta
    article.querySelectorAll(`input[name="radio-${id}"]`).forEach(input => {
        input.addEventListener('change', (e) => {
            respuesta(e, id); // Guardamos la respuesta del usuario
            // Después de responder, avanzamos a la siguiente pregunta con un pequeño retraso
            setTimeout(() => {
                currentQuestionIndex++; // Incrementamos el índice para la siguiente pregunta
                getQuestions(); // Llamamos de nuevo a la función para cargar la siguiente pregunta
            }, 300); // 300 milisegundos de espera
        });
    });

    questionsList.appendChild(article); // Añadimos la pregunta al DOM
}

export function respuesta(e, idPregunta) {
    console.log(e.target.value);

    const valor = e.target.value;
    // Buscamos si ya existe una respuesta para esta pregunta y la actualizamos, si no, la añadimos
    const index = array_respuesta.findIndex(r => r.id === idPregunta);
    if (index !== -1) {
        array_respuesta[index].respuesta = valor;
    } else {
        array_respuesta.push({ id: idPregunta, respuesta: valor });
    }

    localStorage.setItem('quiz', JSON.stringify(array_respuesta)); // Guardamos en localStorage
}

// Función para mostrar el puntaje final
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

// Esta función para el botón "Enviar" ya no es tan crítica si las preguntas avanzan solas.
// Podrías usarla para un botón final de "Ver mi puntaje" al terminar todo el cuestionario.
export function agregarBotonEnviar() {
    const questionsList = document.querySelector('.container-pregunta');
    const btn = document.createElement('button');
    btn.textContent = 'Ver mi puntaje';
    btn.addEventListener('click', mostrarPuntaje);
    questionsList.appendChild(btn);
}