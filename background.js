setInterval(() => init(), 500);

setInterval(() => tick(), 500);

const addButton = () => {
  // Add Button
  if (document.getElementById("dsr-button")) return;
  const button = document.createElement("button");
  button.id = "dsr-button";
  button.classList.add("dsr_button");
  const img = new Image();
  img.src = "https://i.imgur.com/vKVcjYZ.png";
  img.style.height = "62%";
  button.appendChild(img);
  button.addEventListener("click", () => {
    start();
  });
  var element = document.querySelector("[title='Practice']");
  if (!element) return;
  var parent = element.parentElement;
  parent.style.display = "flex";
  parent.appendChild(button);
};

const addCloseEvent = () => {
  const exitButton = document.querySelector("[data-test='quit-button']");
  if (!exitButton) return false;
  exitButton.addEventListener("click", () => {
    stop();
  });
};

const init = () => {
  addButton();
  addCloseEvent();
};
