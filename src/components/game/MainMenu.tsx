import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameState } from "../../lib/stores/useGameState";
import { useAudio } from "../../lib/stores/useAudio";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const backgroundImages = [
  "/images/russian_civil_war_19_d128b301.jpg",
  "/images/russian_civil_war_19_d9762813.jpg",
  "/images/russian_civil_war_19_e3b79226.jpg",
  "/images/russian_civil_war_19_dc587496.jpg",
  "/images/russian_civil_war_19_d36a060a.jpg",
];

export default function MainMenu() {
  const { setGamePhase } = useGameState();
  const { backgroundMusic, setBackgroundMusic, isMuted, toggleMute } = useAudio();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!backgroundMusic) {
      const music = new Audio("/sounds/background.mp3");
      music.loop = true;
      music.volume = 0.3;
      setBackgroundMusic(music);
      
      if (!isMuted) {
        music.play().catch(err => console.log("Background music autoplay prevented:", err));
      }
    } else {
      if (isMuted) {
        backgroundMusic.pause();
      } else {
        backgroundMusic.play().catch(err => console.log("Background music play prevented:", err));
      }
    }
  }, [backgroundMusic, setBackgroundMusic, isMuted]);

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentImageIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2 }}
          className="absolute inset-0"
        >
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: `url(${backgroundImages[currentImageIndex]})`,
              filter: 'grayscale(100%) brightness(0.4)'
            }}
          />
          <div className="absolute inset-0 bg-black/60" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute top-4 right-4 z-20">
        <Button
          onClick={toggleMute}
          variant="outline"
          size="sm"
          className="bg-black/60 border-amber-600 text-amber-200 hover:bg-black/80 font-semibold"
        >
          {isMuted ? "SOUND OFF" : "SOUND ON"}
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="relative z-10"
      >
        <Card className="w-full max-w-md mx-4 bg-black/90 border-amber-800 border-2 shadow-2xl">
          <CardHeader className="text-center border-b border-amber-800/50 pb-6">
            <motion.div
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <CardTitle className="text-5xl font-bold text-amber-100 tracking-wider mb-2">
                RUSSIAN CIVIL WAR
              </CardTitle>
              <p className="text-2xl text-red-400 font-semibold">1917 - 1923</p>
              <div className="mt-2 h-px bg-gradient-to-r from-transparent via-amber-600 to-transparent" />
            </motion.div>
          </CardHeader>
          
          <CardContent className="space-y-4 pt-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Button 
                onClick={() => setGamePhase('faction_select')}
                className="w-full bg-gradient-to-b from-red-700 via-red-800 to-red-950 hover:from-red-800 hover:via-red-900 hover:to-black text-white font-bold py-6 text-xl border-2 border-red-600 shadow-[inset_0_2px_4px_rgba(255,255,255,0.2),0_4px_8px_rgba(0,0,0,0.8)] hover:shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),0_6px_12px_rgba(0,0,0,0.9)] transition-all"
                size="lg"
              >
                НАЧАТЬ БОЙ
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <Button 
                onClick={() => setGamePhase('decks')}
                className="w-full bg-gradient-to-b from-blue-800 via-blue-900 to-blue-950 hover:from-blue-900 hover:via-blue-950 hover:to-black text-white font-bold py-6 text-xl border-2 border-blue-700 shadow-[inset_0_2px_4px_rgba(255,255,255,0.2),0_4px_8px_rgba(0,0,0,0.8)] hover:shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),0_6px_12px_rgba(0,0,0,0.9)] transition-all"
                size="lg"
                variant="secondary"
              >
                СОБРАТЬ КОЛОДУ
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <Button 
                onClick={() => setGamePhase('settings')}
                className="w-full bg-gradient-to-b from-gray-700 via-gray-800 to-gray-950 hover:from-gray-800 hover:via-gray-900 hover:to-black text-white font-bold py-6 text-xl border-2 border-gray-600 shadow-[inset_0_2px_4px_rgba(255,255,255,0.2),0_4px_8px_rgba(0,0,0,0.8)] hover:shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),0_6px_12px_rgba(0,0,0,0.9)] transition-all"
                size="lg"
                variant="secondary"
              >
                НАСТРОЙКИ
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-sm text-gray-400 text-center mt-8 pt-6 border-t border-amber-800/30"
            >
              <p className="mb-2 text-amber-200 font-semibold">Цели:</p>
              <p className="mb-1">• Уничтожить главную башню врага</p>
              <p className="mb-1">• Управлять ресурсами снабжения</p>
              <p>• Стратегия превыше всего</p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-gray-500 text-xs z-10">
        <p>Историческая карточная стратегия</p>
      </div>
    </div>
  );
}
