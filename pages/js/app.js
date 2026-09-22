const pesos = monto => "$" + monto.toLocaleString("es-MX");

const sinAcentos = texto =>
  texto.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

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
   Alto real de la cabecera
   Mide la cabecera pegajosa y lo publica como variable CSS, para
   que la tabla y el resultado de la calculadora no queden tapados
   sin depender de un número fijo escrito a mano.
   ------------------------------------------------------------ */

function medirCabecera() {
  const cabecera = document.querySelector(".cabecera");
  if (!cabecera) return;
  const alto = Math.round(cabecera.getBoundingClientRect().height);
  if (alto > 0) {
    document.documentElement.style.setProperty("--header-h", `${alto}px`);
  }
}

medirCabecera();
window.addEventListener("resize", medirCabecera);
window.addEventListener("load", medirCabecera);
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(medirCabecera);
}

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

const filtroDestino = document.getElementById("filtroDestino");
const selectorDestino = document.getElementById("destino");
const selectorEspera = document.getElementById("espera");
const selectorMandados = document.getElementById("mandados");
const casillaCentro = document.getElementById("centro");
const casillaBultos = document.getElementById("bultos");
const montoTotal = document.getElementById("montoTotal");
const detalleTotal = document.getElementById("detalleTotal");
const whatsappTotal = document.getElementById("whatsappTotal");

function opcionDestino(d) {
  const extra = d.etiqueta ? ` — ${d.etiqueta.toLowerCase()}` : "";
  return `<option value="${d.id}">${nombreLargo(d)}${extra}</option>`;
}

function llenarSelectorDestino(texto = "") {
  const seleccionActual = selectorDestino.value;
  const filtro = sinAcentos(texto.trim());

  const grupos = ZONAS.map((grupo, iZona) => {
    const destinos = TODOS.filter(
      d => d.id.startsWith(`${iZona}-`) && (!filtro || d.busqueda.includes(filtro))
    );
    if (!destinos.length) return "";
    return `<optgroup label="${grupo.zona}">${destinos.map(opcionDestino).join("")}</optgroup>`;
  }).join("");

  selectorDestino.innerHTML = `<option value="">Elige tu destino</option>${grupos}`;

  // Conserva la selección si sigue disponible tras filtrar.
  if (seleccionActual && buscarDestino(seleccionActual) && filtro && buscarDestino(seleccionActual).busqueda.includes(filtro)) {
    selectorDestino.value = seleccionActual;
  } else if (seleccionActual && !filtro) {
    selectorDestino.value = seleccionActual;
  }
}

if (filtroDestino) {
  filtroDestino.addEventListener("input", evento => {
    llenarSelectorDestino(evento.target.value);
    pintarCalculadora();
  });
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

function mensajeWhatsapp(destino, pasajeros, opciones, total) {
  const lineas = [
    "Hola, quiero pedir un mototaxi.",
    `Destino: ${nombreLargo(destino)}`,
    `Pasajeros: ${pasajeros}`
  ];
  if (opciones.cruzaCentro) lineas.push("El viaje cruza el centro.");
  if (opciones.bultos) lineas.push("Llevo bultos que ocupan asiento.");
  if (opciones.minutosEspera > 0) lineas.push(`Espera aproximada: ${opciones.minutosEspera} minutos.`);
  if (opciones.mandados > 0) lineas.push(`Mandados extras: ${opciones.mandados}.`);
  lineas.push(`Total calculado: ${pesos(total)}.`);
  return lineas.join("\n");
}

function pintarCalculadora() {
  const destino = buscarDestino(selectorDestino.value);

  if (!destino) {
    montoTotal.textContent = "—";
    detalleTotal.innerHTML =
      `<li><span>Elige tu destino para ver el total</span><span></span></li>`;
    if (whatsappTotal) {
      whatsappTotal.hidden = true;
      whatsappTotal.href = "#";
    }
    return;
  }

  const pasajeros = pasajerosElegidos();
  const opciones = {
    cruzaCentro: casillaCentro.checked,
    bultos: casillaBultos.checked,
    minutosEspera: Number(selectorEspera.value),
    mandados: Number(selectorMandados.value)
  };

  const { conceptos, total } = calcularTarifa(destino, pasajeros, opciones);

  montoTotal.textContent = pesos(total);
  detalleTotal.innerHTML = conceptos
    .map(
      c => `<li${c.doble ? ' class="es-doble"' : ""}>
          <span>${c.texto}</span><span>${c.doble ? "+" : ""}${pesos(c.monto)}</span>
        </li>`
    )
    .join("");

  if (whatsappTotal) {
    const mensaje = mensajeWhatsapp(destino, pasajeros, opciones, total);
    whatsappTotal.href = `https://wa.me/${BASE_TELEFONO}?text=${encodeURIComponent(mensaje)}`;
    whatsappTotal.hidden = false;
  }
}

document
  .querySelectorAll("#destino, #espera, #mandados, #centro, #bultos, input[name='pasajeros']")
  .forEach(control => control.addEventListener("change", pintarCalculadora));

llenarSelectorDestino();
pintarCalculadora();
pintarTabla();


