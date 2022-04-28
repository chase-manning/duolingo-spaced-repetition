let color = "#3aa757";

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ color });
  console.log("Default background color set to %cgreen", `color: ${color}`);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status == "complete") {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: init,
    });
  }
});

const init = () => {
  // Add Button
  const button = document.createElement("button");
  button.classList.add("dsr_button");
  const img = new Image();
  img.src = "https://i.imgur.com/vKVcjYZ.png";
  img.style.height = "62%";
  button.appendChild(img);
  button.addEventListener("click", () => {
    startSr();
  });
  var element = document.querySelector("[title='Practice']");
  var parent = element.parentElement;
  parent.style.display = "flex";
  parent.appendChild(button);
};
