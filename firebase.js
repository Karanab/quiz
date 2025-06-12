// Firebase कॉन्फिगरेशन
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    databaseURL: "YOUR_DATABASE_URL",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Firebase इनिशियलाइज़ करें
firebase.initializeApp(firebaseConfig);

// डेटाबेस रेफरेंस
const database = firebase.database();

// डेटाबेस से प्रश्न लोड करने की फंक्शन
function loadQuestionsFromFirebase() {
    return new Promise((resolve, reject) => {
        database.ref('questions').once('value')
            .then((snapshot) => {
                const questions = [];
                snapshot.forEach((childSnapshot) => {
                    questions.push(childSnapshot.val());
                });
                resolve(questions);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

// रिजल्ट सेव करने की फंक्शन
function saveResultToFirebase(userId, resultData) {
    return database.ref('results/' + userId).set(resultData);
}