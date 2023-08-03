const clientList = document.getElementById('clientList');
const popup = document.getElementById('popup');
const closeButton = document.getElementById('closeButton');
const filterSelect = document.getElementById('filterSelect');


async function fetchData() {
  try {
    const response = await fetch('http://localhost:3001/api/assignment');
    const data = await response.json();

    const clients = data.clients.map((client) => {

      if (client.name && !client.label) {
        client.label = client.name;
      }

      const clientData = data.data[client.id];

      if (clientData) {
        const { points, address } = clientData;
        return { ...client, points, address };
      } else {
        return { ...client, points: null, address: null };
      }
    });

  
    const uniqueClients = clients.filter((client, index, self) => {
      return index === self.findIndex((c) => c.label === client.label);
    });

    return uniqueClients;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}


function renderClientList(filteredClients) {
  clientList.innerHTML = '';
  filteredClients.forEach((client) => {
    const clientElement = document.createElement('div');
    clientElement.classList.add('client');
    clientElement.textContent = `${client.label}`;
    clientElement.addEventListener('click', () => showPopup(client));
    clientList.appendChild(clientElement);
  });
}


function showPopup(client) {
  const popupContent = `
    <h2>${client.label}</h2>
    <p>Points: ${client.points || 'N/A'}</p>
    <p>Address: ${client.address || 'N/A'}</p>
  `;
  popup.innerHTML = popupContent;
  popup.style.display = 'block';
}


function closePopup() {
  popup.style.display = 'none';
}


filterSelect.addEventListener('change', async () => {
  const selectedFilter = filterSelect.value;


  const clients = await fetchData();

  let filteredClients = clients;
  if (selectedFilter === 'managers') {
    filteredClients = clients.filter((client) => client.isManager);
  } else if (selectedFilter === 'nonManagers') {
    filteredClients = clients.filter((client) => !client.isManager);
  }

  renderClientList(filteredClients);
});


closeButton.addEventListener('click', closePopup);


(async () => {
  const clients = await fetchData();
  renderClientList(clients);
})();
