const pesos = monto => "$" + monto.toLocaleString("es-MX");

const sinAcentos = texto =>
  texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const TODOS = ZONAS.flatMap((grupo, iZona) =>
  grupo.destinos.map((d, iDestino) => ({
    ...d,
    zona: grupo.zona,
    id: `${iZona}-${iDestino}`,
    busqueda: sinAcentos([d.destino, d.nota, d.etiqueta, grupo.zona].filter(Boolean).join(" "))
  }))
);

const buscarDestino = id => TODOS.find(d => d.id === id);

const nombreLargo = d => (d.nota ? `${d.destino} (${d.nota})` : d.destino);

/* ------------------------------------------------------------
   Tabla de tarifas
   ------------------------------------------------------------ */

const cuerpoTabla = document.getElementById("cuerpoTabla");
const campoBusqueda = document.getElementById("busqueda");
const conteo = document.getElementById("conteo");
const sinResultados = document.getElementById("sinResultados");

function filaDestino(d) {
  const nota = d.nota ? `<span class="destino__nota">${d.nota}</span>` : "";
  const etiqueta = d.etiqueta ? `<span class="destino__etiqueta">${d.etiqueta}</span>` : "";
  const precios = d.tarifa.map(p => `<td class="col-precio precio">${pesos(p)}</td>`).join("");
  return `<tr>
      <th scope="row" class="destino">${d.destino}${etiqueta}${nota}</th>
      ${precios}
    </tr>`;
}

function pintarTabla(texto = "") {
  const filtro = sinAcentos(texto.trim());
  let encontrados = 0;

  cuerpoTabla.innerHTML = ZONAS.map((grupo, iZona) => {
    const destinos = TODOS.filter(
      d => d.id.startsWith(`${iZona}-`) && (!filtro || d.busqueda.includes(filtro))
    );
    if (!destinos.length) return "";
    encontrados += destinos.length;
    return `<tr class="fila-zona"><th colspan="4" scope="colgroup">${grupo.zona}</th></tr>
      ${destinos.map(filaDestino).join("")}`;
  }).join("");

  sinResultados.hidden = encontrados > 0;
  conteo.textContent = filtro
    ? `${encontrados} ${encontrados === 1 ? "destino" : "destinos"} coinciden con “${texto.trim()}”`
    : `${TODOS.length} destinos en el tarifario`;
}

campoBusqueda.addEventListener("input", evento => pintarTabla(evento.target.value));

/* ------------------------------------------------------------
   Calculadora de tarifa
   ------------------------------------------------------------ */

const selectorDestino = document.getElementById("destino");
const selectorEspera = document.getElementById("espera");
const selectorMandados = document.getElementById("mandados");
const casillaCentro = document.getElementById("centro");
const casillaBultos = document.getElementById("bultos");
const montoTotal = document.getElementById("montoTotal");
const detalleTotal = document.getElementById("detalleTotal");

function llenarSelectorDestino() {
  selectorDestino.innerHTML =
    `<option value="">Elige tu destino</option>` +
    ZONAS.map((grupo, iZona) => {
      const opciones = grupo.destinos
        .map((d, iDestino) => {
          const extra = d.etiqueta ? ` — ${d.etiqueta.toLowerCase()}` : "";
          return `<option value="${iZona}-${iDestino}">${nombreLargo(d)}${extra}</option>`;
        })
        .join("");
      return `<optgroup label="${grupo.zona}">${opciones}</optgroup>`;
    }).join("");
}

function pasajerosElegidos() {
  return Number(document.querySelector('input[name="pasajeros"]:checked').value);
}

function calcularTarifa(destino, pasajeros, opciones) {
  const conceptos = [];
  const cupoCompleto = destino.tarifa[destino.tarifa.length - 1];
  const base = opciones.bultos ? cupoCompleto : destino.tarifa[pasajeros - 1];

  conceptos.push({
    texto: opciones.bultos
      ? "Cupo completo de la unidad"
      : `Tarifa a ${nombreLargo(destino)}`,
    monto: base
  });

  let viaje = base;
  if (opciones.cruzaCentro) {
    conceptos.push({ texto: "El viaje cruza el centro", monto: viaje, doble: true });
    viaje *= 2;
  }

  const bloques = Math.ceil(opciones.minutosEspera / MINUTOS_POR_BLOQUE);
  if (bloques > 0) {
    conceptos.push({
      texto: `Espera de ${opciones.minutosEspera} minutos`,
      monto: bloques * COBRO_ESPERA
    });
  }

  if (opciones.mandados > 0) {
    conceptos.push({
      texto: `${opciones.mandados} ${opciones.mandados === 1 ? "mandado" : "mandados"}`,
      monto: opciones.mandados * COBRO_MANDADO
    });
  }

  const total = viaje + bloques * COBRO_ESPERA + opciones.mandados * COBRO_MANDADO;
  return { conceptos, total };
}

function pintarCalculadora() {
  const destino = buscarDestino(selectorDestino.value);

  if (!destino) {
    montoTotal.textContent = "—";
    detalleTotal.innerHTML =
      `<li><span>Elige tu destino para ver el total</span><span></span></li>`;
    return;
  }

  const { conceptos, total } = calcularTarifa(destino, pasajerosElegidos(), {
    cruzaCentro: casillaCentro.checked,
    bultos: casillaBultos.checked,
    minutosEspera: Number(selectorEspera.value),
    mandados: Number(selectorMandados.value)
  });

  montoTotal.textContent = pesos(total);
  detalleTotal.innerHTML = conceptos
    .map(
      c => `<li${c.doble ? ' class="es-doble"' : ""}>
          <span>${c.texto}</span><span>${c.doble ? "+" : ""}${pesos(c.monto)}</span>
        </li>`
    )
    .join("");
}

document
  .querySelectorAll("#destino, #espera, #mandados, #centro, #bultos, input[name='pasajeros']")
  .forEach(control => control.addEventListener("change", pintarCalculadora));

llenarSelectorDestino();
pintarCalculadora();
pintarTabla();
