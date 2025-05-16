export default function Card({ id, img, isOpen, matched, onClick }) {
    function click() {
      onClick({ id, img });
    }
  
    return (
      <div
        onClick={click}
        className={`relative cursor-pointer rounded-lg shadow-md overflow-hidden select-none ${
          isOpen ? "border-4 border-indigo-500" : "border border-gray-300"
        } ${matched ? "ring-4 ring-green-400 ring-opacity-75" : ""}`}
      >
        {isOpen ? (
          <img
            src={img}
            alt="Carta"
            className="w-26 h-26 object-cover object-center rounded-lg"
            draggable={false}
          />
        ) : (
          <div className="flex items-center justify-center w-26 h-26 bg-indigo-100 rounded-lg text-indigo-400 text-4xl font-bold select-none">
            ?
          </div>
        )}
      </div>
    );
  }
  