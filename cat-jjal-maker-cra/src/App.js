import Title from "./component/Title";
import logo from "./logo.svg";
import React from "react";
import "./App.css";

const jsonLocalStorage = {
  setItem: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  getItem: (key) => {
    return JSON.parse(localStorage.getItem(key));
  },
};

const fetchCat = async (text) => {
  const OPEN_API_DOMAIN = "https://cataas.com";
  const response = await fetch(`${OPEN_API_DOMAIN}/cat/says/${text}?json=true`);
  const responseJson = await response.json();
  return `${OPEN_API_DOMAIN}/${responseJson.url}`;
};

//컴포넌트(함수)는 반드시 대문자로 시작
function CatItem(props) {
  // == props대신 {img}
  return (
    <li>
      <img src={props.img} style={{ width: "150px" }} />
    </li>
  );
}

function Favorites({ favorits }) {
  if (favorits.length === 0) {
    return <div>사진 위 하트를 눌러 고양이 사진을 저장해봐요!</div>;
  }
  return (
    <ul className="favorites">
      {favorits.map((cat) => (
        <CatItem img={cat} key={cat} /> // cat은 cats배열의 인자들이고 .map을 하면 순회하면서 반복처리함
      ))}
    </ul>
  );
}

const MainCard = ({ img, onHeartClick, alreadyFovorite }) => {
  const heartIcon = alreadyFovorite ? "💖" : "🤍";
  return (
    <div className="main-card">
      <img src={img} alt="고양이" width="400" />
      <button onClick={onHeartClick}>{heartIcon}</button>
    </div>
  );
};

const Form = ({ updatrMainCat }) => {
  //두개로 나눠서 방식
  // const counter = counterState[0]; // useState의 첫번째 인자는 값을 저장
  // const setCounter = counterState[1]; // useState의 두전째 인자는 값을 set할 수 있음
  const [value, setVaule] = React.useState("");
  const includesHangul = (text) => /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/i.test(text);
  const [errorMessage, setErrorMessage] = React.useState("");

  function handleInputChange(e) {
    const userValue = e.target.value;
    console.log(includesHangul(userValue)); //한글 들어있는지 여부
    setErrorMessage("");
    if (includesHangul(userValue)) {
      setErrorMessage("한글은 입력할 수 없습니다.");
    }
    setVaule(e.target.value.toUpperCase());
  }

  function handleFormSub(e) {
    e.preventDefault();
    setErrorMessage("");
    if (value === "") {
      setErrorMessage("빈 값으로는 만들 수 없습니다.");
      return;
    }
    updatrMainCat(value);
  }

  return (
    <form onSubmit={handleFormSub}>
      <input
        type="text"
        name="name"
        placeholder="영어 대사를 입력해주세요"
        value={value}
        onChange={handleInputChange}
      />
      <button type="submit">생성</button>
      <p style={{ color: "red" }}>{errorMessage}</p>
    </form>
  );
};

const App = () => {
  const CAT1 = "https://cataas.com/cat/60b73094e04e18001194a309/says/react";
  const CAT2 = "https://cataas.com//cat/5e9970351b7a400011744233/says/inflearn";
  const CAT3 =
    "https://cataas.com/cat/595f280b557291a9750ebf65/says/JavaScript";

  const [counter, setCounter] = React.useState(() => {
    return jsonLocalStorage.getItem("counter");
  });

  console.log(jsonLocalStorage.getItem("counter") === null ? "true" : "false");

  const [mainCatCard, setCatCard] = React.useState(CAT1);

  // const [favorits, setFavorits] = React.useState(
  //   jsonLocalStorage.getItem("favorits") || []
  // );

  const [favorits, setFavorits] = React.useState(() => {
    return jsonLocalStorage.getItem("favorits") || [];
  });

  const alreadyFovorite = favorits.includes(mainCatCard);

  async function setInitialCat() {
    const newCat = await fetchCat("First cat");
    console.log(newCat);
    setCatCard(newCat);
  }

  React.useEffect(() => {
    //함수를 초기에 한번만 부르도록 만듬 React.useEffect
    setInitialCat();
  }, []);

  async function updatrMainCat(value) {
    const newCat = await fetchCat(value);

    setCatCard(newCat);

    setCounter((prev) => {
      const nextCounter = prev + 1;
      jsonLocalStorage.setItem("counter", nextCounter);
      return nextCounter;
    });
  }

  function handleHeartClick() {
    // handle로 시작하는게 관례
    const nextFavorites = [...favorits, mainCatCard];
    setFavorits(nextFavorites);
    jsonLocalStorage.setItem("favorits", nextFavorites);
  }

  const counterTitle = counter === null ? "" : counter + "번째 ";

  return (
    <div>
      <Title>{counterTitle}고양이 가라사대</Title>
      <Form updatrMainCat={updatrMainCat} />
      <MainCard
        img={mainCatCard}
        onHeartClick={handleHeartClick}
        alreadyFovorite={alreadyFovorite}
      />
      <Favorites favorits={favorits} />
    </div>
  );
};

export default App;
