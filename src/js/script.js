const $inputPantalla = document.getElementById("input-pantalla");
const SYNTAXERROR = "SYNTAX ERROR";
const INFINITY = "Infinity";
let historialTemp = []; //[[Operación, Resultado]]

// Impresión de pantalla de los caracteres
document.querySelectorAll(".print-pantalla").forEach(($el) => {
  $el.addEventListener("click", () => {
    if (
      $inputPantalla.value === SYNTAXERROR ||
      $inputPantalla.value === INFINITY
    )
      $inputPantalla.value = "";
    $inputPantalla.value = $inputPantalla.value + $el.dataset.value;
  });
});

// Botón AC para limpiar todo
document.getElementById("btn-clear-all").addEventListener("click", () => {
  $inputPantalla.value = "";
});

// Botón para eliminar caracter por caracter
document
  .getElementById("btn-eliminar-caracter")
  .addEventListener("click", () => {
    if ($inputPantalla.value.length === 0) return;
    $inputPantalla.value = $inputPantalla.value.substring(
      0,
      $inputPantalla.value.length - 1
    );
  });

// Botón igual
document.getElementById("btn-igual").addEventListener("click", () => {
  if ($inputPantalla.value.length === 0) return;
  let expresion = $inputPantalla.value
    .replace("×", "*")
    .replace("÷", "/")
    .replace("−", "-");
  try {
    $inputPantalla.value = math.evaluate(expresion);
    expresion = expresion.replace("*", "×").replace("/", "÷").replace("-", "−");
    historialTemp.push([expresion, $inputPantalla.value]);
  } catch (e) {
    $inputPantalla.value = SYNTAXERROR;
  }
});

const $historialContainer = document.querySelector(".historial-container");

// Botón para abrir el historial
document.getElementById("btn-historial").addEventListener("click", () => {
  $historialContainer.classList.toggle("hidden");
  const $itemsHistorial = $historialContainer.querySelector(".items-historial");
  const $fragment = document.createDocumentFragment();
  for (let i = 0; i < historialTemp.length && historialTemp.length > 0; i++) {
    /*
      Estructura de cada item del historial:
      <div class="item-historial">
        <button class="pushable" data-operacion="8+9">
          <span class="front">8+9=17</span>
        </button>
      </div>
    */
    const $divItemHistorial = document.createElement("div");
    const $buttonPushable = document.createElement("button");
    const $spanFront = document.createElement("span");
    $divItemHistorial.setAttribute("class", "item-historial");
    $buttonPushable.setAttribute("class", "pushable");
    $buttonPushable.setAttribute("data-operacion", historialTemp[i][0]);
    $buttonPushable.addEventListener("click", function () {
      $inputPantalla.value = this.dataset.operacion;
      $historialContainer.classList.toggle("hidden");
    });
    $spanFront.setAttribute("class", "front");
    $spanFront.textContent = `${historialTemp[i][0]}=${historialTemp[i][1]}`;
    $buttonPushable.appendChild($spanFront);
    $divItemHistorial.appendChild($buttonPushable);
    $fragment.appendChild($divItemHistorial);
  }
  $itemsHistorial.appendChild($fragment);
  historialTemp = [];
});

// Botón para cerrar el historial
document
  .getElementById("btn-cerrar-historial")
  .addEventListener("click", () => {
    $historialContainer.classList.toggle("hidden");
  });

// Botón para limpiar el historial
document
  .getElementById("btn-limpiar-historial")
  .addEventListener("click", () => {
    document.querySelectorAll(".item-historial").forEach(($item) => {
      $item.outerHTML = "";
    });
  });

// Botón para borrar la última operación
document
  .getElementById("btn-borrar-ultima-operacion")
  .addEventListener("click", () => {
    let arrayInputPantalla = $inputPantalla.value.split("");
    let lastIndexOperation = 0;
    arrayInputPantalla.find((el, index) => {
      if (el === "×" || el === "÷" || el === "−" || el === "+")
        lastIndexOperation = index;
    });
    $inputPantalla.value = arrayInputPantalla
      .splice(0, lastIndexOperation)
      .join("");
  });
