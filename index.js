const { name, random } = faker;

class Gladiator {
  constructor(health, power, speed, name) {
    this.health = health;
    this.power = power;
    this.speed = speed;
    this.name = name;
    this.initialHealth = health;
    this.initialPower = power;
    this.initialSpeed = speed;
  }
}
let gladiators = [];
const rNum = (min, max, precision) =>
  random.number({
    min,
    max,
    precision,
  });
const createGladiators = (numberOfGladiators) => {
  for (let i = 0; i < numberOfGladiators; i++) {
    gladiators = [
      ...gladiators,
      new Gladiator(
        rNum(80, 100, 1),
        rNum(2, 5, 0.1),
        rNum(1, 5, 0.001),
        name.findName()
      ),
    ];
  }
};

const speedCorrection = () => {
  gladiators.forEach(
    (gladiator) =>
      (gladiator.speed =
        gladiator.initialSpeed * (gladiator.health / gladiator.initialHealth))
  );
};

let stopGame = false;
const cesarDecide = (gladiator, index) => {
  const frags = document.querySelector(".frags");
  // const die = document.querySelector(".die");
  // live.disabled = false;
  // die.disabled = false;
  const list = document.querySelector(".list");
  const li = document.createElement("li");
  li.style.color = "yellow";
  li.style.fontWeight = 900;
  li.style.paddingTop = "5px";
  li.style.paddingBottom = "5px";
  const answer = random.number(1);
  if (answer === 0) {
    li.innerText = `Caesar showed 👎 to [${gladiator.name} x${gladiator.health}]`;
    list.appendChild(li);
    gladiators = gladiators.filter((warrior) => warrior != gladiator);
  } else if (answer === 1) {
    li.innerText = `Caesar showed 👍 to [${gladiator.name} x${gladiator.health}]`;
    list.appendChild(li);
    gladiator.health = +gladiator.health + 50;
  }
  frags.scrollTop = 9999;
  // speedCorrection();
  stopGame = false;
};

getRandomIndex = (index) => {
  const randomIndex = random.number(gladiators.length - 1);
  if (randomIndex === index) {
    return getRandomIndex(index);
  } else {
    return randomIndex;
  }
};
const addToList = (randomGladiator, index) => {
  const frags = document.querySelector(".frags");
  const list = document.querySelector(".list");
  const li = document.createElement("li");
  li.innerText = `[${gladiators[index].name} x${gladiators[index].health}] hits [${randomGladiator.name} x${randomGladiator.health}]`;
  list.appendChild(li);
  frags.scrollTop = 9999;
};

const hit = (randomGladiator, index) => {
  addToList(randomGladiator, index);
  randomGladiator.health = (+(
    randomGladiator.health - gladiators[index].power
  )).toFixed(1);
};
const checkHealth = (index) => {
  if (gladiators.some((gladiator) => gladiator.health <= 0)) {
    stopGame = true;
    cesarDecide(
      gladiators.find((gladiator) => gladiator.health <= 0),
      index
    );
    return true;
  }
  if (gladiators.some((gladiator) => gladiator.health <= 30)) {
    stopGame = true;
    const currentGladiators = gladiators.filter(
      (gladiator) => gladiator.health <= 30
    );
    currentGladiators.forEach((gladiator) => {
      if (gladiator.power === gladiator.initialPower) {
        gladiator.power = (gladiator.power * 3).toFixed(1);
      }
    });
    stopGame = false;
  }
};
const fight = (index) => {
  if (stopGame) {
    return;
  }
  if (gladiators.length <= 1) {
    const frags = document.querySelector(".frags");
    const list = document.querySelector(".list");
    const li = document.createElement("li");
    const start = document.querySelector(".start");
    li.style.color = "yellow";
    li.style.fontWeight = 900;
    li.style.fontSize = "40px";
    li.style.paddingTop = "10px";
    li.style.paddingBottom = "10px";
    li.innerText = `${gladiators[0].name} won`;
    list.appendChild(li);
    frags.scrollTop = 9999;
    start.disabled = false;
    stopGame = true;
    return;
  }
  const randomIndex = getRandomIndex(index);
  const randomGladiator = gladiators[randomIndex];
  if (gladiators[index]) {
    hit(randomGladiator, index);
  }
  checkHealth(index);

  if (gladiators[index]) {
    setTimeout(fight, 5000 / gladiators[index].speed, index);
  }
};

createGladiators(random.number({ min: 2, max: 4 }));

const play = () => {
  const start = document.querySelector(".start");
  start.disabled = true;

  if (stopGame) {
    return;
  }
  gladiators.forEach((gladiator, index) => {
    fight(index);
  });
};

// play();
