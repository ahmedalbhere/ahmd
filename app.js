import { db } from './firebase-config.js';
import { collection, getDocs, updateDoc, doc } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

async function loadBarbers() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const userLat = position.coords.latitude;
      const userLon = position.coords.longitude;

      const querySnapshot = await getDocs(collection(db, "barbers"));
      let html = '';

      querySnapshot.forEach((docSnap) => {
        const barber = docSnap.data();
        const distance = getDistance(userLat, userLon, barber.lat, barber.lon);

        html += `
          <div class="barber-card">
            <img src="${barber.photoURL || 'default-barber.jpg'}" alt="Barber">
            <div class="barber-info">
              <h3>${barber.name}</h3>
              <p>الصالون: ${barber.salonName}</p>
              <p>⭐ التقييم: ${barber.rating}</p>
              <p id="waiting-${docSnap.id}">🕒 العملاء بالانتظار: ${barber.waiting}</p>
              <p>📍 المسافة: ${distance.toFixed(2)} كم</p>
              <button onclick="requestHaircut('${docSnap.id}')">احجز الآن</button>
            </div>
          </div>
        `;
      });

      document.getElementById('barber-list').innerHTML = html;
    });
  } else {
    alert('المتصفح لا يدعم تحديد الموقع.');
  }
}

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // نصف قطر الأرض
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

window.requestHaircut = async function(barberId) {
  const barberRef = doc(db, 'barbers', barberId);
  await updateDoc(barberRef, {
    waiting: firebase.firestore.FieldValue.increment(1)
  });

  const waitingElement = document.getElementById(`waiting-${barberId}`);
  let currentWaiting = parseInt(waitingElement.innerText.match(/\d+/)[0]);
  waitingElement.innerText = `🕒 العملاء بالانتظار: ${currentWaiting + 1}`;
  alert('تم الحجز بنجاح!');
}

loadBarbers();
