const { ipcRenderer } = require('electron');

// DOM elements
const statusText = document.getElementById('statusText');
const statusIndicator = document.getElementById('statusIndicator');
const hostname = document.getElementById('hostname');
const port = document.getElementById('port');
const addressList = document.getElementById('addressList');
const clientCount = document.getElementById('clientCount');
const streamingStatus = document.getElementById('streamingStatus');
const startStreamBtn = document.getElementById('startStreamBtn');
const stopStreamBtn = document.getElementById('stopStreamBtn');
const clientsList = document.getElementById('clientsList');
const resolution = document.getElementById('resolution');
const fps = document.getElementById('fps');

let clients = new Map();
let isStreaming = false;

// Initialize
async function init() {
  const info = await ipcRenderer.invoke('get-server-info');
  updateServerInfo(info);
}

// Update server info
function updateServerInfo(info) {
  if (!info) return;

  hostname.textContent = info.hostname;
  port.textContent = info.port;
  clientCount.textContent = info.clientCount;

  // Update addresses
  addressList.innerHTML = '';
  if (info.addresses && info.addresses.length > 0) {
    info.addresses.forEach(addr => {
      const li = document.createElement('li');
      li.textContent = `${addr}:${info.port}`;
      addressList.appendChild(li);
    });
  }

  // Update streaming status
  isStreaming = info.isStreaming;
  updateStreamingStatus();
}

// Update streaming status UI
function updateStreamingStatus() {
  if (isStreaming) {
    streamingStatus.innerHTML = '<span class="stream-indicator">🔴</span><span>Streaming Active</span>';
    startStreamBtn.disabled = true;
    stopStreamBtn.disabled = false;
  } else {
    streamingStatus.innerHTML = '<span class="stream-indicator">⚫</span><span>Not Streaming</span>';
    startStreamBtn.disabled = false;
    stopStreamBtn.disabled = true;
  }
}

// Start streaming
startStreamBtn.addEventListener('click', async () => {
  const config = {
    resolution: resolution.value,
    fps: parseInt(fps.value)
  };

  const result = await ipcRenderer.invoke('start-streaming', config);
  if (result.success) {
    isStreaming = true;
    updateStreamingStatus();
  } else {
    alert('Failed to start streaming: ' + result.error);
  }
});

// Stop streaming
stopStreamBtn.addEventListener('click', async () => {
  const result = await ipcRenderer.invoke('stop-streaming');
  if (result.success) {
    isStreaming = false;
    updateStreamingStatus();
  } else {
    alert('Failed to stop streaming: ' + result.error);
  }
});

// Handle server status updates
ipcRenderer.on('server-status', (event, status) => {
  if (status.running) {
    statusText.textContent = 'Server Running';
    statusIndicator.querySelector('.status-dot').style.background = '#28a745';
  } else {
    statusText.textContent = 'Server Stopped';
    statusIndicator.querySelector('.status-dot').style.background = '#dc3545';
  }
});

// Handle client connected
ipcRenderer.on('client-connected', (event, clientInfo) => {
  clients.set(clientInfo.id, clientInfo);
  updateClientsList();
  updateClientCount();
});

// Handle client disconnected
ipcRenderer.on('client-disconnected', (event, clientId) => {
  clients.delete(clientId);
  updateClientsList();
  updateClientCount();
});

// Update clients list UI
function updateClientsList() {
  if (clients.size === 0) {
    clientsList.innerHTML = '<p class="empty-state">No clients connected</p>';
    return;
  }

  clientsList.innerHTML = '';
  clients.forEach((client, id) => {
    const clientDiv = document.createElement('div');
    clientDiv.className = 'client-item';
    clientDiv.innerHTML = `
      <div class="client-info">
        <p><strong>Client ID:</strong> ${id}</p>
        <p><strong>IP:</strong> ${client.ip}</p>
        <p><strong>Connected:</strong> ${new Date(client.connectedAt).toLocaleString()}</p>
      </div>
      <div class="client-status">Connected</div>
    `;
    clientsList.appendChild(clientDiv);
  });
}

// Update client count
function updateClientCount() {
  clientCount.textContent = clients.size;
}

// Refresh server info periodically
setInterval(async () => {
  const info = await ipcRenderer.invoke('get-server-info');
  updateServerInfo(info);
}, 5000);

// Initialize on load
init();
