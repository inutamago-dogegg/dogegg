import { motion } from 'motion/react';
import type { PaletteConfig } from '@/lib/theme';

type FloatingOrbsProps = {
  config: PaletteConfig;
};

export default function FloatingOrbs({ config }: FloatingOrbsProps) {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <motion.div
        animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className={`absolute top-20 left-10 w-32 h-32 ${config.decorativeColors[0]} rounded-full blur-3xl opacity-20 transform-gpu`}
        style={{ willChange: 'transform' }}
      />
      <motion.div
        animate={{ y: [0, 20, 0], x: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        className={`absolute bottom-20 right-10 w-40 h-40 ${config.decorativeColors[1]} rounded-full blur-3xl opacity-20 transform-gpu`}
        style={{ willChange: 'transform' }}
      />
      <motion.div
        animate={{ y: [0, 15, 0], x: [0, -15, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className={`absolute top-1/2 right-1/4 w-36 h-36 ${config.decorativeColors[2]} rounded-full blur-3xl opacity-20 transform-gpu`}
        style={{ willChange: 'transform' }}
      />
    </div>
  );
}
