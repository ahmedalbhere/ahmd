import { db, auth } from './firebase-config.js';
import { doc, getDoc, updateDoc, increment } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import { signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";

const barberName = document.getElementById('barberName');
const salonName = document.getElementById('salonName');
const waitingCount = document.getElementById('waitingCount');
const photo = document.getElementById('photo');
const logoutButton = document.getElementById('logout');
const decreaseWaitingButton = document.getElementById('decreaseWaiting');

let barberDocRef;

onAuthStateChanged(auth, async (user) => {
  if (user) {
    barberDocRef = doc(db, 'barbers', user.uid);
    const barberSnap = await getDoc(barberDocRef);

    if (barberSnap.exists()) {
      const barber = barberSnap.data();
      barberName.innerText = barber.name;
      salonName.innerText = "الصالون: " + barber.salonName;
      waitingCount.innerText = `🕒 العملاء بالانتظار: ${barber.waiting}`;
      if (barber.photoURL) {
        photo.src = barber.photoURL;
      }
    } else {
      alert('لم يتم العثور على بياناتك.');
    }
  } else {
    window.location.href = 'barber-login.html'; // يرجع لتسجيل لو مش مسجل
  }
});

decreaseWaitingButton.addEventListener('click', async () => {
  try {
    await updateDoc(barberDocRef, {
      waiting: increment(-1)
    });
    let currentWaiting = parseInt(waitingCount.innerText.match(/\d+/)[0]);
    if (currentWaiting > 0) {
      currentWaiting--;
    }
    waitingCount.innerText = `🕒 العملاء بالانتظار: ${currentWaiting}`;
    alert('تم انهاء خدمة عميل بنجاح.');
  } catch (error) {
    console.error(error);
    alert('خطأ أثناء التحديث.');
  }
});

logoutButton.addEventListener('click', async () => {
  await signOut(auth);
  window.location.href = 'index.html';
});
