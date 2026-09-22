/* Tarifario vigente desde el 25 de marzo de 2023.
   tarifa: [1 pasajero, 2 pasajeros, 3 pasajeros] en pesos.
   Para actualizar precios solo se edita este archivo. */

const BASE_TELEFONO = "9531070689";

const ZONAS = [
  {
    zona: "Zona urbana",
    destinos: [
      { destino: "Zona urbana", tarifa: [10, 15, 20] }
    ]
  },
  {
    zona: "Colonias y parajes",
    destinos: [
      { destino: "Colonia Guadalupe", tarifa: [15, 20, 20] },
      { destino: "Calvario A", tarifa: [15, 20, 20] },
      { destino: "Calvario B", tarifa: [20, 25, 25] },
      { destino: "Calvario C", nota: "Prolongación Mina hasta el fondo", tarifa: [25, 25, 25] },
      { destino: "La Curva A", tarifa: [15, 20, 20] },
      { destino: "La Curva B", nota: "Por arriba", tarifa: [20, 25, 25] },
      { destino: "La Curva C", tarifa: [25, 30, 30] },
      { destino: "Buena Vista A", nota: "Panquecitos", tarifa: [15, 20, 20] },
      { destino: "Buena Vista B", nota: "Hacia arriba de los Panquecitos", tarifa: [25, 25, 25] },
      { destino: "Buena Vista C", nota: "Hasta el fondo", tarifa: [30, 30, 30] },
      { destino: "La Canoa A", nota: "Hasta los tanques", tarifa: [15, 20, 20] },
      { destino: "La Canoa B", nota: "Pasando el puente", tarifa: [20, 25, 25] },
      { destino: "La Canoa C", nota: "Cuetero", tarifa: [30, 30, 30] },
      { destino: "Subestación", tarifa: [15, 20, 20] },
      { destino: "El Sabino A", tarifa: [15, 15, 15] },
      { destino: "El Sabino B", tarifa: [20, 20, 20] },
      { destino: "El Sabino C", tarifa: [25, 25, 25] },
      { destino: "Curva salida a Chilapa", nota: "Entrada", tarifa: [25, 25, 25] },
      { destino: "Curva salida a Chilapa", nota: "Hasta abajo", tarifa: [30, 30, 30] },
      { destino: "Yodonduco y Sandaranda", tarifa: [25, 30, 30] },
      { destino: "Tierra Colorada", nota: "Sobre la calle", tarifa: [25, 25, 25] },
      { destino: "Tierra Colorada", nota: "Parte de arriba", tarifa: [30, 30, 30] },
      { destino: "Tierra Blanca", tarifa: [15, 20, 20] },
      { destino: "Fraccionamiento Casitas", tarifa: [15, 20, 20] },
      { destino: "Paraje Yuyite", tarifa: [15, 20, 20] },
      { destino: "Atrás del CETIS", tarifa: [20, 20, 20] },
      { destino: "Puente de Fierro", tarifa: [30, 30, 30] },
      { destino: "Piedra de Agua, El Carrizal y Magnolias", tarifa: [30, 30, 30] },
      { destino: "Plazuela y basurero", tarifa: [40, 40, 40] },
      { destino: "Pista de motocross e hipódromo", tarifa: [40, 40, 40] },
      { destino: "El Mirador", tarifa: [60, 60, 60] }
    ]
  },
  {
    zona: "Escuelas e instituciones",
    destinos: [
      { destino: "Secundaria General", etiqueta: "Solo estudiantes", tarifa: [15, 15, 15] },
      { destino: "Secundaria General", nota: "Público en general", tarifa: [15, 20, 20] },
      { destino: "Secundaria 71", etiqueta: "Solo estudiantes", tarifa: [15, 15, 15] },
      { destino: "CETIS", etiqueta: "Solo estudiantes", tarifa: [10, 15, 15] },
      { destino: "Técnica 266, ISSSTE y DIF", tarifa: [10, 15, 15] },
      { destino: "Parte oriente y sur de la Normal", tarifa: [15, 20, 20] }
    ]
  },
  {
    zona: "Centros recreativos",
    destinos: [
      { destino: "Atonaltzin", tarifa: [20, 25, 25] },
      { destino: "Recreativo Xatachío", tarifa: [25, 30, 30] },
      { destino: "Ojo Chico, Ojo Grande y Agua Azurada", tarifa: [30, 30, 30] },
      { destino: "Vivero Yodoyinde", tarifa: [35, 35, 35] }
    ]
  },
  {
    zona: "Agencias y comunidades", 
    destinos: [
      { destino: "El Arco", nota: "Sobre carretera", tarifa: [25, 25, 25] },
      { destino: "El Arco", nota: "Dentro", tarifa: [30, 30, 30] },
      { destino: "Xacahua, Cascada, El Palmar, El Espinal y El Cañón", tarifa: [50, 50, 50] },
      { destino: "San Jerónimo", tarifa: [70, 70, 70] },
      { destino: "Tandique", tarifa: [80, 80, 80] }
    ]
  }
];

const COBRO_ESPERA = 5;
const MINUTOS_POR_BLOQUE = 5;
const COBRO_MANDADO = 5;
