// Alustetaan muuttujat tilan hallintaa varten
let loggedIn = false; // Käyttäjän kirjautumistila
let ordersData = []; // Lista kaikista tilauksista
let allProducts = []; // Lista kaikista tuotteista

// Haetaan HTML-elementtejä DOM:ista tunnistusta varten
const loginBtn = document.getElementById('login-btn'); // Kirjautumispainike
const logoutBtn = document.getElementById('logout-btn'); // Uloskirjautumispainike
const mainNav = document.getElementById('main-nav'); // Navigaatiopalkki

const themeToggleBtn = document.getElementById('theme-toggle-btn'); // Teeman vaihtopainike

const welcomeSection = document.getElementById('welcome-section'); // Etusivun sisältö
const loginModal = document.getElementById('login-modal'); // Kirjautumislomakkeen popup
const loginForm = document.getElementById('login-form'); // Kirjautumislomake
const loginMessage = document.getElementById('login-message'); // Kirjautumisviesti (virheilmoitukset)
const closeLogin = document.getElementById('close-login'); // Kirjautumislomakkeen sulkeva painike

const ordersViewBtn = document.getElementById('orders-view-btn'); // Asiakas tilauksien näkymään siirtymispainike
const productsViewBtn = document.getElementById('products-view-btn'); // Tuotteiden näkymään siirtymispainike
const historyViewBtn = document.getElementById('history-view-btn'); // Tilaushistorian näkymään siirtymispainike
const rejectedViewBtn = document.getElementById('rejected-view-btn'); // Hylättyjen tilausten näkymään siirtymispainike

const ordersSection = document.getElementById('orders-section'); // Asiakas tilausnäkymä
const productsSection = document.getElementById('products-section'); // Tuotehallinnan näkymä
const historySection = document.getElementById('history-section'); // Tilaushistorian näkymä
const rejectedSection = document.getElementById('rejected-section'); // Hylättyjen tilausten näkymä

const ordersList = document.getElementById('orders-list'); // Lista pending-tilauksille
const historyList = document.getElementById('history-list'); // Lista tilahistorialle
const rejectedList = document.getElementById('rejected-list'); // Lista hylätyille tilauksille

const globalProductSearch = document.getElementById('global-product-search'); // Tuotteiden hakukenttä
const allProductsList = document.getElementById('all-products-list'); // Lista kaikista tuotteista

const selectedOrderBar = document.getElementById('selected-order-bar'); // Valitun tilauksen tiedot
const selectedOrderTitle = document.getElementById('selected-order-title'); // Valitun tilauksen otsikko
const orderInvaddr = document.getElementById('order-invaddr'); // Laskutusosoite
const selectedProductsList = document.getElementById('selected-products-list'); // Valittujen tuotteiden lista tilaukseen
const productError = document.getElementById('product-error'); // Tuotevirheviesti
const sendOrderBtn = document.getElementById('send-order-btn'); // Lähetä tilaus -painike
const cancelOrderBtn = document.getElementById('cancel-order-btn'); // Peruuta tilaus -painike

const successModal = document.getElementById('success-modal'); // Tilaus onnistumisilmoitus
const closeSuccess = document.getElementById('close-success'); // OK-painike tilausilmoituksessa

const deleteConfirmModal = document.getElementById('delete-confirm-modal'); // Poiston varoitusikkuna
const confirmDeleteBtn = document.getElementById('confirm-delete-btn'); // Vahvista poisto -painike
const cancelDeleteBtn = document.getElementById('cancel-delete-btn'); // Peruuta poisto -painike

const approvedOrdersContainer = document.getElementById('approved-orders-container'); // Hyväksyttyjen tilausten kontti
const wantedProductsList = document.getElementById('wanted-products-list'); // Asiakkaan toivomien tuotteiden lista
const extraOrderInfo = document.getElementById('extra-order-info'); // Lisätiedot tilauksesta

const historyStartDate = document.getElementById('history-start-date'); // Tilaushistorian aloituspäivämäärä
const historyEndDate = document.getElementById('history-end-date'); // Tilaushistorian lopetuspäivämäärä
const historySearchBtn = document.getElementById('history-search-btn'); // Tilaushistorian hakupainike

const rejectedStartDate = document.getElementById('rejected-start-date'); // Hylättyjen tilausten aloituspäivämäärä
const rejectedEndDate = document.getElementById('rejected-end-date'); // Hylättyjen tilausten lopetuspäivämäärä
const rejectedSearchBtn = document.getElementById('rejected-search-btn'); // Hylättyjen tilausten hakupainike

let selectedOrderForProducts = null; // Valitun tilauksen objekti, jota käsitellään
let orderToDelete = null; // Tilaus, joka on valittuna poistettavaksi

// Kun DOM on ladattu, suoritetaan alla olevat toiminnot
document.addEventListener('DOMContentLoaded', () => {
  console.log("Sivu ladattu"); // Loggaa, että sivu on ladattu
  // Tarkistetaan, onko käyttäjä jo kirjautunut sisään selaimen sessionStorageen tallennetun tiedon perusteella
  if (sessionStorage.getItem('loggedIn') === 'true') {
    loggedIn = true; // Asetetaan kirjautumistila todeksi
    showLoggedInView(); // Näytetään kirjautuneen käyttäjän näkymä
    loadDataFromStorage(); // Ladataan tilaukset paikallisesta säilytyksestä
    // Jos tilauksia ei ole tallennettuna, haetaan ne palvelimelta
    if (ordersData.length === 0) {
      fetchOrders(); // Haetaan tilaukset
    } else {
      buildAllProducts(); // Rakennetaan tuotteiden lista kaikista tilauksista
      renderAllProducts(allProducts); // Näytetään kaikki tuotteet käyttöliittymässä
      renderApprovedOrders(); // Näytetään hyväksytyt tilaukset
    }
  } else {
    showWelcomeView(); // Näytetään etusivu, jos käyttäjä ei ole kirjautunut
  }
});

/* Teeman vaihto */
// Lisätään tapahtumankuuntelija teeman vaihtopainikkeelle
themeToggleBtn.addEventListener('click', () => {
  // Jos body-elementti sisältää 'light-theme' -luokan, vaihdetaan se 'dark-theme' -luokkaan
  if (document.body.classList.contains('light-theme')) {
    document.body.classList.remove('light-theme'); // Poistetaan 'light-theme' -luokka
    document.body.classList.add('dark-theme'); // Lisätään 'dark-theme' -luokka
  } else {
    // Jos 'dark-theme' -luokka on, vaihdetaan se takaisin 'light-theme' -luokkaan
    document.body.classList.remove('dark-theme'); // Poistetaan 'dark-theme' -luokka
    document.body.classList.add('light-theme'); // Lisätään 'light-theme' -luokka
  }
});

/* Kirjautumisen hallinta */
// Lisää tapahtumankuuntelija kirjautumispainikkeelle
loginBtn.addEventListener('click', () => {
  loginModal.classList.remove('hidden'); // Näyttää kirjautumislomakkeen popupin
});

// Lisää tapahtumankuuntelija kirjautumislomakkeen sulkemispainikkeelle
closeLogin.addEventListener('click', () => {
  loginModal.classList.add('hidden'); // Piilottaa kirjautumislomakkeen popupin
});

// Lisää tapahtumankuuntelija kirjautumislomakkeen lähetykselle
loginForm.addEventListener('submit', (e) => {
  e.preventDefault(); // Estää lomakkeen oletustoiminnon (sivun uudelleenlataamisen)
  const formData = new FormData(loginForm); // Hakee lomakkeen tiedot
  const user = formData.get('username'); // Hakee käyttäjänimen
  const pass = formData.get('password'); // Hakee salasanan

  // Esimerkki tunnistetiedoista (tämä tulee korvata todellisella autentikoinnilla)
  if (user === 'admin' && pass === 'secret') { // Tarkistaa käyttäjänimen ja salasanan
    loggedIn = true; // Asettaa kirjautumistilan todeksi
    sessionStorage.setItem('loggedIn', 'true'); // Tallentaa kirjautumistilan selaimen sessionStorageen
    showLoggedInView(); // Näyttää kirjautuneen käyttäjän näkymän
    loginModal.classList.add('hidden'); // Piilottaa kirjautumislomakkeen popupin
    fetchOrders(); // Hakee tilaukset palvelimelta
  } else {
    // Jos käyttäjänimi tai salasana on väärä, näytetään virheilmoitus
    loginMessage.textContent = 'Väärä käyttäjänimi tai salasana!';
  }
});

// Lisää tapahtumankuuntelija uloskirjautumispainikkeelle
logoutBtn.addEventListener('click', () => {
  loggedIn = false; // Asettaa kirjautumistilan epätodeksi
  sessionStorage.removeItem('loggedIn'); // Poistaa kirjautumistilan selaimen sessionStoragesta
  showWelcomeView(); // Näyttää etusivun näkymän
});

/* Navigoinnin hallinta */
// Lisää tapahtumankuuntelija Asiakas Tilaukset -painikkeelle
ordersViewBtn.addEventListener('click', () => {
  showOrdersView(); // Näyttää Asiakas Tilaukset -näkymän
});

// Lisää tapahtumankuuntelija Tuotteet -painikkeelle
productsViewBtn.addEventListener('click', () => {
  showProductsView(); // Näyttää Tuotteet-näkymän
});

// Lisää tapahtumankuuntelija Tilaushistoria -painikkeelle
historyViewBtn.addEventListener('click', () => {
  showHistoryView(); // Näyttää Tilaushistoria-näkymän
});

// Lisää tapahtumankuuntelija Hylätyt Tilaukset -painikkeelle
rejectedViewBtn.addEventListener('click', () => {
  showRejectedView(); // Näyttää Hylätyt Tilaukset -näkymän
});

/* Ilmoitusten hallinta */
// Lisää tapahtumankuuntelija onnistuneen tilauksen sulkemiseen
closeSuccess.addEventListener('click', () => {
  successModal.classList.add('hidden'); // Piilottaa onnistumisilmoituksen
});

/* Tuotteiden hakutoiminto */
// Lisää tapahtumankuuntelija tuotteiden hakukentälle
globalProductSearch.addEventListener('input', () => {
  const query = globalProductSearch.value.toLowerCase(); // Hakee hakukentän arvon ja muuntaa sen pieniksi kirjaimiksi
  // Suodattaa tuotteet, jotka sisältävät hakusanan joko tuotteen nimessä tai koodissa
  const filtered = allProducts.filter(p => 
    p.product.toLowerCase().includes(query) || 
    p.code.toLowerCase().includes(query)
  );
  renderAllProducts(filtered); // Näyttää suodatetut tuotteet käyttöliittymässä
});

/* Tilauksen lähettäminen */
// Lisää tapahtumankuuntelija Lähetä tilaus -painikkeelle
sendOrderBtn.addEventListener('click', () => {
  if (!selectedOrderForProducts) return; // Jos ei ole valittua tilausta, lopetetaan toiminto
  // Tarkistaa, että kaikki valitut tuotteet ovat tarpeeksi lisättyjä
  const allSelected = selectedOrderForProducts.products.every(p => parseInt(p.selectedQty) >= parseInt(p.qty));
  if (!allSelected) {
    // Jos kaikki tuotteet eivät ole tarpeeksi lisättyjä, näytetään virheilmoitus
    productError.textContent = "Et voi lähettää tilausta, kaikkia tuotteita ei ole lisätty tarpeeksi.";
    productError.classList.remove('hidden'); // Näyttää virheilmoituksen
    return; // Lopetetaan toiminto
  }
  // Jos kaikki tuotteet on lisätty tarpeeksi, päivitetään tilausstatus
  selectedOrderForProducts.status = 'shipped'; // Asettaa tilauksen statuksen 'shipped'
  selectedOrderForProducts.shippedDate = new Date().toISOString(); // Asettaa lähetystiedon nykyhetkeen
  saveDataToStorage(); // Tallentaa tiedot paikalliseen säilytykseen
  selectedOrderBar.classList.add('hidden'); // Piilottaa valitun tilauksen tiedot
  selectedOrderForProducts = null; // Tyhjentää valitun tilauksen
  successModal.classList.remove('hidden'); // Näyttää onnistumisilmoituksen
});

/* Tilauksen peruuttaminen */
// Lisää tapahtumankuuntelija Peruuta tilaus -painikkeelle
cancelOrderBtn.addEventListener('click', () => {
  if (!selectedOrderForProducts) return; // Jos ei ole valittua tilausta, lopetetaan toiminto
  // Päivittää tilauksen statuksen hylätyksi
  selectedOrderForProducts.status = 'rejected'; // Asettaa tilauksen statuksen 'rejected'
  selectedOrderForProducts.rejectedDate = new Date().toISOString(); // Asettaa hylätyn tilauksen päivämäärän
  saveDataToStorage(); // Tallentaa tiedot paikalliseen säilytykseen
  selectedOrderBar.classList.add('hidden'); // Piilottaa valitun tilauksen tiedot
  selectedOrderForProducts = null; // Tyhjentää valitun tilauksen
  showRejectedView(); // Näyttää Hylätyt Tilaukset -näkymän
});

/* Poiston varmistus */
// Lisää tapahtumankuuntelija poiston vahvistuspainikkeelle
confirmDeleteBtn.addEventListener('click', () => {
  if (!orderToDelete) return; // Jos ei ole valittua tilausta poistettavaksi, lopetetaan toiminto
  ordersData = ordersData.filter(o => o !== orderToDelete); // Poistaa tilauksen tilausdatasta
  orderToDelete = null; // Tyhjentää poistettavan tilauksen
  saveDataToStorage(); // Tallentaa tiedot paikalliseen säilytykseen
  deleteConfirmModal.classList.add('hidden'); // Piilottaa poiston varoitusikkunan
  renderRejectedOrders(); // Päivittää hylättyjen tilausten listan
});

// Lisää tapahtumankuuntelija poiston peruuttamiseen
cancelDeleteBtn.addEventListener('click', () => {
  deleteConfirmModal.classList.add('hidden'); // Piilottaa poiston varoitusikkunan
  orderToDelete = null; // Tyhjentää poistettavan tilauksen
});

/* Päivämäärähaku history-sivulla */
// Lisää tapahtumankuuntelija Tilaushistorian hakupainikkeelle
historySearchBtn.addEventListener('click', () => {
  renderHistory(); // Näyttää tilaukset valitulla aikavälillä
});

/* Päivämäärähaku hylätyille tilauksille */
// Lisää tapahtumankuuntelija Hylättyjen tilausten hakupainikkeelle
rejectedSearchBtn.addEventListener('click', () => {
  renderRejectedOrders(); // Näyttää hylätyt tilaukset valitulla aikavälillä
});

/* Näkymien hallinta */
// Näyttää etusivun näkymän ja piilottaa muut näkymät
function showWelcomeView() {
  welcomeSection.classList.remove('hidden'); // Näyttää etusivun
  ordersSection.classList.add('hidden'); // Piilottaa Asiakas Tilaukset -näkymän
  productsSection.classList.add('hidden'); // Piilottaa Tuotteet-näkymän
  historySection.classList.add('hidden'); // Piilottaa Tilaushistorian näkymän
  rejectedSection.classList.add('hidden'); // Piilottaa Hylättyjen tilausten näkymän
  mainNav.classList.add('hidden'); // Piilottaa navigaatiopalkin
  logoutBtn.classList.add('hidden'); // Piilottaa uloskirjautumispainikkeen
}

// Näyttää kirjautuneen käyttäjän näkymän ja piilottaa etusivun
function showLoggedInView() {
  welcomeSection.classList.add('hidden'); // Piilottaa etusivun
  loginBtn.classList.add('hidden'); // Piilottaa kirjautumispainikkeen
  logoutBtn.classList.remove('hidden'); // Näyttää uloskirjautumispainikkeen
  mainNav.classList.remove('hidden'); // Näyttää navigaatiopalkin
  showOrdersView(); // Näyttää Asiakas Tilaukset -näkymän
}

// Näyttää Asiakas Tilaukset -näkymän ja piilottaa muut näkymät
function showOrdersView() {
  ordersSection.classList.remove('hidden'); // Näyttää Asiakas Tilaukset -näkymän
  productsSection.classList.add('hidden'); // Piilottaa Tuotteet-näkymän
  historySection.classList.add('hidden'); // Piilottaa Tilaushistorian näkymän
  rejectedSection.classList.add('hidden'); // Piilottaa Hylättyjen tilausten näkymän
  renderPendingOrders(); // Näyttää pending-tilaukset
}

// Näyttää Tuotteet-näkymän ja piilottaa muut näkymät
function showProductsView() {
  ordersSection.classList.add('hidden'); // Piilottaa Asiakas Tilaukset -näkymän
  productsSection.classList.remove('hidden'); // Näyttää Tuotteet-näkymän
  historySection.classList.add('hidden'); // Piilottaa Tilaushistorian näkymän
  rejectedSection.classList.add('hidden'); // Piilottaa Hylättyjen tilausten näkymän
  renderAllProducts(allProducts); // Näyttää kaikki tuotteet
  renderApprovedOrders(); // Näyttää hyväksytyt tilaukset
  if (!selectedOrderForProducts) {
    selectedOrderBar.classList.add('hidden'); // Piilottaa valitun tilauksen tiedot, jos sellaista ei ole
  }
}

// Näyttää Tilaushistorian näkymän ja piilottaa muut näkymät
function showHistoryView() {
  ordersSection.classList.add('hidden'); // Piilottaa Asiakas Tilaukset -näkymän
  productsSection.classList.add('hidden'); // Piilottaa Tuotteet-näkymän
  historySection.classList.remove('hidden'); // Näyttää Tilaushistorian näkymän
  rejectedSection.classList.add('hidden'); // Piilottaa Hylättyjen tilausten näkymän
  renderHistory(); // Näyttää tilaukset valitulla aikavälillä
}

// Näyttää Hylättyjen tilausten näkymän ja piilottaa muut näkymät
function showRejectedView() {
  ordersSection.classList.add('hidden'); // Piilottaa Asiakas Tilaukset -näkymän
  productsSection.classList.add('hidden'); // Piilottaa Tuotteet-näkymän
  historySection.classList.add('hidden'); // Piilottaa Tilaushistorian näkymän
  rejectedSection.classList.remove('hidden'); // Näyttää Hylättyjen tilausten näkymän
  renderRejectedOrders(); // Näyttää hylätyt tilaukset
}

/* Tilauksen hakeminen palvelimelta */
// Hakee tilaukset palvelimelta ja tallentaa ne paikalliseen säilytykseen
function fetchOrders() {
  console.log("Haetaan tilauksia..."); // Loggaa, että tilauksia haetaan
  fetch('https://www.cc.puv.fi/~asa/cgi-bin/fetchOrders.py') // Lähettää HTTP-pyynnön tilauksien hakemiseksi
    .then(res => res.json()) // Muuntaa vastauksen JSON-muotoon
    .then(data => {
      console.log("Data haettu:", data); // Loggaa haetun datan
      // Määrittää jokaiselle tilaukselle statuksen 'pending' ja alustaa valitut määrät
      ordersData = data.map(o => {
        o.status = 'pending'; // Asettaa tilauksen statuksen 'pending'
        o.products.forEach(p => p.selectedQty = 0); // Asettaa kaikkien tuotteiden valitun määrän 0:ksi
        return o; // Palauttaa tilauksen objektin
      });
      saveDataToStorage(); // Tallentaa tilaukset paikalliseen säilytykseen
      buildAllProducts(); // Rakentaa kaikki tuotteet tilauksista
      renderAllProducts(allProducts); // Näyttää kaikki tuotteet käyttöliittymässä
      renderPendingOrders(); // Näyttää pending-tilaukset
    })
    .catch(err => {
      console.error('Virhe haettaessa tilauksia:', err); // Loggaa virheen, jos tilauksia ei saada haettua
    });
}

/* Tuotteiden rakentaminen */
// Rakentaa kaikki tuotteet tilauksista yhdistämällä kaikki tilauksien tuotteet
function buildAllProducts() {
  allProducts = []; // Alustaa tuotteiden listan
  ordersData.forEach(order => {
    allProducts = allProducts.concat(order.products); // Lisää tilauksen tuotteet tuotteiden listaan
  });
}

/* Tuotteiden renderöinti käyttöliittymään */
// Näyttää kaikki tuotteet käyttöliittymässä
function renderAllProducts(productArray) {
  allProductsList.innerHTML = ''; // Tyhjentää nykyiset tuotteet
  if (productArray.length === 0) {
    allProductsList.innerHTML = '<p>Ei tuotteita.</p>'; // Näyttää viestin, jos tuotteita ei ole
    return; // Lopettaa toiminnon
  }

  // Käy läpi kaikki tuotteet ja luo niille HTML-elementit
  productArray.forEach(p => {
    const div = document.createElement('div'); // Luo uuden div-elementin
    div.className = 'product-card'; // Asettaa luokan 'product-card' tyylille
    div.innerHTML = `
      <h4>${p.product}</h4>
      <p>Koodi: ${p.code}</p>
      <div class="qty-controls">
        <button class="minus-global-btn">-</button>
        <span>0</span>
        <button class="plus-global-btn">+</button>
      </div>
    `; // Lisää HTML-sisällön tuotteelle

    const minusBtn = div.querySelector('.minus-global-btn'); // Haetaan miinus-painike
    const plusBtn = div.querySelector('.plus-global-btn'); // Haetaan plus-painike
    const countSpan = div.querySelector('span'); // Haetaan span, jossa määrä näytetään

    let selectedCount = 0; // Alustetaan valittu määrä

    // Lisää tapahtumankuuntelija plus-painikkeelle
    plusBtn.addEventListener('click', () => {
      if (!selectedOrderForProducts) return; // Jos ei ole valittua tilausta, lopetetaan toiminto
      selectedCount++; // Kasvatetaan valittua määrää
      countSpan.textContent = selectedCount; // Päivitetään näytetty määrä
      addProductToOrder(p, 1); // Lisää tuotteen tilaukseen yhden kappaleen
    });

    // Lisää tapahtumankuuntelija minus-painikkeelle
    minusBtn.addEventListener('click', () => {
      if (!selectedOrderForProducts) return; // Jos ei ole valittua tilausta, lopetetaan toiminto
      if (selectedCount > 0) { // Jos valittu määrä on suurempi kuin 0
        selectedCount--; // Pienennetään valittua määrää
        countSpan.textContent = selectedCount; // Päivitetään näytetty määrä
        addProductToOrder(p, -1); // Poistaa tuotteen tilauksesta yhden kappaleen
      }
    });

    allProductsList.appendChild(div); // Lisää tuotteen listaan
  });
}

/* Pending tilauksien renderöinti */
// Näyttää kaikki pending-tilaukset Asiakas Tilaukset -näkymässä
function renderPendingOrders() {
  ordersList.innerHTML = ''; // Tyhjentää nykyiset tilaukset listasta
  const pendingOrders = ordersData.filter(o => o.status === 'pending'); // Suodattaa tilaukset, joiden status on 'pending'
  if (pendingOrders.length === 0) {
    ordersList.innerHTML = '<p>Ei uusia tilauksia.</p>'; // Näyttää viestin, jos pending-tilauksia ei ole
    return; // Lopettaa toiminnon
  }
  // Käy läpi kaikki pending-tilaukset ja luo niille HTML-elementit
  pendingOrders.forEach(order => {
    const div = document.createElement('div'); // Luo uuden div-elementin
    div.className = 'order-item'; // Asettaa luokan 'order-item' tyylille
    div.innerHTML = `
      <h3>Tilaus #${order.orderid}</h3>
      <p>Asiakas: ${order.customer}</p>
      <p>Tuotteita: ${order.products.length}</p>
      <button class="approve-btn">Hyväksy tilaus</button>
      <button class="delete-btn">Älä hyväksy</button>
    `; // Lisää HTML-sisällön tilaukselle

    // Lisää tapahtumankuuntelija Hyväksy tilaus -painikkeelle
    div.querySelector('.approve-btn').addEventListener('click', () => {
      approveOrder(order); // Hyväksyy tilauksen
    });

    // Lisää tapahtumankuuntelija Älä hyväksy -painikkeelle
    div.querySelector('.delete-btn').addEventListener('click', () => {
      rejectOrder(order); // Hylkää tilauksen
    });

    ordersList.appendChild(div); // Lisää tilauksen listaan
  });
}

/* Tilausten hyväksyminen */
// Hyväksyy tilauksen ja päivittää näkymät
function approveOrder(order) {
  order.status = 'approved'; // Asettaa tilauksen statuksen 'approved'
  saveDataToStorage(); // Tallentaa muutokset paikalliseen säilytykseen
  renderPendingOrders(); // Päivittää pending-tilaukset näkymään
}

/* Tilausten hylkääminen */
// Hylkää tilauksen ja päivittää näkymät
function rejectOrder(order) {
  order.status = 'rejected'; // Asettaa tilauksen statuksen 'rejected'
  order.rejectedDate = new Date().toISOString(); // Asettaa tilauksen hylkäyspäivämäärän nykyhetkeen
  saveDataToStorage(); // Tallentaa muutokset paikalliseen säilytykseen
  renderPendingOrders(); // Päivittää pending-tilaukset näkymään
}

/* Hyväksytyn tilauksen käsittely */
// Käsittelee hyväksytyn tilauksen, näyttää sen tiedot ja mahdollistaa tuotteiden valinnan
function handleApprovedOrder(order) {
  selectedOrderForProducts = order; // Asettaa valitun tilauksen
  selectedOrderBar.classList.remove('hidden'); // Näyttää valitun tilauksen tiedot
  selectedOrderTitle.textContent = `Tilaus #${order.orderid} - Asiakas: ${order.customer}`; // Näyttää tilauksen otsikon
  orderInvaddr.textContent = `Laskutusosoite: ${order.invaddr}`; // Näyttää tilauksen laskutusosoitteen
  
  let html = ''; // Alustaa HTML-sisällön lisätiedoille
  if (order.customerid) {
    html += `<p>Asiakas ID: ${order.customerid}</p>`; // Lisää asiakas ID:n, jos se on olemassa
  }
  if (order.deliverydate) {
    html += `<p>Päivämäärä: ${formatDate(order.deliverydate)}</p>`; // Lisää toimituspäivämäärän, jos se on olemassa
  }
  if (order.comment) {
    html += `<p>Kommentti: ${order.comment}</p>`; // Lisää kommentin, jos se on olemassa
  }
  extraOrderInfo.innerHTML = html; // Näyttää lisätiedot tilauksesta

  let wantedHTML = '<ul>'; // Alustaa HTML-sisällön asiakkaan toivomille tuotteille
  order.products.forEach(p => {
    wantedHTML += `<li>${p.product} (koodi: ${p.code}) Tarvitaan: ${p.qty}</li>`; // Lisää jokaisen tuotteen tietoja
  });
  wantedHTML += '</ul>'; // Sulkee listan
  wantedProductsList.innerHTML = wantedHTML; // Näyttää asiakkaan toivomien tuotteiden listan

  productError.classList.add('hidden'); // Piilottaa mahdolliset virheilmoitukset
  renderSelectedProducts(); // Näyttää valitut tuotteet tilaukseen

  // Tyhjentää hyväksyttyjen tilausten listan ja piilottaa otsikon
  approvedOrdersContainer.innerHTML = ''; // Tyhjentää hyväksyttyjen tilausten konttikontin
  const approvedTitle = approvedOrdersContainer.previousElementSibling; // Hakee preceding elementin (h3-elementin "Hyväksytyt tilaukset")
  if (approvedTitle && approvedTitle.tagName === 'H3') {
    approvedTitle.style.display = 'none'; // Piilottaa hyväksyttyjen tilausten otsikon
  }
}

/* Hyväksyttyjen tilausten renderöinti */
// Näyttää kaikki hyväksytyt tilaukset Tuotteet-näkymässä
function renderApprovedOrders() {
  approvedOrdersContainer.innerHTML = ''; // Tyhjentää nykyiset hyväksytyt tilaukset
  const approved = ordersData.filter(o => o.status === 'approved'); // Suodattaa tilaukset, joiden status on 'approved'
  if (approved.length === 0) {
    approvedOrdersContainer.innerHTML = '<p>Ei hyväksyttyjä tilauksia.</p>'; // Näyttää viestin, jos hyväksyttyjä tilauksia ei ole
    return; // Lopettaa toiminnon
  }

  // Käy läpi kaikki hyväksytyt tilaukset ja luo niille HTML-elementit
  approved.forEach(order => {
    const div = document.createElement('div'); // Luo uuden div-elementin
    div.className = 'order-item'; // Asettaa luokan 'order-item' tyylille
    div.innerHTML = `
      <h4>Tilaus #${order.orderid}</h4>
      <p>Asiakas: ${order.customer}</p>
      <button class="handle-approve-order-btn">Käsittele tilaus</button>
    `; // Lisää HTML-sisällön hyväksytylle tilaukselle

    // Lisää tapahtumankuuntelija Käsittele tilaus -painikkeelle
    div.querySelector('.handle-approve-order-btn').addEventListener('click', () => {
      handleApprovedOrder(order); // Käsittelee valitun tilauksen
    });

    approvedOrdersContainer.appendChild(div); // Lisää tilauksen listaan
  });
}

/* Tuotteiden lisääminen tilaukseen */
// Lisää tai poistaa tuotteen määrää tilauksessa
function addProductToOrder(p, delta) {
  if (!selectedOrderForProducts) return; // Jos ei ole valittua tilausta, lopetetaan toiminto
  const orderProd = selectedOrderForProducts.products.find(prod => prod.code === p.code); // Etsii tuotteen tilauksesta koodin perusteella
  if (!orderProd) {
    return; // Jos tuotetta ei löydy tilauksesta, lopetetaan toiminto
  }
  orderProd.selectedQty = Math.max(0, orderProd.selectedQty + delta); // Päivittää valitun määrän, mutta varmistaa ettei se mene alle 0:n
  renderSelectedProducts(); // Näyttää päivitetyt valitut tuotteet tilaukseen
}

/* Valittujen tuotteiden renderöinti */
// Näyttää valitut tuotteet tilaukseen
function renderSelectedProducts() {
  if (!selectedOrderForProducts) return; // Jos ei ole valittua tilausta, lopetetaan toiminto
  const selectedProducts = selectedOrderForProducts.products.filter(p => p.selectedQty > 0); // Suodattaa tuotteet, joilla on valittu määrä
  if (selectedProducts.length === 0) {
    selectedProductsList.innerHTML = '<p>Ei valittuja tuotteita.</p>'; // Näyttää viestin, jos tuotteita ei ole valittu
    return; // Lopettaa toiminnon
  }

  // Luo HTML-sisällön valituille tuotteille
  selectedProductsList.innerHTML = '<ul>' + selectedProducts.map(p => {
    return `<li>${p.product} (koodi: ${p.code}) Tarve: ${p.qty}, Valittu: ${p.selectedQty}</li>`;
  }).join('') + '</ul>';
}

// Näyttää tilaukset historiassa valitulla aikavälillä
function renderHistory() {
  historyList.innerHTML = ''; // Tyhjentää nykyiset tilaukset listasta
  const shipped = ordersData.filter(o => o.status === 'shipped'); // Suodattaa tilaukset, joiden status on 'shipped'
  const start = historyStartDate.value ? new Date(historyStartDate.value) : null; // Hakee aloituspäivämäärän, jos se on valittu
  const end = historyEndDate.value ? new Date(historyEndDate.value) : null; // Hakee lopetuspäivämäärän, jos se on valittu

  // Suodattaa tilaukset valitun aikavälin perusteella
  const filtered = shipped.filter(o => {
    if (!o.shippedDate) return false; // Jos tilauksella ei ole lähetettypäivämäärää, jätetään se pois
    const d = new Date(o.shippedDate); // Muuntaa lähetettypäivämäärän Date-objektiksi
    if (start && d < start) return false; // Jos tilaus on ennen aloituspäivää, jätetään se pois
    if (end && d > end) return false; // Jos tilaus on jälkeen lopetuspäivän, jätetään se pois
    return true; // Muuten sisällytetään tilaus
  });

  if (filtered.length === 0) {
    historyList.innerHTML = '<p>Ei lähetettyjä tilauksia valitulla aikavälillä.</p>'; // Näyttää viestin, jos tilauksia ei ole valitulla aikavälillä
    return; // Lopettaa toiminnon
  }

  // Käy läpi kaikki suodatetut tilaukset ja luo niille HTML-elementit
  filtered.forEach(order => {
    const div = document.createElement('div'); // Luo uuden div-elementin
    div.className = 'history-item'; // Asettaa luokan 'history-item' tyylille
    div.innerHTML = `
      <h3>Lähetetty tilaus #${order.orderid}</h3>
      <p>Asiakas: ${order.customer}</p>
      ${order.customerid ? `<p>Asiakas ID: ${order.customerid}</p>`: ''} <!-- Näyttää asiakas ID:n, jos se on olemassa -->
      ${order.invaddr ? `<p>Laskutusosoite: ${order.invaddr}</p>`: ''} <!-- Näyttää laskutusosoitteen, jos se on olemassa -->
      ${order.deliverydate ? `<p>Toimituspäivä: ${formatDate(order.deliverydate)}</p>`: ''} <!-- Näyttää toimituspäivämäärän, jos se on olemassa -->
      ${order.shippedDate ? `<p>Lähetetty: ${formatDate(order.shippedDate)}</p>` : ''} <!-- Näyttää lähetettypäivämäärän, jos se on olemassa -->
      ${order.comment ? `<p>Kommentti: ${order.comment}</p>`: ''} <!-- Näyttää kommentin, jos se on olemassa -->
      <h4>Tuotteet:</h4>
      <ul>${order.products.map(p => `<li>${p.product} (koodi: ${p.code}) x ${p.selectedQty || p.qty}</li>`).join('')}</ul> <!-- Lista tilauksen tuotteista -->
      <button class="delete-btn">Poista historiasta</button> <!-- Poisto-painike tilaukselle -->
      <button class="print-btn">Tulosta</button> <!-- Tulosta-painike tilaukselle -->
    `;
    const deleteBtn = div.querySelector('.delete-btn'); // Hakee Poista historiasta -painikkeen
    deleteBtn.addEventListener('click', () => {
      ordersData = ordersData.filter(o => o !== order); // Poistaa tilauksen tilausdatasta
      saveDataToStorage(); // Tallentaa muutokset paikalliseen säilytykseen
      renderHistory(); // Päivittää tilahistorian näkymän
    });

    const printBtn = div.querySelector('.print-btn'); // Hakee Tulosta -painikkeen
    printBtn.addEventListener('click', () => {
      printOrder(order); // Tulostaa tilauksen
    });

    historyList.appendChild(div); // Lisää tilauksen listaan
  });
}

/* Tilauksen tulostaminen */
// Avaa uuden ikkunan ja tulostaa tilauksen tiedot
function printOrder(order) {
  const printWindow = window.open('', '', 'width=600,height=600'); // Avaa uuden ikkunan
  const productsHTML = order.products.map(p => `<li>${p.product} (koodi: ${p.code}) x ${p.selectedQty || p.qty}</li>`).join(''); // Luo HTML-sisällön tilauksen tuotteille

  // Kirjoittaa HTML-sisällön tulostusikkunaan
  printWindow.document.write(`
    <html>
    <head><title>Tilaus #${order.orderid}</title></head>
    <body>
      <h1>Lähetetty tilaus #${order.orderid}</h1>
      <p>Asiakas: ${order.customer}</p>
      ${order.customerid ? `<p>Asiakas ID: ${order.customerid}</p>`: ''}
      ${order.invaddr ? `<p>Laskutusosoite: ${order.invaddr}</p>`: ''}
      ${order.deliverydate ? `<p>Toimituspäivä: ${formatDate(order.deliverydate)}</p>`: ''}
      ${order.shippedDate ? `<p>Lähetetty: ${formatDate(order.shippedDate)}</p>` : ''}
      ${order.comment ? `<p>Kommentti: ${order.comment}</p>`: ''}
      <h4>Tuotteet:</h4>
      <ul>${productsHTML}</ul>
    </body>
    </html>
  `);

  printWindow.document.close(); // Sulkee dokumentin muokkaamisen
  printWindow.focus(); // Asettaa tulostusikkunan etusijalle
  printWindow.print(); // Avaa tulostusvalikon
  printWindow.close(); // Sulkee tulostusikkunan
}

/* Hylättyjen tilauksien renderöinti */
// Näyttää kaikki hylätyt tilaukset Hylätyt Tilaukset -näkymässä
function renderRejectedOrders() {
  rejectedList.innerHTML = ''; // Tyhjentää nykyiset hylätyt tilaukset listasta
  const rejected = ordersData.filter(o => o.status === 'rejected'); // Suodattaa tilaukset, joiden status on 'rejected'
  const start = rejectedStartDate.value ? new Date(rejectedStartDate.value) : null; // Hakee aloituspäivämäärän, jos se on valittu
  const end = rejectedEndDate.value ? new Date(rejectedEndDate.value) : null; // Hakee lopetuspäivämäärän, jos se on valittu

  // Suodattaa hylätyt tilaukset valitun aikavälin perusteella
  const filtered = rejected.filter(o => {
    if (!o.rejectedDate) return false; // Jos tilauksella ei ole hylkäyspäivämäärää, jätetään se pois
    const d = new Date(o.rejectedDate); // Muuntaa hylkäyspäivämäärän Date-objektiksi
    if (start && d < start) return false; // Jos tilaus on ennen aloituspäivää, jätetään se pois
    if (end && d > end) return false; // Jos tilaus on jälkeen lopetuspäivän, jätetään se pois
    return true; // Muuten sisällytetään tilaus
  });

  if (filtered.length === 0) {
    rejectedList.innerHTML = '<p>Ei hylättyjä tilauksia valitulla aikavälillä.</p>'; // Näyttää viestin, jos hylättyjä tilauksia ei ole valitulla aikavälillä
    return; // Lopettaa toiminnon
  }

  // Käy läpi kaikki suodatetut hylätyt tilaukset ja luo niille HTML-elementit
  filtered.forEach(order => {
    const div = document.createElement('div'); // Luo uuden div-elementin
    div.className = 'order-item'; // Asettaa luokan 'order-item' tyylille
    div.innerHTML = `
      <h3>Hylätty Tilaus #${order.orderid}</h3>
      <p>Asiakas: ${order.customer}</p>
      ${order.customerid ? `<p>Asiakas ID: ${order.customerid}</p>`: ''} <!-- Näyttää asiakas ID:n, jos se on olemassa -->
      ${order.invaddr ? `<p>Laskutusosoite: ${order.invaddr}</p>`: ''} <!-- Näyttää laskutusosoitteen, jos se on olemassa -->
      ${order.deliverydate ? `<p>Toimituspäivä: ${formatDate(order.deliverydate)}</p>`: ''} <!-- Näyttää toimituspäivämäärän, jos se on olemassa -->
      ${order.rejectedDate ? `<p>Hylätty: ${formatDate(order.rejectedDate)}</p>` : ''} <!-- Näyttää hylkäyspäivämäärän, jos se on olemassa -->
      ${order.comment ? `<p>Kommentti: ${order.comment}</p>` : ''} <!-- Näyttää kommentin, jos se on olemassa -->
      <h4>Tuotteita: ${order.products.length}</h4> <!-- Näyttää tuotteiden määrän tilauksessa -->
      <button class="approve-btn">Lisää Asiakkaan Tilaus Takaisin</button> <!-- Lisää tilauksen takaisin pending-tilaukseksi -->
      <button class="delete-btn">Poista Tilaus</button> <!-- Poistaa tilauksen -->
    `;

    // Lisää tapahtumankuuntelija Lisää Asiakkaan Tilaus Takaisin -painikkeelle
    div.querySelector('.approve-btn').addEventListener('click', () => {
      order.status = 'pending'; // Asettaa tilauksen statuksen takaisin 'pending'
      order.rejectedDate = null; // Poistaa hylkäyspäivämäärän
      saveDataToStorage(); // Tallentaa muutokset paikalliseen säilytykseen
      renderRejectedOrders(); // Päivittää hylättyjen tilausten listan
    });

    // Lisää tapahtumankuuntelija Poista Tilaus -painikkeelle
    div.querySelector('.delete-btn').addEventListener('click', () => {
      orderToDelete = order; // Asettaa poistettavan tilauksen
      deleteConfirmModal.classList.remove('hidden'); // Näyttää poiston varoitusikkunan
    });

    rejectedList.appendChild(div); // Lisää tilauksen listaan
  });
}

/* Tietojen tallentaminen paikalliseen säilytykseen */
// Tallentaa tilaukset paikalliseen säilytykseen (localStorage)
function saveDataToStorage() {
  localStorage.setItem('orders', JSON.stringify(ordersData)); // Muuntaa tilaukset JSON-muotoon ja tallentaa localStorageen
}

/* Tietojen lataaminen paikallisesta säilytyksestä */
// Lataa tilaukset paikallisesta säilytyksestä (localStorage)
function loadDataFromStorage() {
  const o = localStorage.getItem('orders'); // Hakee tilaukset localStoragesta
  if (o) {
    ordersData = JSON.parse(o); // Muuntaa JSON-muotoisen datan takaisin objektiksi
  }
  // Varmistaa, että kaikilla tuotteilla on valittu määrä, jos niitä ei ole alustettu
  ordersData.forEach(order => {
    if (order.products) {
      order.products.forEach(p => {
        if (p.selectedQty == null) p.selectedQty = 0; // Asettaa valitun määrän 0:ksi, jos se on null
      });
    }
  });
}

/* Päivämäärän muotoilu */
// Muuntaa ISO-muotoisen päivämäärän suomalaiseen muotoon (pp-kk-vvvv)
function formatDate(isoString) {
  const date = new Date(isoString); // Luo Date-objektin ISO-merkkijonosta
  const day = String(date.getDate()).padStart(2, '0'); // Hakee päivän ja lisää nollan alkuun, jos tarpeen
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Hakee kuukauden (lisää 1, koska kuukausi alkaa 0:sta) ja lisää nollan alkuun, jos tarpeen
  const year = date.getFullYear(); // Hakee vuoden
  return `${day}-${month}-${year}`; // Palauttaa muotoillun päivämäärän
}
