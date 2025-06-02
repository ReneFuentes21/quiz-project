import { Button } from "bootstrap/dist/js/bootstrap.bundle.min";
import questions from "./data/questions.json";

// Función para barajar un array (algoritmo de Fisher-Yates)
function aleatorioArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        // Genera un índice aleatorio entre 0 y i
        const j = Math.floor(Math.random() * (i + 1));
        // Intercambia el elemento actual con el elemento en el índice aleatorio
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Creamos una copia de las preguntas originales y la barajamos
const aleatorioQuestions = aleatorioArray([...questions]); // Usamos el spread operator para copiar y luego barajar

let array_respuesta = JSON.parse(localStorage.getItem('quiz')) || [];
let currentQuestionIndex = 0; // Esta variable nos ayudará a saber qué pregunta mostrar

export function getQuestions() {
    const questionsList = document.querySelector('.container-pregunta');
    questionsList.innerHTML = ''; // Importante: Limpiamos el contenedor antes de añadir la nueva pregunta

    // Obtenemos la pregunta actual usando el índice
    const pregunta = aleatorioQuestions[currentQuestionIndex];

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
                <div class="pregunta-titulo">
                    <h1> ${title}</h1>
                    <h3 class="num-pregunta">Pregunta ${currentQuestionIndex + 1} de ${questions.length}</h3>
                </div>
                <section class="opciones"> <!--- Contenedor de opciones---->
                    <div class="opcion"> <!---hace que el radbutton y label estén en misma fila--->
                        <input class="form-check-input" type="radio" name="radio-${id}" value="${correct}" ${respuestaGuardada?.respuesta === correct ? 'checked' : ''}><label>${correct}</label>
                    </div>
                    <div class="opcion">
                        <input class="form-check-input" type="radio" name="radio-${id}" value="${incorrect2}" ${respuestaGuardada?.respuesta === incorrect2 ? 'checked' : ''}><label>${incorrect2}</label>
                    </div>
                    <div class="opcion">
                        <input class="form-check-input" type="radio" name="radio-${id}" value="${incorrect3}" ${respuestaGuardada?.respuesta === incorrect3 ? 'checked' : ''}><label>${incorrect3}</label>
                    </div>
                    <div class="opcion">
                        <input class="form-check-input" type="radio" name="radio-${id}" value="${incorrect1}" ${respuestaGuardada?.respuesta === incorrect1 ? 'checked' : ''}><label>${incorrect1}</label>
                    </div>
                    <div class="d-flex justify-content-center mt-3">
                        <button class="btn btn-color" id="btn-siguiente" type="submit" name="siguiente">Siguiente Pregunta</button>
                    </div>
                </section>
                </section>
                
    `;

    // Asignamos el evento 'change' a cada opción de respuesta
    article.querySelectorAll(`input[name="radio-${id}"]`).forEach(input => {
        input.addEventListener('change', (e) => {
            respuesta(e, id); // Guardamos la respuesta del usuario
        });
    });

    questionsList.appendChild(article); // Añadimos la pregunta al DOM
    actualizarBarraProgreso(); //Actualizando barra de progreso
    
    if (article.querySelector(`input[name="radio-${id}"]:checked`)) {
        // Si el innerHTML ha marcado algo (por localStorage), lo desmarcamos.
        // Esto solo ocurre cuando la pregunta se renderiza.
        article.querySelectorAll(`input[name="radio-${id}"]`).forEach(input => {
            input.checked = false;
        });
    }

    // Asignar evento al botón "Siguiente Pregunta"
    const btnSiguiente = article.querySelector('#btn-siguiente');
    btnSiguiente.addEventListener('click', () => {
    // Verificamos si alguna opción está seleccionada
    const seleccionado = article.querySelector(`input[name="radio-${id}"]:checked`);
    if (!seleccionado) {
        alert('Por favor, selecciona una respuesta antes de continuar.');
        return; // No avanza si no hay selección
    }

    currentQuestionIndex++; // Pasamos a la siguiente pregunta
    getQuestions(); // Llamamos la función para mostrar la siguiente pregunta
    });
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

    localStorage.removeItem('quiz'); //Sirve para reiniciar el progreso que se había guardado
    location.reload(); // Recarga la página para reiniciar todo
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


//función que actualiza la barra de progreso según las preguntas respondidas hasta el momento
export function actualizarBarraProgreso() {
    const barra = document.getElementById('barra-progreso');
    if (!barra) return; // Evita que dé error si aun no se ha construido la barra

    const total = questions.length;
    const respondidas = array_respuesta.filter(r => r.respuesta).length;
    const porcentaje = Math.round((respondidas / total) * 100);

    barra.style.width = `${porcentaje}%`;
    barra.setAttribute('aria-valuenow', porcentaje);
    barra.textContent = `${porcentaje}%`;
}