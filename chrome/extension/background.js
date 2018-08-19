import BigNumber from 'bignumber.js';

const base = 10000;
let poller = undefined;

const loadVTHO = account => {
  return fetch(`https://explore.veforge.com/api/accounts/${account}`)
  .then((response) => {
    return response.json();
  })
};

const formatNum = energy => {
  const num = new BigNumber(energy);
  const formattedNumber = (num.c[0] / base).toFixed(2);

  return formattedNumber;
};

const pollVTHO = (account, port) => {
  poller = window.setInterval(() => {
    loadVTHO(account).then(({ energy }) => {
      const formattedNumber = formatNum(energy);

      if (port) {
        port.postMessage({ balance: formattedNumber });
      }
      
      chrome.browserAction.setTitle({ title: `Balance: ${formattedNumber}` });
      chrome.storage.local.set({ "balance": formattedNumber });
    });
  }, 10000);

  if (port) {
    port.onDisconnect.addListener(() => {
      port = null;
    });
  }
};

chrome.runtime.onConnect.addListener((port) => {

  chrome.runtime.onMessage.addListener(({ account }, sender, sendResponse) => {
    window.clearInterval(poller);
    chrome.storage.local.set({ "account": account });

    if (account.startsWith("0x")) {
      loadVTHO(account).then(({ energy }) => {
        const formattedNumber = formatNum(energy);

        sendResponse({ balance: formattedNumber });
        pollVTHO(account, port);
      });
    }
    return true; 
  });

  chrome.storage.local.get(['account', 'balance'], ({ account, balance }) => {
    if (account && account.startsWith("0x")) {
      port.postMessage({ balance: balance });
      pollVTHO(account, port);
    }
  });

  port.onDisconnect.addListener(() => {
    port = null;
  });
});

