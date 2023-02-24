import {
  doc,
  getFirestore,
  collection,
  getDocs,
  DocumentData,
  updateDoc,
  arrayUnion,
  addDoc,
  serverTimestamp,
  runTransaction,
  Transaction,
  getDoc,
} from "firebase/firestore";
import CartState from "../models/CartState";
import Product from "../models/Product";
import { FirebaseAdapter } from "../models/FirebaseAdapter";
import { once } from "events";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBe5VB2c-_Xv8tLYVdinsLtiZKIu-8rkzQ",
  authDomain: "sanitarios-jimenez.firebaseapp.com",
  projectId: "sanitarios-jimenez",
  storageBucket: "sanitarios-jimenez.appspot.com",
  messagingSenderId: "966188444363",
  appId: "1:966188444363:web:41a06fd0884266189ec94e",
  measurementId: "G-F2N4GNNEF8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app);

export const fetchSales = async () => {
  const collectionRef = collection(db, "cuentas");
  let sales: CartState[] = [];
  const docSnap = await getDocs(collectionRef);

  let s: CartState = {
    id: "",
    products: [],
    client: "",
    total: 0,
    totalWithDiscount: 0,
    date: new Date(),
  };
  const adapterDocs: CartState[] = FirebaseAdapter.fromDocumentDataArray(
    docSnap.docs
  );
  if (adapterDocs.length > 0) {
    return adapterDocs;
  } else {
    return null;
  }
};

export const addProductsToClient = async (
  document: DocumentData,
  newProducts: Product[]
) => {
  const docRef = doc(db, "sales", document.id);

  console.log(docRef);
  newProducts.forEach((newProduct) => {
    updateDoc(docRef, {
      products: arrayUnion(newProduct),
    });
  });
};
// save the products in documents

export const saveProducts = async (list: string, products: Product[]) => {
  const date = new Date();
  const collectionRef = collection(db, `${list}`);
  const docref = await addDoc(collectionRef, {
    products,
    timestamp: serverTimestamp(),
    listName: list,
  });
};

//fetch the products from Firebase
export const fetchProductsFromFB = async (list: string) => {
  const collectionRef = collection(db, `${list}`);
  const docSnap = await getDocs(collectionRef);
  const productsRes: Product[] = [];
  docSnap.docs.forEach((doc) => {
    const p: Product = {
      id: "",
      cod: "",
      description: "",
      brand: "",
      price: 0,
      amount: 0,
    };
    p.id = doc.data().id;
    p.cod = doc.data().cod;
    p.description = doc.data().description;
    p.amount = doc.data().amount;
    p.brand = doc.data().brand;
    p.price = doc.data().price;
    productsRes.push(p);
  });
  return productsRes;
};

//refresh the price to a list of products

export const updateProduct = async (docId: string, newProduct: Product) => {
  const docRef = doc(db, "sales", docId);
  console.log((await getDoc(docRef)).data());
  let newProducts = null;
  try {
    await runTransaction(db, async (transaction) => {
      const sfDoc = await transaction.get(docRef);
      if (!sfDoc.exists()) {
        throw "Document doesn't exist";
      }
      const newProducts = sfDoc.data().products;
      console.log(
        `NEW-PRODUCT:${newProduct.brand} \nDocData:${sfDoc.data().products}`
      );
      newProducts.forEach((product: Product) => {
        if (
          product.cod === newProduct.cod &&
          product.price < newProduct.price
        ) {
          product.price = newProduct.price;
        }
      });
      transaction.update(docRef, {
        products: newProducts,
      });
    });
  } catch (err) {
    console.error(err);
  }
};

const refreshProducts = async (list: string, products: Product[]) => {
  products.sort((a: Product, b: Product) => {
    if (a.cod < b.cod) {
      return -1;
    } else if (a.cod > b.cod) {
      return 1;
    } else {
      return 0;
    }
  });
  const collectionRef = collection(db, `${list}`);
};
