import { useState, useEffect } from "react";
import { useGameState } from "../../lib/stores/useGameState";
import { getCardsByFaction, CardData } from "../../lib/cards";
import { saveDeck, getDecksByFaction, loadDeck, deleteDeck, SavedDeck } from "../../lib/deckStorage";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { Input } from "../ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";

export default function DeckBuilder() {
  const { setGamePhase, setPlayerDeck } = useGameState();
  const [currentFaction, setCurrentFaction] = useState<'whites' | 'reds'>('whites');
  const [selectedCards, setSelectedCards] = useState<CardData[]>([]);
  const [deckName, setDeckName] = useState("");
  const [savedDecks, setSavedDecks] = useState<SavedDeck[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showLoadDialog, setShowLoadDialog] = useState(false);
  
  const availableCards = getCardsByFaction(currentFaction);
  const DECK_SIZE = 8;

  useEffect(() => {
    setSavedDecks(getDecksByFaction(currentFaction));
    setSelectedCards([]);
  }, [currentFaction]);

  const addCard = (card: CardData) => {
    // Check if card is already in deck (no duplicates allowed)
    const cardExists = selectedCards.some(c => c.name === card.name);
    if (selectedCards.length < DECK_SIZE && !cardExists) {
      setSelectedCards([...selectedCards, card]);
    }
  };

  const removeCard = (index: number) => {
    setSelectedCards(selectedCards.filter((_, i) => i !== index));
  };

  const setAsActiveDeck = () => {
    if (selectedCards.length === DECK_SIZE) {
      saveDeck(`Active_${currentFaction}`, currentFaction, selectedCards);
      setPlayerDeck(selectedCards);
      setSavedDecks(getDecksByFaction(currentFaction));
      alert(`Колода установлена как активная для ${currentFaction === 'whites' ? 'Белой Армии' : 'Красной Армии'}`);
    }
  };

  const loadActiveDeck = (faction: 'whites' | 'reds') => {
    const decks = getDecksByFaction(faction);
    const activeDeck = decks.find(d => d.name === `Active_${faction}`);
    if (activeDeck) {
      const cards = loadDeck(activeDeck.id);
      return cards;
    }
    return null;
  };

  const fillWithRandom = () => {
    const remaining = DECK_SIZE - selectedCards.length;
    const randomCards = [];
    const tempDeck = [...selectedCards];
    
    for (let i = 0; i < remaining; i++) {
      // Filter available cards that are not already in the deck (unique cards only)
      const available = availableCards.filter(card => 
        !tempDeck.some(sc => sc.name === card.name)
      );
      
      if (available.length === 0) {
        // If no unique cards available, break
        break;
      }
      
      const randomCard = available[Math.floor(Math.random() * available.length)];
      randomCards.push(randomCard);
      tempDeck.push(randomCard);
    }
    
    setSelectedCards([...selectedCards, ...randomCards]);
  };

  const handleSaveDeck = () => {
    if (selectedCards.length === DECK_SIZE && deckName.trim()) {
      saveDeck(deckName, currentFaction, selectedCards);
      setSavedDecks(getDecksByFaction(currentFaction));
      setShowSaveDialog(false);
      setDeckName("");
    }
  };

  const handleLoadDeck = (deckId: string) => {
    const cards = loadDeck(deckId);
    if (cards) {
      setSelectedCards(cards);
      setShowLoadDialog(false);
    } else {
      alert("Failed to load deck. Some cards may have been removed or changed.");
    }
  };

  const handleDeleteDeck = (deckId: string) => {
    deleteDeck(deckId);
    setSavedDecks(getDecksByFaction(currentFaction));
  };

  const getCardColor = (card: CardData) => {
    if (card.faction === 'whites') return 'border-blue-400 bg-blue-900/20';
    return 'border-red-400 bg-red-900/20';
  };

  const getCardTypeColor = (type: string) => {
    return type === 'unit' ? 'bg-green-600' : 'bg-purple-600';
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-900 via-amber-900 to-black p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-amber-200 mb-2">
            Конструктор колод
          </h1>
          <div className="flex justify-center gap-4 mb-4">
            <Button 
              onClick={() => setCurrentFaction('whites')}
              variant={currentFaction === 'whites' ? 'default' : 'outline'}
              className={currentFaction === 'whites' ? 'bg-blue-600' : 'border-blue-400 text-blue-300'}
            >
              Белая Армия
            </Button>
            <Button 
              onClick={() => setCurrentFaction('reds')}
              variant={currentFaction === 'reds' ? 'default' : 'outline'}
              className={currentFaction === 'reds' ? 'bg-red-600' : 'border-red-400 text-red-300'}
            >
              Красная Армия
            </Button>
          </div>
          <p className="text-gray-300">
            Соберите колоду из {DECK_SIZE} карт ({selectedCards.length}/{DECK_SIZE})
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Available Cards */}
          <Card className="bg-black/60 border-amber-600">
            <CardHeader>
              <CardTitle className="text-amber-200">Available Cards</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-2">
                  {availableCards.map((card, index) => {
                    const isAlreadyInDeck = selectedCards.some(c => c.name === card.name);
                    return (
                      <Card 
                        key={`${card.name}-${index}`}
                        className={`cursor-pointer transition-all hover:scale-105 ${getCardColor(card)} ${isAlreadyInDeck ? 'opacity-50' : ''}`}
                        onClick={() => addCard(card)}
                      >
                        <CardContent className="p-3">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-white">{card.name} {isAlreadyInDeck && '✓'}</h4>
                            <div className="flex gap-2">
                              <Badge className={getCardTypeColor(card.type)}>
                                {card.type}
                              </Badge>
                              <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                                Cost: {card.cost}
                              </Badge>
                            </div>
                          </div>
                        
                        {card.type === 'unit' && (
                          <div className="flex gap-4 text-sm text-gray-300 mb-2">
                            <span>ATK: {card.damage}</span>
                            <span>Tower: {card.buildingDamage}</span>
                            <span>HP: {card.health}</span>
                          </div>
                        )}
                        
                        <p className="text-xs text-gray-400 mb-1">{card.description}</p>
                      </CardContent>
                    </Card>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Selected Deck */}
          <Card className="bg-black/60 border-amber-600">
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle className="text-amber-200">Your Deck</CardTitle>
              <div className="flex gap-2">
                <Button 
                  onClick={fillWithRandom}
                  disabled={selectedCards.length >= DECK_SIZE}
                  variant="outline"
                  size="sm"
                >
                  Auto-Fill
                </Button>
                <Button 
                  onClick={() => setSelectedCards([])}
                  variant="outline"
                  size="sm"
                >
                  Clear
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-2">
                  {selectedCards.map((card, index) => (
                    <Card 
                      key={`deck-${card.name}-${index}`}
                      className={`cursor-pointer transition-all hover:scale-105 ${getCardColor(card)}`}
                      onClick={() => removeCard(index)}
                    >
                      <CardContent className="p-2">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-white">{card.name}</span>
                          <div className="flex gap-2">
                            <Badge className={getCardTypeColor(card.type)} variant="secondary">
                              {card.type}
                            </Badge>
                            <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                              Cost: {card.cost}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between mt-6">
          <div className="flex gap-2">
            <Button 
              onClick={() => setGamePhase('menu')}
              variant="outline"
              className="border-gray-500 text-gray-300"
            >
              Back to Menu
            </Button>

            <Dialog open={showLoadDialog} onOpenChange={setShowLoadDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-blue-500 text-blue-300">
                  Load Deck
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-900 border-blue-500">
                <DialogHeader>
                  <DialogTitle className="text-blue-200">Load Saved Deck</DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-96">
                  {savedDecks.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">No saved decks found</p>
                  ) : (
                    <div className="space-y-2">
                      {savedDecks.map(deck => (
                        <Card key={deck.id} className="bg-gray-800 border-blue-400">
                          <CardContent className="p-3 flex justify-between items-center">
                            <div>
                              <h4 className="font-semibold text-white">{deck.name}</h4>
                              <p className="text-xs text-gray-400">
                                {new Date(deck.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                onClick={() => handleLoadDeck(deck.id)}
                                className="bg-blue-600 hover:bg-blue-700"
                              >
                                Load
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => handleDeleteDeck(deck.id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="flex gap-2">
            <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline"
                  disabled={selectedCards.length !== DECK_SIZE}
                  className="border-amber-500 text-amber-300"
                >
                  Save Deck
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-900 border-amber-500">
                <DialogHeader>
                  <DialogTitle className="text-amber-200">Save Deck</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input 
                    placeholder="Enter deck name..."
                    value={deckName}
                    onChange={(e) => setDeckName(e.target.value)}
                    className="bg-gray-800 border-amber-500 text-white"
                  />
                  <Button 
                    onClick={handleSaveDeck}
                    disabled={!deckName.trim()}
                    className="w-full bg-amber-600 hover:bg-amber-700"
                  >
                    Save
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Button 
              onClick={setAsActiveDeck}
              disabled={selectedCards.length !== DECK_SIZE}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold"
            >
              Установить как активную ({selectedCards.length}/{DECK_SIZE})
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
