import { useSteamSavedGames } from "./hooks/steam";

function App() {
  const { data: savedGames } = useSteamSavedGames();
  console.log(savedGames);

  return (
    <div className="text-sm flex flex-col text-white font-mono w-[400px]">
      <header className="sticky bg-black/50 backdrop-blur-sm z-10 p-2 top-0 left-0 right-0 flex justify-between items-center border-b-2 border-white border-dashed pb-2">
        <h1 className="bg-white text-black px-2">#poutine</h1>
        <button>
          <span>🍟</span>
        </button>
      </header>
      <main className="text-sm p-2">
        <div className="flex justify-between items-center">
          <p>Steam Saved Games ({(savedGames || []).length})</p>
          <p className="text-xs opacity-50">
            files {savedGames?.reduce((acc, game) => acc + game.files, 0)}
          </p>
        </div>
        <ul className="text-xs">
          {savedGames?.map((game) => (
            <li key={game.name}>
              <a
                href={game.url}
                className="flex justify-between hover:underline cursor-pointer"
                target="_blank"
              >
                <div>
                  {game.name}
                  <span className="opacity-50">({game.size})</span>
                </div>
                {game.files}
              </a>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

export default App;
