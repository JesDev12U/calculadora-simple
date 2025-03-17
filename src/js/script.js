const $inputPantalla = document.getElementById("input-pantalla");
const SYNTAXERROR = "SYNTAX ERROR";
const INFINITY = "Infinity";
const NAN = "NaN";
const UNDEFINED = "Undefined";
let numAlmacenado = null;
let historialTemp = []; //[[Operación, Resultado]]

const isErrorText = (str) =>
  str === SYNTAXERROR || str === INFINITY || str === NAN || str === UNDEFINED;

const insertClickedClass = (button) => {
  button.classList.add("clicked");
  setTimeout(() => {
    button.classList.remove("clicked");
  }, 100);
};

const clearDecimales = ($input) => {
  if (
    $input.textContent[$input.textContent.length - 1] === "0" &&
    $input.textContent[$input.textContent.length - 2] === "0"
  ) {
    let tempText = $input.textContent.split("");
    for (let i = 0; i < 3; i++) tempText.pop();
    $input.textContent = tempText.join("");
  }
};

// Impresión de pantalla de los caracteres
document.querySelectorAll(".print-pantalla").forEach(($el) => {
  $el.addEventListener("click", () => {
    insertClickedClass($el);
    if (isErrorText($inputPantalla.textContent))
      $inputPantalla.textContent = "";

    const value = $el.dataset.value;
    const currentText = $inputPantalla.textContent;

    // Validación para no permitir más de un punto decimal en un número
    if (value === "." && currentText.includes(".")) {
      const lastNumber = currentText.split(/[\+\-\×\÷]/).pop();
      if (lastNumber.includes(".")) {
        return;
      }
    }

    // Validación para no permitir más de un símbolo de porcentaje
    if (value === "%" && currentText.includes("%")) {
      const lastNumber = currentText.split(/[\+\-\×\÷]/).pop();
      if (lastNumber.includes("%")) {
        return;
      }
    }

    $inputPantalla.textContent = currentText + value;
  });
});

// Botón AC para limpiar todo
document.getElementById("btn-clear-all").addEventListener("click", function () {
  insertClickedClass(this);
  $inputPantalla.textContent = "";
});

// Botón para eliminar caracter por caracter
document
  .getElementById("btn-eliminar-caracter")
  .addEventListener("click", function () {
    insertClickedClass(this);
    if (isErrorText($inputPantalla.textContent))
      $inputPantalla.textContent = "";
    if ($inputPantalla.textContent.length === 0) return;
    $inputPantalla.textContent = $inputPantalla.textContent.substring(
      0,
      $inputPantalla.textContent.length - 1
    );
  });

// Botón igual
document.getElementById("btn-igual").addEventListener("click", function () {
  insertClickedClass(this);
  if ($inputPantalla.textContent.length === 0) return;
  let expresion = $inputPantalla.textContent
    .replace("×", "*")
    .replace("÷", "/");
  try {
    const resultado = math.evaluate(expresion);
    if (resultado.toString() !== INFINITY && resultado.toString() !== NAN) {
      $inputPantalla.textContent = Number(resultado).toFixed(2).toString();
      clearDecimales($inputPantalla);
      expresion = expresion.replace("*", "×").replace("/", "÷");
      historialTemp.push([expresion, $inputPantalla.textContent]);
      return;
    } else if (resultado.toString() === INFINITY)
      $inputPantalla.textContent = INFINITY;
    else $inputPantalla.textContent = NAN;
    setTimeout(() => {
      if (isErrorText($inputPantalla.textContent))
        $inputPantalla.textContent = "";
    }, 1500);
  } catch (e) {
    let operacionMala = $inputPantalla.textContent;
    $inputPantalla.textContent = SYNTAXERROR;
    setTimeout(() => {
      if (isErrorText($inputPantalla.textContent))
        $inputPantalla.textContent = operacionMala;
    }, 1500);
  }
});

const $historialContainer = document.querySelector(".historial-container");

// Botón para abrir el historial
document.getElementById("btn-historial").addEventListener("click", function () {
  insertClickedClass(this);
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
      insertClickedClass(this);
      $inputPantalla.textContent = this.dataset.operacion;
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
  .addEventListener("click", function () {
    insertClickedClass(this);
    $historialContainer.classList.toggle("hidden");
  });

// Botón para limpiar el historial
document
  .getElementById("btn-limpiar-historial")
  .addEventListener("click", function () {
    insertClickedClass(this);
    document.querySelectorAll(".item-historial").forEach(($item) => {
      $item.outerHTML = "";
    });
  });

// Botón para borrar la última operación
document
  .getElementById("btn-borrar-ultima-operacion")
  .addEventListener("click", function () {
    insertClickedClass(this);
    let arrayInputPantalla = $inputPantalla.textContent.split("");
    let lastIndexOperation = 0;
    arrayInputPantalla.find((el, index) => {
      if (el === "×" || el === "÷" || el === "-" || el === "+")
        lastIndexOperation = index;
    });
    $inputPantalla.textContent = arrayInputPantalla
      .splice(0, lastIndexOperation)
      .join("");
  });

// Actualización del input del valor guardado
const $inputValorGuardado = document.getElementById("input-valor-guardado");
const refreshInputValorGuardado = () => {
  $inputValorGuardado.textContent =
    numAlmacenado === null ? UNDEFINED : numAlmacenado.toString();
  clearDecimales($inputValorGuardado);
};
refreshInputValorGuardado();

const regexNumber = /^\-{0,1}[0-9]{1,}(\.{1}[0-9]{1,}|)$/;

// Botón MC
document.getElementById("btn-mc").addEventListener("click", function () {
  insertClickedClass(this);
  numAlmacenado = null;
  refreshInputValorGuardado();
});

// Botón MR
document.getElementById("btn-mr").addEventListener("click", function () {
  insertClickedClass(this);
  $inputPantalla.textContent =
    numAlmacenado === null ? UNDEFINED : numAlmacenado.toString();
  clearDecimales($inputPantalla);
  refreshInputValorGuardado();
});

// Botón M+
document.getElementById("btn-m+").addEventListener("click", function () {
  insertClickedClass(this);
  if (regexNumber.test($inputPantalla.textContent)) {
    if (numAlmacenado === null)
      numAlmacenado = Number($inputPantalla.textContent);
    else
      numAlmacenado =
        Number(numAlmacenado) + Number($inputPantalla.textContent);
    numAlmacenado = Number(numAlmacenado).toFixed(2);
  }
  refreshInputValorGuardado();
});

// Botón M-
document.getElementById("btn-m-").addEventListener("click", function () {
  insertClickedClass(this);
  if (regexNumber.test($inputPantalla.textContent) && numAlmacenado !== null) {
    numAlmacenado = Number(numAlmacenado) - Number($inputPantalla.textContent);
    numAlmacenado = Number(numAlmacenado).toFixed(2);
  }
  refreshInputValorGuardado();
});
