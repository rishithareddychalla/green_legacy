import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";

type TreeState = {
  lastWatered?: string; // YYYY-MM-DD
  daysWatered: number;
  greenPoints: number;
  createdAt: string; // ISO
};

const STORAGE_KEY = "green_legacy_tree";

const todayKey = () => {
  const d = new Date();
  return d.toISOString().slice(0, 10);
};

const stageForDays = (days: number) => {
  if (days <= 1) return { name: "Seed", emoji: "🪴" };
  if (days <= 3) return { name: "Sprout", emoji: "🌿" };
  if (days <= 6) return { name: "Sapling", emoji: "🌳" };
  return { name: "Full Tree", emoji: "🌲" };
};

const defaultState = (): TreeState => ({
  lastWatered: undefined,
  daysWatered: 0,
  greenPoints: 0,
  createdAt: new Date().toISOString(),
});

const loadState = (): TreeState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw) as TreeState;
    // simple validation
    return {
      lastWatered: parsed.lastWatered,
      daysWatered: Number(parsed.daysWatered) || 0,
      greenPoints: Number(parsed.greenPoints) || 0,
      createdAt: parsed.createdAt || new Date().toISOString(),
    };
  } catch (e) {
    return defaultState();
  }
};

const saveState = (s: TreeState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch (e) {
    // ignore storage errors
  }
};

const TreeGrowthVisualizer = () => {
  const [state, setState] = useState<TreeState>(() => loadState());
  const [today, setToday] = useState<string>(() => todayKey());
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    // update today at midnight in case the user keeps the page open long
    const interval = setInterval(() => setToday(todayKey()), 60_000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const canWaterToday = () => {
    return state.lastWatered !== today;
  };

  const handleWater = () => {
    if (!canWaterToday()) return;
    const addedPoints = 10; // reward per watering
    const newState: TreeState = {
      ...state,
      lastWatered: today,
      daysWatered: state.daysWatered + 1,
      greenPoints: state.greenPoints + addedPoints,
    };
    setState(newState);
    // trigger a small rattle animation
    setAnimKey((k) => k + 1);
  };

  const { name, emoji } = stageForDays(state.daysWatered);

  return (
    <section className="py-10">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-card rounded-2xl p-6 shadow-md">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <motion.div
              key={animKey}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.45 }}
              className="flex-shrink-0 w-full md:w-48 text-center"
            >
              <div className="mx-auto w-36 h-36 md:w-48 md:h-48 flex items-center justify-center rounded-full bg-gradient-to-br from-green-50 to-green-100 shadow-inner">
                <motion.span
                  role="img"
                  aria-label={`Tree stage: ${name}`}
                  className="text-6xl md:text-7xl"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ repeat: 1, duration: 0.8 }}
                >
                  {emoji}
                </motion.span>
              </div>
              <div className="mt-3 text-center">
                <div className="font-semibold">{name}</div>
                <div className="text-sm text-muted-foreground">Day {Math.max(1, state.daysWatered)}</div>
              </div>
            </motion.div>

            <div className="flex-1">
              <h3 className="text-xl font-heading font-bold mb-2">Your Growing Tree</h3>
              <p className="text-muted-foreground mb-4">
                Water your tree daily to help it grow. Come back every day to increase your Green Points!
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                <div className="bg-muted/10 p-3 rounded-lg text-center">
                  <div className="text-sm text-muted-foreground">Days Watered</div>
                  <div className="font-semibold text-lg">{state.daysWatered}</div>
                </div>
                <div className="bg-muted/10 p-3 rounded-lg text-center">
                  <div className="text-sm text-muted-foreground">Tree Age</div>
                  <div className="font-semibold text-lg">{state.daysWatered} days</div>
                </div>
                <div className="bg-muted/10 p-3 rounded-lg text-center">
                  <div className="text-sm text-muted-foreground">Green Points</div>
                  <div className="font-semibold text-lg">{state.greenPoints}</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Button
                  onClick={handleWater}
                  disabled={!canWaterToday()}
                  aria-label="Water my tree"
                >
                  {canWaterToday() ? "Water My Tree" : "Watered Today"}
                </Button>

                <div className="text-sm text-muted-foreground">
                  {canWaterToday() ? (
                    <span>Click to water and earn <strong>10 Green Points</strong>.</span>
                  ) : (
                    <span>You already watered today. Come back tomorrow.</span>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TreeGrowthVisualizer;
