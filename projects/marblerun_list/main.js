const levelList = document.getElementById('levelList');

function addLink(name, url) {
    const newLiElement = document.createElement('li');
    const newLinkElement = document.createElement('a');
    newLinkElement.innerText = name;
    newLinkElement.href = url;
    newLiElement.appendChild(newLinkElement);
    levelList.appendChild(newLiElement);
}

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
        querySnapshot.forEach((doc) => {
            let text = "No name: " + doc.id;
            if (doc.data().name != null) text = doc.data().name;
            addLink(text, "/projects/marblerun_js?firestoreId=" + encodeURIComponent(doc.id));
        });
    })
    .catch((error) => {
        console.error("Error getting documents: ", error);
    });