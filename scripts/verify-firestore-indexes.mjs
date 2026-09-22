/**
 * Script de Verificación de Consultas e Índices Compuestos en Cloud Firestore
 * Banquetes Almar
 * Ejecuta consultas directas sobre los índices compuestos desplegados en Firebase.
 */

import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs
} from "firebase/firestore";
import { getFirebaseConfig } from "./env-loader.mjs";

const firebaseConfig = getFirebaseConfig();

console.log("===============================================================");
console.log("🔍 BANQUETES ALMAR - VERIFICACIÓN DE ÍNDICES COMPUESTOS FIRESTORE");
console.log(`Proyecto Firebase: ${firebaseConfig.projectId}`);
console.log("===============================================================\n");

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const testQueries = [
  {
    name: "Payments: reservationId ASC + paymentDate DESC",
    collection: "payments",
    buildQuery: () =>
      query(
        collection(db, "payments"),
        where("reservationId", "==", "res-201"),
        orderBy("paymentDate", "desc"),
        limit(5)
      )
  },
  {
    name: "Payments: reservationId ASC + createdAt DESC",
    collection: "payments",
    buildQuery: () =>
      query(
        collection(db, "payments"),
        where("reservationId", "==", "res-201"),
        orderBy("createdAt", "desc"),
        limit(5)
      )
  },
  {
    name: "Reservations: status ASC + eventDate ASC",
    collection: "reservations",
    buildQuery: () =>
      query(
        collection(db, "reservations"),
        where("status", "==", "Confirmed"),
        orderBy("eventDate", "asc"),
        limit(5)
      )
  },
  {
    name: "Reservations: status ASC + createdAt DESC",
    collection: "reservations",
    buildQuery: () =>
      query(
        collection(db, "reservations"),
        where("status", "==", "Confirmed"),
        orderBy("createdAt", "desc"),
        limit(5)
      )
  },
  {
    name: "Quotes: status ASC + createdAt DESC",
    collection: "quotes",
    buildQuery: () =>
      query(
        collection(db, "quotes"),
        where("status", "==", "Pending"),
        orderBy("createdAt", "desc"),
        limit(5)
      )
  },
  {
    name: "Quotes: eventType ASC + createdAt DESC",
    collection: "quotes",
    buildQuery: () =>
      query(
        collection(db, "quotes"),
        where("eventType", "==", "Boda"),
        orderBy("createdAt", "desc"),
        limit(5)
      )
  },
  {
    name: "Inventory: category ASC + isActive ASC + name ASC",
    collection: "inventory",
    buildQuery: () =>
      query(
        collection(db, "inventory"),
        where("category", "==", "sillas"),
        where("isActive", "==", true),
        orderBy("name", "asc"),
        limit(5)
      )
  },
  {
    name: "Packages: category ASC + pricePerPerson ASC",
    collection: "packages",
    buildQuery: () =>
      query(
        collection(db, "packages"),
        where("category", "==", "bodas"),
        orderBy("pricePerPerson", "asc"),
        limit(5)
      )
  },
  {
    name: "Gallery: category ASC + order ASC",
    collection: "gallery",
    buildQuery: () =>
      query(
        collection(db, "gallery"),
        where("category", "==", "bodas"),
        orderBy("order", "asc"),
        limit(5)
      )
  },
  {
    name: "Clients: clientType ASC + createdAt DESC",
    collection: "clients",
    buildQuery: () =>
      query(
        collection(db, "clients"),
        where("clientType", "==", "Cliente"),
        orderBy("createdAt", "desc"),
        limit(5)
      )
  }
];

async function runVerification() {
  try {
    process.stdout.write("🔐 Autenticando en Firebase Auth como admin... ");
    await signInWithEmailAndPassword(auth, "admin@almar.com", "Admin123*");
    console.log("✅ Autenticado con éxito.");
  } catch (authErr) {
    console.warn("⚠️ No se pudo autenticar como admin, probando con credenciales anónimas/públicas:", authErr.message);
  }

  let successCount = 0;
  let failureCount = 0;

  for (const t of testQueries) {
    process.stdout.write(`⏳ Probando índice [${t.collection}]: ${t.name}... `);
    try {
      const q = t.buildQuery();
      const snapshot = await getDocs(q);
      console.log(`✅ OK (${snapshot.size} docs)`);
      successCount++;
    } catch (err) {
      console.log(`❌ ERROR: ${err.message}`);
      failureCount++;
    }
  }

  console.log("\n===============================================================");
  console.log(`📊 RESULTADO FINAL: ${successCount}/${testQueries.length} pruebas exitosas`);
  if (failureCount === 0) {
    console.log("🎉 ¡TODOS LOS ÍNDICES COMPUESTOS ESTÁN ACTIVOS Y FUNCIONANDO AL 100%!");
  } else {
    console.log(`⚠️ ${failureCount} consultas requirieron atención.`);
  }
  console.log("===============================================================\n");
  process.exit(failureCount === 0 ? 0 : 1);
}

runVerification();
