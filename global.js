// TODO Add better description
// TODO Add promotional banners
// TODO Add better screenshots
// TODO Improve readme
// TODO Add link to download to readme
// ---- READY TO MARKET ----
// TODO Update button icon to pull from images
// TODO Change selection based on errors
// TODO Add click event to icon
// TODO Add options
// TODO Add Firefox support

const DELTA = 0.8; // Used to adjust the steepness of the curve (higher = more steep)
const LEGENDARY_STEP = 9; // Used to adjust the steepness of the decay in legendary probability (higher = less legendaries)
const UNFINISHED_MULTIPLIER = 1.5; // Used to increase the probablity of a non-legendary being selected (1.5 = 50% more likely)
const UNLOCK_MULTIPLIER = 2; // Used to increase the probability of a skill that unlocks more skills (2 = 100% more likely)

const getProbability = (lesson, index, finalLevels, lessonCount) => {
  let studied = lesson.finishedLevels * 6 + lesson.finishedLessons + 1;
  if (lesson.hasFinalLevel) studied += (finalLevels - index) * LEGENDARY_STEP;
  const baseProbability = 1 / Math.pow(studied, DELTA);
  if (index === lessonCount - 1) return baseProbability * UNLOCK_MULTIPLIER;
  if (!lesson.hasFinalLevel) return baseProbability * UNFINISHED_MULTIPLIER;
  return baseProbability;
};

const selectLesson = (lessons) => {
  const finalLevelCount = lessons.filter(
    (lesson) => lesson.hasFinalLevel
  ).length;
  let probabilitySum = 0;
  lessons.forEach((lesson, index) => {
    probabilitySum += getProbability(
      lesson,
      index,
      finalLevelCount,
      lessons.length
    );
  });
  const selection = Math.random() * probabilitySum;
  let probability = 0;
  for (let i = 0; i < lessons.length; i++) {
    const lesson = lessons[i];
    probability += getProbability(lesson, i, finalLevelCount, lessons.length);
    if (selection < probability) return lesson;
  }
};

const startLesson = (lessons) => {
  const lesson = selectLesson(lessons);
  if (lesson.finishedLevels === 0) {
    window.location.href = `/skill/${lesson.learningLanguage}/${
      lesson.urlName
    }/${lesson.finishedLessons + 1}`;
  } else {
    window.location.href = `/skill/${lesson.learningLanguage}/${lesson.urlName}/practice`;
  }
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
