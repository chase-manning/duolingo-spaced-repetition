// TODO Update button icon to pull from images
// TODO Add support for doing errors
// TODO Change selection based on errors
// TODO Deploy to Chrome

const startLesson = (lessons, index) => {
  lessons[index].children[0].click();
  const startButton = document.querySelector("[data-test='start-button']");
  startButton.click();
};

const getLessons = () => {
  const lessons = document.querySelectorAll("[data-test='skill']");
  const activeLessons = [];
  lessons.forEach((lesson) => {
    const text = lesson.children[0].children[0].children[1];
    const color = window.getComputedStyle(text).getPropertyValue("color");
    if (color === "rgb(60, 60, 60)") {
      activeLessons.push(lesson);
    }
  });
  return activeLessons;
};

const startSr = () => {
  const lessons = getLessons();
  startLesson(lessons, 0);
};
