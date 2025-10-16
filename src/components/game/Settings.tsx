import { useGameState } from "../../lib/stores/useGameState";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export default function Settings() {
  const { setGamePhase } = useGameState();

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-900 via-amber-900 to-black flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <h1 className="text-4xl font-bold text-center text-amber-200 mb-8">
          Настройки
        </h1>
        
        <Card className="bg-black/60 border-amber-600">
          <CardHeader>
            <CardTitle className="text-amber-200">Игровые настройки</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-300 text-center py-8">
                Настройки в разработке
              </p>
              
              <div className="mt-12 pt-8 border-t border-amber-800/50">
                <div className="flex justify-between items-end">
                  <div className="text-gray-400 text-sm">
                    Студия Марка Минченко
                  </div>
                  <div className="text-gray-500 text-xs">
                    v.2.8. (beta) [build 31027]
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <Button 
            onClick={() => setGamePhase('menu')}
            variant="outline"
            className="border-gray-500 text-gray-300"
          >
            Назад в меню
          </Button>
        </div>
      </div>
    </div>
  );
}
