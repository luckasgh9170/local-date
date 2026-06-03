import { AnimatePresence, motion } from 'framer-motion';
import { gsap } from 'gsap';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  FaCalendarDays,
  FaHeart,
  FaIceCream,
  FaMusic,
  FaPause,
  FaPizzaSlice,
  FaRegHeart,
  FaStar,
} from 'react-icons/fa6';
import { GiFrenchFries, GiRose, GiSparkles } from 'react-icons/gi';
import { MdLocalCafe, MdRestaurant, MdSpa } from 'react-icons/md';

const flow = ['intro', 'day', 'time', 'food', 'final'];
const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const times = ['12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];

const foodOptions = [
  { label: 'Cafe', icon: MdLocalCafe, emoji: '☕️', recommended: true },
  { label: 'Restaurant', icon: MdRestaurant, emoji: '🍝' },
  { label: 'Salad', icon: MdSpa, emoji: '🥗' },
  { label: 'French Fries', icon: GiFrenchFries, emoji: '🍟' },
  { label: 'Dessert', icon: FaIceCream, emoji: '🍰' },
  { label: 'Pizza', icon: FaPizzaSlice, emoji: '🍕' },
  { label: 'Ice Cream', icon: FaIceCream, emoji: '🍨' },
];

const pageVariants = {
  initial: { opacity: 0, y: 24, scale: 0.992 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -20, scale: 1.006 },
};

function randomBetween(min, max) {
  return Math.round(min + Math.random() * (max - min));
}

function makeId() {
  return window.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
}

function AmbientLayer({ burst }) {
  const hearts = useMemo(
    () =>
      Array.from({ length: 10 }, (_, index) => ({
        id: index,
        left: `${randomBetween(0, 100)}%`,
        delay: Math.random() * 10,
        duration: randomBetween(13, 24),
        size: randomBetween(10, 28),
        opacity: Math.random() * 0.34 + 0.16,
      })),
    [],
  );

  const petals = useMemo(
    () =>
      Array.from({ length: 7 }, (_, index) => ({
        id: index,
        left: `${randomBetween(0, 100)}%`,
        delay: Math.random() * 8,
        duration: randomBetween(15, 28),
        rotate: randomBetween(-90, 90),
      })),
    [],
  );

  const sparkles = useMemo(
    () =>
      Array.from({ length: 10 }, (_, index) => ({
        id: index,
        left: `${randomBetween(2, 98)}%`,
        top: `${randomBetween(3, 96)}%`,
        delay: Math.random() * 4,
        size: randomBetween(3, 7),
      })),
    [],
  );

  return (
    <div className="ambient" aria-hidden="true">
      <div className="aurora aurora-one" />
      <div className="aurora aurora-two" />
      <div className="aurora aurora-three" />
      <div className="aurora aurora-four" />

      {sparkles.map((sparkle) => (
        <span
          key={sparkle.id}
          className="ambient-sparkle"
          style={{
            left: sparkle.left,
            top: sparkle.top,
            width: sparkle.size,
            height: sparkle.size,
            animationDelay: `${sparkle.delay}s`,
          }}
        />
      ))}

      {hearts.map((heart) => (
        <span
          key={heart.id}
          className="floating-heart"
          style={{
            left: heart.left,
            animationDelay: `${heart.delay}s`,
            animationDuration: `${heart.duration}s`,
            fontSize: heart.size,
            opacity: heart.opacity,
          }}
        >
          ♥
        </span>
      ))}

      {petals.map((petal) => (
        <span
          key={petal.id}
          className="petal"
          style={{
            left: petal.left,
            animationDelay: `${petal.delay}s`,
            animationDuration: `${petal.duration}s`,
            '--petal-rotate': `${petal.rotate}deg`,
          }}
        />
      ))}

      <AnimatePresence>
        {burst && (
          <motion.div
            className="screen-burst"
            initial={{ opacity: 0, scale: 0.2 }}
            animate={{ opacity: [0, 1, 0], scale: [0.2, 1.8, 3] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.25, ease: 'easeOut' }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function CursorMagic() {
  const [particles, setParticles] = useState([]);
  const lastMoveRef = useRef(0);

  useEffect(() => {
    const onMove = (event) => {
      const now = performance.now();
      if (now - lastMoveRef.current < 95) return;
      lastMoveRef.current = now;

      const id = makeId();
      setParticles((items) => [
        ...items.slice(-6),
        {
          id,
          x: event.clientX,
          y: event.clientY,
          size: randomBetween(7, 15),
          hue: randomBetween(323, 355),
        },
      ]);

      window.setTimeout(() => {
        setParticles((items) => items.filter((item) => item.id !== id));
      }, 700);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <div className="cursor-layer" aria-hidden="true">
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="cursor-heart"
          initial={{ x: particle.x, y: particle.y, opacity: 0.9, scale: 0.35 }}
          animate={{ y: particle.y - 34, opacity: 0, scale: 1.08, rotate: 26 }}
          transition={{ duration: 0.62, ease: 'easeOut' }}
          style={{ fontSize: particle.size, color: `hsl(${particle.hue}, 94%, 77%)` }}
        >
          ♥
        </motion.span>
      ))}
    </div>
  );
}

function MusicToggle() {
  const [playing, setPlaying] = useState(false);
  const synthRef = useRef(null);

  useEffect(() => {
    if (!playing) {
      if (synthRef.current) {
        window.clearInterval(synthRef.current.interval);
        synthRef.current.context.close();
        synthRef.current = null;
      }
      return undefined;
    }

    const AudioEngine = window.AudioContext || window.webkitAudioContext;
    if (!AudioEngine) {
      setPlaying(false);
      return undefined;
    }

    const context = new AudioEngine();
    const masterGain = context.createGain();
    const notes = [261.63, 329.63, 392, 523.25, 440, 392, 349.23, 329.63];
    let index = 0;

    masterGain.gain.value = 0.028;
    masterGain.connect(context.destination);

    const playNote = () => {
      const oscillator = context.createOscillator();
      const envelope = context.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.value = notes[index % notes.length];
      envelope.gain.setValueAtTime(0.0001, context.currentTime);
      envelope.gain.exponentialRampToValueAtTime(0.12, context.currentTime + 0.08);
      envelope.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 1.45);

      oscillator.connect(envelope);
      envelope.connect(masterGain);
      oscillator.start();
      oscillator.stop(context.currentTime + 1.55);
      index += 1;
    };

    playNote();
    const interval = window.setInterval(playNote, 1400);
    synthRef.current = { context, interval };

    return () => {
      window.clearInterval(interval);
      context.close();
      synthRef.current = null;
    };
  }, [playing]);

  return (
    <button className="music-button" onClick={() => setPlaying((value) => !value)} aria-label="Toggle romantic music">
      {playing ? <FaPause /> : <FaMusic />}
    </button>
  );
}

function Celebration({ active }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: 30 }, (_, index) => ({
        id: `${index}-${active}`,
        x: randomBetween(-48, 48),
        y: randomBetween(-36, 46),
        delay: Math.random() * 0.5,
        duration: Math.random() * 1.15 + 1.25,
        symbol: ['♥', '✦', '❋', '✧', '❦'][index % 5],
      })),
    [active],
  );

  if (!active) return null;

  return (
    <div className="confetti-layer" aria-hidden="true">
      {pieces.map((piece) => (
        <motion.span
          key={piece.id}
          className="confetti-piece"
          initial={{ x: '50vw', y: '44vh', opacity: 0, scale: 0.3 }}
          animate={{
            x: `calc(50vw + ${piece.x}vw)`,
            y: [`44vh`, `calc(44vh + ${piece.y}vh)`],
            opacity: [0, 1, 0],
            scale: [0.35, 1.25, 0.55],
            rotate: randomBetween(-260, 260),
          }}
          transition={{ duration: piece.duration, delay: piece.delay, ease: 'easeOut' }}
        >
          {piece.symbol}
        </motion.span>
      ))}
    </div>
  );
}

function AnimatedHeartSigil() {
  return (
    <motion.svg
      className="heart-sigil"
      viewBox="0 0 180 160"
      initial={{ opacity: 0, scale: 0.3, rotate: -18 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ duration: 1.4, ease: 'easeOut' }}
      aria-hidden="true"
    >
      <motion.path
        d="M89.8 139.6C52.9 110.2 22 83.1 22 51.8 22 30.4 37.7 16 57.5 16c13.1 0 25.8 7.4 32.3 18.9C96.4 23.4 109 16 122.2 16 142 16 158 30.4 158 51.8c0 31.3-31.4 58.4-68.2 87.8Z"
        fill="none"
        stroke="url(#heartGradient)"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.9, delay: 0.3, ease: 'easeInOut' }}
      />
      <defs>
        <linearGradient id="heartGradient" x1="22" x2="158" y1="16" y2="140" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fff" />
          <stop offset="0.45" stopColor="#ff72b6" />
          <stop offset="1" stopColor="#c074ff" />
        </linearGradient>
      </defs>
    </motion.svg>
  );
}

function TypewriterQuestion() {
  const text = 'Do you want to go on a date with me? ❤️';
  return (
    <h1 className="type-title" aria-label={text}>
      {Array.from(text).map((char, index) => (
        <motion.span
          key={`${char}-${index}`}
          aria-hidden="true"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.68 + index * 0.024, duration: 0.3, ease: 'easeOut' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </h1>
  );
}

function Intro({ onYes }) {
  const noRef = useRef(null);

  const moveNo = () => {
    const node = noRef.current;
    if (!node) return;

    const safeX = Math.min(window.innerWidth * 0.34, 280);
    const safeY = Math.min(window.innerHeight * 0.25, 190);

    gsap.to(node, {
      x: randomBetween(-safeX, safeX),
      y: randomBetween(-safeY, safeY),
      rotate: randomBetween(-28, 28),
      scale: randomBetween(72, 98) / 100,
      duration: 0.34,
      ease: 'back.out(2.4)',
    });
  };

  const popNo = () => {
    moveNo();
    const node = noRef.current;
    if (!node) return;

    gsap.fromTo(
      node,
      { boxShadow: '0 0 0 0 rgba(255,255,255,.9)' },
      { boxShadow: '0 0 0 34px rgba(255,255,255,0)', duration: 0.48, ease: 'power2.out' },
    );
  };

  return (
    <motion.section className="scene hero-scene" variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <div className="hero-stack">
        <AnimatedHeartSigil />
        <motion.div
          className="intro-orbit"
          initial={{ scale: 0.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1, rotate: 360 }}
          transition={{ duration: 2.6, ease: 'easeOut' }}
        >
          <FaHeart />
        </motion.div>

        <motion.p
          className="eyebrow"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5 }}
        >
          A tiny luxury universe, built for one answer
        </motion.p>

        <TypewriterQuestion />

        <motion.div
          className="button-row"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.1, duration: 0.5 }}
        >
          <button className="yes-button" onClick={onYes}>
            YES <FaHeart />
          </button>
          <button ref={noRef} className="no-button" onMouseEnter={moveNo} onMouseMove={moveNo} onClick={popNo}>
            NO 😅
          </button>
        </motion.div>
      </div>
    </motion.section>
  );
}

function Panel({ kicker, title, children }) {
  return (
    <motion.div className="glass-panel" initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
      <p className="eyebrow">{kicker}</p>
      <h2>{title}</h2>
      {children}
    </motion.div>
  );
}

function DateSelection({ onSelect }) {
  return (
    <motion.section className="scene" variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <Panel kicker="Choose the destiny day" title="Luxury Romantic Calendar">
        <p className="date-note">
          I knew your other days are busy and full of work, so Friday felt like the sweetest choice.
        </p>
        <div className="calendar-grid">
          {weekDays.map((day) => {
            const active = day === 'Friday';
            return (
              <button key={day} className={`day-card ${active ? 'active' : 'disabled'}`} disabled={!active} onClick={onSelect}>
                <FaCalendarDays />
                <span>{day}</span>
                {active && <small>only magical option</small>}
              </button>
            );
          })}
        </div>
      </Panel>
    </motion.section>
  );
}

function TimeSelection({ selectedTime, setSelectedTime, onNext }) {
  return (
    <motion.section className="scene" variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <Panel kicker="Pick the hour" title="When should the magic begin?">
        <div className="time-grid">
          {times.map((time) => (
            <button key={time} className={`time-card ${selectedTime === time ? 'selected' : ''}`} onClick={() => setSelectedTime(time)}>
              <FaRegHeart />
              <span>{time}</span>
            </button>
          ))}
        </div>
        <button className="next-button" disabled={!selectedTime} onClick={onNext}>
          Continue <GiSparkles />
        </button>
      </Panel>
    </motion.section>
  );
}

function FoodSelection({ selectedFood, setSelectedFood, onNext }) {
  return (
    <motion.section className="scene" variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <Panel kicker="A delicious little question" title="What would you like for our date? ❤️">
        <div className="food-grid">
          {foodOptions.map((food) => {
            const Icon = food.icon;
            const selected = selectedFood === food.label;
            return (
              <button
                key={food.label}
                className={`food-card ${food.recommended ? 'recommended' : ''} ${selected ? 'selected' : ''}`}
                onClick={() => setSelectedFood(food.label)}
              >
                {food.recommended && <span className="badge">Recommended</span>}
                <Icon />
                <strong>{food.label}</strong>
                <span className="food-emoji">{food.emoji}</span>
              </button>
            );
          })}
        </div>
        <button className="next-button" disabled={!selectedFood} onClick={onNext}>
          Confirm choice <FaHeart />
        </button>
      </Panel>
    </motion.section>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="summary-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function FinalScreen({ selectedTime, selectedFood }) {
  return (
    <motion.section className="scene final-scene" variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <motion.div
        className="final-heart"
        animate={{ scale: [1, 1.14, 1], rotate: [0, -4, 4, 0] }}
        transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
      >
        <GiRose />
      </motion.div>
      <Panel kicker="It is official" title="❤️ Date Confirmed ❤️">
        <div className="summary">
          <SummaryRow label="Day" value="Friday" />
          <SummaryRow label="Time" value={selectedTime} />
          <SummaryRow label="Place" value={selectedFood} />
        </div>
        <motion.p className="cant-wait" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          I can't wait to see you ❤️
        </motion.p>
      </Panel>
    </motion.section>
  );
}

export default function App() {
  const [step, setStep] = useState('intro');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedFood, setSelectedFood] = useState('');
  const [burst, setBurst] = useState(false);

  const magicalNext = (nextStep) => {
    setBurst(true);
    window.setTimeout(() => {
      setStep(nextStep);
      setBurst(false);
    }, 720);
  };

  const progress = Math.max(0, flow.indexOf(step)) / (flow.length - 1);
  const celebrationActive = step === 'final' || burst;

  return (
    <main>
      <AmbientLayer burst={burst} />
      <CursorMagic />
      <MusicToggle />
      <Celebration active={celebrationActive} />

      <div className="progress" aria-hidden="true">
        <span style={{ transform: `scaleX(${progress})` }} />
      </div>

      <AnimatePresence mode="wait">
        {step === 'intro' && <Intro key="intro" onYes={() => magicalNext('day')} />}
        {step === 'day' && <DateSelection key="day" onSelect={() => magicalNext('time')} />}
        {step === 'time' && (
          <TimeSelection
            key="time"
            selectedTime={selectedTime}
            setSelectedTime={setSelectedTime}
            onNext={() => magicalNext('food')}
          />
        )}
        {step === 'food' && (
          <FoodSelection
            key="food"
            selectedFood={selectedFood}
            setSelectedFood={setSelectedFood}
            onNext={() => magicalNext('final')}
          />
        )}
        {step === 'final' && <FinalScreen key="final" selectedTime={selectedTime} selectedFood={selectedFood} />}
      </AnimatePresence>

      <div className="corner-sparkles" aria-hidden="true">
        <FaStar />
        <GiSparkles />
        <FaHeart />
      </div>
    </main>
  );
}
