import { useEffect, useRef, useState } from "react";

export default function App() {
  const gameAreaRef = useRef(null);
  const dinoRef = useRef(null);
  const obstacleRef = useRef(null);

  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  const dino = useRef({ bottom: 0, velocity: 0, jumping: false });
  const obstacle = useRef({ left: 800 });

  const gravity = 0.6;
  const jumpForce = 12;
  const obstacleSpeed = 6;
  const groundHeight = 0;

  const jump = () => {
    if (!dino.current.jumping && !isGameOver) {
      dino.current.jumping = true;
      dino.current.velocity = jumpForce;
    }
  };

  useEffect(() => {
    let animationFrame;

    const update = () => {
      dino.current.velocity -= gravity;
      dino.current.bottom += dino.current.velocity;

      if (dino.current.bottom <= groundHeight) {
        dino.current.bottom = groundHeight;
        dino.current.velocity = 0;
        dino.current.jumping = false;
      }

      if (dinoRef.current) {
        dinoRef.current.style.bottom = `${dino.current.bottom}px`;
      }

      obstacle.current.left -= obstacleSpeed;
      if (obstacle.current.left < -30) {
        obstacle.current.left = 800;
        setScore((s) => s + 1);
      }

      if (obstacleRef.current) {
        obstacleRef.current.style.left = `${obstacle.current.left}px`;
      }

      if (
        obstacle.current.left < 60 &&
        obstacle.current.left > 0 &&
        dino.current.bottom < 40
      ) {
        setIsGameOver(true);
      }

      if (!isGameOver) animationFrame = requestAnimationFrame(update);
    };

    animationFrame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationFrame);
  }, [isGameOver]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "Space") jump();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isGameOver]);

  useEffect(() => {
    const handleTouch = () => jump();
    window.addEventListener("touchstart", handleTouch);
    window.addEventListener("click", handleTouch);
    return () => {
      window.removeEventListener("touchstart", handleTouch);
      window.removeEventListener("click", handleTouch);
    };
  }, [isGameOver]);

  const resetGame = () => {
    setIsGameOver(false);
    setScore(0);
    dino.current.bottom = 0;
    dino.current.velocity = 0;
    dino.current.jumping = false;
    obstacle.current.left = 800;

    if (dinoRef.current) dinoRef.current.style.bottom = "0px";
    if (obstacleRef.current) obstacleRef.current.style.left = "800px";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-200 to-blue-500 p-4">
 
      <div className="text-2xl md:text-3xl font-bold text-white mb-6 select-none">
        Score: {score}
      </div>


      <div
        ref={gameAreaRef}
        className="relative w-full max-w-2xl h-[220px] md:h-[300px] bg-green-100 rounded-xl shadow-2xl overflow-hidden border-2 border-green-400"
      >
    
        <div
          ref={dinoRef}
          className="absolute left-5 w-12 h-12 md:w-16 md:h-16 bg-green-700 rounded-xl shadow-lg transition-all duration-75"
          style={{ bottom: `${dino.current.bottom}px` }}
        ></div>

     
        {!isGameOver && (
          <div
            ref={obstacleRef}
            className="absolute w-8 h-16 md:w-12 md:h-20 bg-gray-800 rounded-lg shadow-md"
            style={{ left: `${obstacle.current.left}px`, bottom: "0px" }}
          ></div>
        )}

 
        <div className="absolute bottom-0 w-full h-3 md:h-4 bg-green-700"></div>

  
        {isGameOver && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center text-white rounded-xl p-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Game Over</h1>
            <p className="text-xl md:text-2xl mb-4">Score: {score}</p>
            <button
              onClick={resetGame}
              className="bg-white text-green-700 px-6 py-2 md:px-8 md:py-3 rounded-lg font-semibold hover:bg-green-200 transition-all"
            >
              Restart
            </button>
            <p className="mt-3 text-sm opacity-80">
              Press Space or tap Jump 🦖
            </p>
          </div>
        )}
      </div>


      <div className="flex gap-4 mt-6 flex-wrap justify-center">
        {!isGameOver && (
          <>
            <button
              onClick={jump}
              className="bg-green-600 text-white px-6 py-3 md:px-8 md:py-4 rounded-xl shadow-lg hover:bg-green-700 transition-all"
            >
              Jump
            </button>
            <button
              onClick={resetGame}
              className="bg-red-600 text-white px-6 py-3 md:px-8 md:py-4 rounded-xl shadow-lg hover:bg-red-700 transition-all"
            >
              Restart
            </button>
          </>
        )}
      </div>


      <div className="mt-6 text-white text-sm md:text-base select-none">
        Developed by{" "}
        <a
          href="https://nazmul-haque-rahat.web.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold hover:text-yellow-300 transition-colors"
        >
          Nazmul Haque Rahat
        </a>
      </div>
    </div>
  );
}
