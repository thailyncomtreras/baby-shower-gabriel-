const firebaseConfig = {
  apiKey: "AIzaSyAB9xLPKKRSan-uagRqLMSEB7QcxGUsuwE",
  authDomain: "baby-shower-gabriel-6d7cf.firebaseapp.com",
  projectId: "baby-shower-gabriel-6d7cf",
  storageBucket: "baby-shower-gabriel-6d7cf.appspot.com",
  messagingSenderId: "782568479950",
  appId: "1:782568479950:web:dacf8c1b5d80a6160c849f"
}; 

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDocs, collection, updateDoc, runTransaction } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const listaRegalosInicial = [
  "Pañales recién nacido + pañitos húmedos",
  "Pañales recién nacido + pañitos húmedos",
  "Pañales Etapa 1 + pañitos húmedos",
  "Pañales Etapa 1 + pañitos húmedos",
  "Bañera",
  "Cobija",
  "Cobija",
  "Cobija",
  "Kit para baño",
  "Kit de aseo",
  "Gorritos + almohada",
  "Salida de baño",
  "Semanero",
  "Mamelucos 0-3 meses",
  "Mamelucos 0-3 meses",
  "Mamelucos 3-6 meses",
  "Mamelucos 3-6 meses",
  "Mamelucos 3-6 meses",
  "Ropa de primer día",
  "Conjunto 3-6 meses",
  "Conjunto 3-6 meses",
  "Biberón antigases",
  "Biberón antigases",
  "Medias + franelitas",
  "Medias + franelitas",
  "Saquito",
  "Saquito",
  "Cambiador",
  "Pijama + medias",
  "Pijama + medias",
  "Pijama + medias",
  "Pijama + medias",
  "Termo 1 litro",
  "Crema Yodora + pañitos húmedos",
  "Crema Yodora + pañitos húmedos",
  "Crema Yodora + pañitos húmedos"
];

const boton = document.getElementById("continuar");
const animacion = document.getElementById("animacion");
const resultado = document.getElementById("resultado");
const saludo = document.getElementById("saludo");
const regaloElemento = document.getElementById("regalo");

async function inicializarRegalos() {
  try {
    const querySnapshot = await getDocs(collection(db, "regalos"));
    if (querySnapshot.empty) {
      for (let i = 0; i < listaRegalosInicial.length; i++) {
        await setDoc(doc(db, "regalos", `regalo_${i}`), {
          nombre: listaRegalosInicial[i],
          reservado: false,
          por: ""
        });
      }
      console.log("Base de datos cargada con éxito en la nube.");
    }
  } catch (e) {
    console.error("Error al inicializar base de datos:", e);
  }
}

inicializarRegalos();

boton.addEventListener("click", async () => {
  const nombre = document.getElementById("nombre").value.trim();

  if (nombre === "") {
    alert("Por favor escribe tu nombre 💙");
    return;
  }

  document.querySelector(".card").style.display = "none";
  animacion.style.display = "block";

  try {
    const querySnapshot = await getDocs(collection(db, "regalos"));
    let disponibles = [];
    
    querySnapshot.forEach((doc) => {
      const datos = doc.data();
      if (datos.reservado === false) {
        disponibles.push({ id: doc.id, nombre: datos.nombre });
      }
    });

    if (disponibles.length === 0) {
      setTimeout(() => {
        animacion.style.display = "none";
        resultado.style.display = "block";
        saludo.innerHTML = `¡Hola, ${nombre}! 🧸`;
        regaloElemento.innerHTML = "¡Wow! Todos los regalos ya han sido asignados. Gracias por tu intención. 💙";
      }, 3000);
      return;
    }

    const numeroAleatorio = Math.floor(Math.random() * disponibles.length);
    const regaloElegido = disponibles[numeroAleatorio];

    const regaloRef = doc(db, "regalos", regaloElegido.id);
    await updateDoc(regaloRef, {
      reservado: true,
      por: nombre
    });

    setTimeout(() => {
      animacion.style.display = "none";
      resultado.style.display = "block";
      saludo.innerHTML = `¡Hola, ${nombre}! 🧸`;
      regaloElemento.innerHTML = regaloElegido.nombre;
    }, 3000);

  } catch (error) {
    animacion.style.display = "none";
    document.querySelector(".card").style.display = "block";
    alert("Hubo un pequeño inconveniente de conexión. Inténtalo de nuevo. 💙");
    console.error(error);
  }
});
    
