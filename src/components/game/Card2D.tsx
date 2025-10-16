import { motion } from "framer-motion";
import { GameCard } from "../../lib/stores/useGameState";
import { cn } from "../../lib/utils";
import { Swords, Castle, Heart, Shield } from "lucide-react";

interface Card2DProps {
  card: GameCard;
  isInHand?: boolean;
  onClick?: () => void;
  isSelected?: boolean;
  isTargetable?: boolean;
  className?: string;
}

const getCardImage = (card: GameCard): string => {
  if (card.type === 'unit') {
    if (card.unitClass === 'assault') {
      return card.faction === 'whites' ? '/images/white_army_soldier.jpg' : '/images/red_army_soldier.jpg';
    } else if (card.unitClass === 'support') {
      return card.faction === 'whites' ? '/images/white_army_cavalry.jpg' : '/images/red_army_infantry.jpg';
    } else if (card.unitClass === 'spy') {
      return card.faction === 'whites' ? '/images/white_army_soldier.jpg' : '/images/red_army_soldier.jpg';
    }
  } else if (card.type === 'bonus') {
    if (card.bonusClass === 'medic') {
      return '/images/field_medic.jpg';
    } else if (card.bonusClass === 'engineer') {
      return '/images/artillery_cannon.jpg';
    } else if (card.bonusClass === 'instructor') {
      return card.faction === 'whites' ? '/images/white_army_cavalry.jpg' : '/images/red_army_infantry.jpg';
    } else if (card.bonusClass === 'aerial') {
      return '/images/aerial_bomber.jpg';
    }
  }
  return '';
};

export default function Card2D({ 
  card, 
  isInHand = false, 
  onClick, 
  isSelected = false, 
  isTargetable = false,
  className 
}: Card2DProps) {
  const isWhite = card.faction === "whites";
  const factionColor = isWhite ? "blue" : "red";
  const isDead = card.type === 'unit' && (card.currentHealth !== undefined ? card.currentHealth : card.health) <= 0;
  const cardImage = getCardImage(card);
  
  return (
    <motion.div
      className={cn(
        "relative w-32 h-44 rounded-lg border-2 cursor-pointer transition-all overflow-hidden",
        isWhite ? "border-blue-500 bg-gradient-to-br from-blue-900 to-blue-950" : "border-red-500 bg-gradient-to-br from-red-900 to-red-950",
        isSelected && "ring-4 ring-yellow-400 scale-105",
        isTargetable && "ring-4 ring-green-400 animate-pulse",
        isDead && "opacity-40 grayscale",
        isInHand && "hover:scale-105 hover:-translate-y-2",
        className
      )}
      onClick={onClick}
      whileHover={!isDead ? { y: isInHand ? -10 : 0 } : {}}
      whileTap={!isDead ? { scale: 0.95 } : {}}
    >
      <div className="absolute top-2 left-2 bg-amber-500 text-black font-bold rounded-full w-8 h-8 flex items-center justify-center text-sm shadow-lg z-10">
        {card.cost}
      </div>
      
      {cardImage && (
        <div className="absolute inset-0 top-0">
          <div 
            className="w-full h-24 bg-cover bg-center"
            style={{ 
              backgroundImage: `url(${cardImage})`,
              filter: 'sepia(50%) contrast(120%)'
            }}
          />
          <div className="absolute inset-0 top-0 h-24 bg-gradient-to-b from-transparent to-black/80" />
        </div>
      )}
      
      <div className="absolute bottom-0 left-0 right-0 px-2 pb-2 pt-8 bg-gradient-to-t from-black via-black/90 to-transparent">
        <div className="text-white font-semibold text-xs mb-1 truncate text-center">
          {card.name}
        </div>
        
        {card.type === 'unit' && (
          <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs mt-2">
            <div className="flex items-center gap-1">
              <Swords className="w-3 h-3 text-yellow-400" />
              <span className="text-white font-bold">{card.damage}</span>
            </div>
            <div className="flex items-center gap-1">
              <Castle className="w-3 h-3 text-orange-400" />
              <span className="text-white font-bold">{card.buildingDamage}</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="w-3 h-3 text-red-400 fill-red-400" />
              <span className="text-white font-bold">
                {card.currentHealth !== undefined ? card.currentHealth : card.health}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Shield className="w-3 h-3 text-blue-400" />
              <span className="text-white font-bold">{card.defense}</span>
            </div>
          </div>
        )}
        
        {card.type === 'bonus' && card.bonusEffect && (
          <div className="text-xs text-yellow-300 mt-2 font-semibold text-center">
            {card.bonusEffect.type === 'heal' && `+${card.bonusEffect.value} HP`}
            {card.bonusEffect.type === 'damage_boost' && `+${card.bonusEffect.value} ATK`}
            {card.bonusEffect.type === 'building_damage_boost' && `+${card.bonusEffect.value} TWR`}
            {card.bonusEffect.type === 'direct_building_damage' && `${card.bonusEffect.value} DMG`}
            {card.bonusEffect.type === 'direct_damage' && `${card.bonusEffect.value} DMG`}
          </div>
        )}
      </div>
      
      {card.unitClass && (
        <div className="absolute top-10 right-1">
          <span className={cn(
            "text-[9px] font-bold px-2 py-0.5 rounded shadow-lg",
            card.unitClass === 'spy' && "bg-purple-700 text-white",
            card.unitClass === 'assault' && "bg-red-700 text-white",
            card.unitClass === 'support' && "bg-green-700 text-white"
          )}>
            {card.unitClass.toUpperCase()}
          </span>
        </div>
      )}
      
      {card.bonusClass === 'aerial' && (
        <div className="absolute top-10 right-1">
          <span className="text-[9px] font-bold px-2 py-0.5 rounded shadow-lg bg-sky-600 text-white">
            AERIAL
          </span>
        </div>
      )}
    </motion.div>
  );
}
