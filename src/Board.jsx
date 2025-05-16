import { useEffect, useState } from "react";
import Card from "./Card";

export default function Board() {
  const [cards, setCards] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [matchedImgs, setMatchedImgs] = useState([]);
  const [attempts, setAttempts] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [timer, setTimer] = useState(0);
  const [ranking, setRanking] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  const isGameCompleted = matchedImgs.length === 8;

  // 🌓 Restaurar modo escuro ao carregar
  useEffect(() => {
    const savedDark = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDark);
  }, []);

  // ⏱ Cronômetro
  useEffect(() => {
    let id;
    if (startTime && !isGameCompleted) {
      id = setInterval(() => {
        setTimer(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(id);
  }, [startTime, isGameCompleted]);

  // 📥 Carrega ranking
  useEffect(() => {
    const savedRanking = JSON.parse(localStorage.getItem("ranking_hp")) || [];
    setRanking(savedRanking);
  }, []);

  // 🏆 Salva no ranking
  useEffect(() => {
    if (isGameCompleted) {
      setTimeout(() => {
        const name = prompt("Parabéns! Digite seu nome para o ranking:");
        if (!name) return;

        const scoreData = {
          name,
          time: timer,
          attempts,
          score: Math.max(0, 1000 - (attempts * 10 + timer * 2)),
        };

        const saved = JSON.parse(localStorage.getItem("ranking_hp")) || [];
        const updated = [...saved, scoreData]
          .sort((a, b) => b.score - a.score)
          .slice(0, 5);

        localStorage.setItem("ranking_hp", JSON.stringify(updated));
        setRanking(updated);
      }, 300);
    }
  }, [isGameCompleted, timer, attempts]);

  function buildCards() {
    const harryPotterImgs = [
        "/images/harry.jpg",
        "/images/hermione.jpg",
        "/images/dumbledore.jpg",
        "/images/luna.jpg",
        "/images/malfoy.jpg",
        "/images/ronny.jpg",
        "/images/snape.jpg",
        "/images/voldemort.jpg",
      ];

    let vetCards = [];
    let id = 0;
    for (let img of harryPotterImgs) {
      vetCards.push({ id: id++, img, isOpen: true });
      vetCards.push({ id: id++, img, isOpen: true });
    }

    vetCards = vetCards.sort(() => Math.random() - 0.5);
    setCards(vetCards);
    setSelectedCards([]);
    setMatchedImgs([]);
    setAttempts(0);
    setTimer(0);
    setStartTime(Date.now());

    setTimeout(() => {
      const closedCards = vetCards.map((card) => ({ ...card, isOpen: false }));
      setCards(closedCards);
    }, 1000);
  }

  useEffect(() => {
    buildCards();
  }, []);

  function onClick(card) {
    if (
      selectedCards.length === 2 ||
      card.isOpen ||
      matchedImgs.includes(card.img)
    )
      return;

    const updatedCards = cards.map((c) =>
      c.id === card.id ? { ...c, isOpen: true } : c
    );
    setCards(updatedCards);

    const newSelected = [...selectedCards, card];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      setAttempts((prev) => prev + 1);

      const [first, second] = newSelected;
      if (first.img === second.img) {
        setMatchedImgs([...matchedImgs, first.img]);
        setSelectedCards([]);
      } else {
        setTimeout(() => {
          const revertedCards = updatedCards.map((c) =>
            c.id === first.id || c.id === second.id
              ? { ...c, isOpen: false }
              : c
          );
          setCards(revertedCards);
          setSelectedCards([]);
        }, 800);
      }
    }
  }

  const score = isGameCompleted
    ? Math.max(0, 1000 - (attempts * 10 + timer * 2))
    : null;

  function toggleDarkMode() {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", newMode);
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-br from-purple-800 via-indigo-700 to-blue-800 text-black"
      } p-6 flex flex-col items-center`}
    >
      <div className="flex justify-between items-center w-full max-w-lg mb-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold drop-shadow-lg">
          Jogo da Memória - Harry Potter
        </h1>
        <button
          onClick={toggleDarkMode}
          className="ml-4 text-sm bg-gray-800 text-white px-3 py-1 rounded hover:bg-gray-700 transition"
        >
          {darkMode ? "☀️ Claro" : "🌙 Escuro"}
        </button>
      </div>

      <div
        className={`w-full max-w-lg rounded-xl shadow-lg p-6 transition ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <div>
            <div>
              ⏱ Tempo:{" "}
              <span className="font-bold text-indigo-400">{timer}s</span>
            </div>
            <div>
              💡 Tentativas:{" "}
              <span className="font-bold text-indigo-400">{attempts}</span>
            </div>
          </div>
          <button
            onClick={buildCards}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg shadow-md transition"
          >
            Resetar
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {cards.map((e, idx) => (
            <Card
              key={idx}
              img={e.img}
              id={e.id}
              isOpen={e.isOpen}
              matched={matchedImgs.includes(e.img)}
              onClick={onClick}
            />
          ))}
        </div>

        {isGameCompleted && (
          <div className="mt-6 p-4 bg-green-200 text-green-800 rounded text-center font-bold text-xl shadow-lg">
            🎉 Parabéns! Você completou o jogo!
            <div className="mt-2 text-lg text-green-700">
              Tempo: {timer}s • Tentativas: {attempts} • Pontuação: {score}
            </div>
          </div>
        )}

        {ranking.length > 0 && (
          <div className="mt-6">
            <h2 className="text-center text-xl font-bold text-indigo-500 mb-2">
              🏆 Ranking dos Melhores
            </h2>
            <ul className="bg-indigo-50 dark:bg-gray-700 p-4 rounded shadow">
              {ranking.map((player, index) => (
                <li key={index} className="mb-1">
                  <span className="font-semibold">{index + 1}º</span> —{" "}
                  {player.name} • ⏱ {player.time}s • 🎯 {player.attempts} tentativas •{" "}
                  <span className="font-bold text-green-600 dark:text-green-300">
                    ⭐ {player.score} pts
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
