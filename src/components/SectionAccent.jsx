import React from 'react';
import { motion } from 'framer-motion';

const SectionAccent = ({ className = '' }) => (
  <motion.div
    className={`section-accent ${className}`.trim()}
    initial={{ scaleX: 0, opacity: 0 }}
    whileInView={{ scaleX: 1, opacity: 1 }}
    transition={{ duration: 0.8, ease: 'easeOut' }}
    viewport={{ once: true, amount: 0.6 }}
    style={{ transformOrigin: 'left' }}
    aria-hidden="true"
  >
    <span className="section-accent__base" />
    <span className="section-accent__sheen" />
  </motion.div>
);

export default SectionAccent;
