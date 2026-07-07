const levelList = document.getElementById('levelList');

const firebaseConfig = {
  apiKey: "AIzaSyDpd5UGaLwWoa6YPDvgip2P6k1KvWTSHno",
  authDomain: "sutormin-org.firebaseapp.com",
  projectId: "sutormin-org",
  storageBucket: "sutormin-org.firebasestorage.app",
  messagingSenderId: "545602955870",
  appId: "1:545602955870:web:71a68ca48c92fdb381e2cf"
};

const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore(app);
const collection = db.collection("marblerun");

collection.orderBy('timestamp', 'desc')
  .get()
  .then((querySnapshot) => {
    levelList.innerHTML = "";
    querySnapshot.forEach((doc) => {
      let name = "No name: " + doc.id;
      if (doc.data().name != null) name = doc.data().name;
      const newLiElement = document.createElement('li');
      const newLinkElement = document.createElement('a');
      newLinkElement.innerText = name;
      newLinkElement.href = "../marblerun_js/index.html?firestoreId=" + encodeURIComponent(doc.id);
      if (doc.data().special == true) {
        newLinkElement.style.color = "gold";
        newLinkElement.style.fontWeight = "900";
        newLinkElement.style.fontStyle = "italic";
      } else if (doc.data().kobe == true) {
        newLinkElement.style.color = "green";
        newLinkElement.style.fontWeight = "900";
        newLinkElement.style.fontStyle = "italic";
      }
      newLiElement.appendChild(newLinkElement);
      levelList.appendChild(newLiElement);
    });
  })
  .catch((error) => {
    console.error("Error getting documents: ", error);
  });