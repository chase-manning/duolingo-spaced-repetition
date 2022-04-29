// TODO Update button icon to pull from images
// TODO Add support for doing errors
// TODO Change selection based on errors
// TODO Deploy to Chrome
// TODO Add options
// TODO Add click event to icon
// TODO Add better description
// TODO Improve readme
// TODO Add better screenshots
// TODO Add promotional banners

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
  // chrome.storage.sync.get("boxes", (data) => {
  //   let boxes = data.boxes;
  //   if (!boxes || boxes.length !== lessons.length) {
  //     lessons.forEach((lesson) => {
  //       boxes.push(getLessonLevel(lesson));
  //     });
  //     chrome.storage.sync.set({ boxes });
  //   }
  //   console.log(boxes);
  // });

  const lesson = selectLesson(lessons);
  window.location.href = `https://www.duolingo.com/skill/${lesson.learningLanguage}/${lesson.urlName}/practice`;
};

const getLessons = () => {
  const state = JSON.parse(localStorage.getItem("duo.state"));
  const lessons = [];
  const skills = state.skills;
  Object.keys(skills).forEach((key) => {
    const lesson = skills[key];
    if (lesson.accessible) lessons.push(lesson);
  });
  return lessons;
};

const startSr = () => {
  const lessons = getLessons();
  startLesson(lessons);
};
