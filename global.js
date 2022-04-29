// TODO Add auto cycle end when exiting lesson
// TODO Add option to end cycle
// ---- READY TO USE ----
// TODO Add support for final challenges
// TODO Add better description
// TODO Add promotional banners
// TODO Add better screenshots
// TODO Improve readme
// ---- READY TO MARKET ----
// TODO Update button icon to pull from images
// TODO Change selection based on errors
// TODO Add click event to icon
// TODO Add options

const getProbability = (lesson, index, finalLevelCount) => {
  let studied = lesson.finishedLevels * 6 + lesson.finishedLessons + 1;
  if (lesson.hasFinalLevel) studied += (finalLevelCount - index) * 9;
  return 1 / Math.pow(studied, 0.8);
};

const selectLesson = (lessons) => {
  const finalLevelCount = lessons.filter(
    (lesson) => lesson.hasFinalLevel
  ).length;
  let probabilitySum = 0;
  lessons.forEach((lesson, index) => {
    probabilitySum += getProbability(lesson, index, finalLevelCount);
  });
  const selection = Math.random() * probabilitySum;
  let probability = 0;
  for (let i = 0; i < lessons.length; i++) {
    const lesson = lessons[i];
    probability += getProbability(lesson, i, finalLevelCount);
    if (selection < probability) return lesson;
  }
};

const startLesson = (lessons) => {
  const lesson = selectLesson(lessons);
  window.location.href = `https://www.duolingo.com/skill/${lesson.learningLanguage}/${lesson.urlName}/practice`;
};

const getLessons = () => {
  const state = JSON.parse(localStorage.getItem("duo.state"));
  console.log(state);
  const lessons = [];
  const skills = state.skills;
  Object.keys(skills).forEach((key) => {
    const lesson = skills[key];
    if (lesson.accessible) lessons.push(lesson);
  });
  return lessons;
};

const getMistakeCount = () => {
  const state = JSON.parse(localStorage.getItem("duo.state"));
  return state.user.mistakeCountInfo.mistakeCount;
};

const start = () => {
  chrome.storage.sync.set({ running: true });
};

const stop = () => {
  chrome.storage.sync.set({ running: false });
};

const tick = () => {
  chrome.storage.sync.get("running", (data) => {
    if (!data.running) return;
    if (!window.location.href.includes("/learn")) return;

    // Checking if has 10 mistakes
    const mistakeCount = getMistakeCount();
    if (mistakeCount >= 10) {
      window.location.href = "/mistakes-review";
      return;
    }

    // Starting generic lesson
    const lessons = getLessons();
    startLesson(lessons);
  });
};
