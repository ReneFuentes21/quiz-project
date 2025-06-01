import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { getQuestions, respuesta } from './question.js';
//import preguntasData from './data/questions.json';

document.addEventListener('DOMContentLoaded', () => {
    //localStorage.removeItem('respuestas');

    //getQuestions(preguntasData);
    getQuestions()
    //agregarBotonEnviar();
    
    //document.querySelector('.preguntaResponder').addEventListener('click',respuesta)
});
