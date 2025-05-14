import { Icon } from "@iconify/react";
import Board from "./Board";

function App() {

  return (
    <>
      <div className="flex items-center gap-2 bg-gray-200 m-1 p-2 rounded">
        <Icon icon="game-icons:card-random" className="text-2xl" />
        <div>
          Jogo da Memória
        </div>
      </div>
      <Board />
    </>
  )
}

export default App
