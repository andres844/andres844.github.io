import React, { useState, useEffect } from 'react';
import { motion, useScroll } from 'framer-motion';
import PhotoCarousel from '../components/PhotoCarousel';

const PersonalPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollYProgress } = useScroll(); // Hook to track scroll progress

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="pt-20 pb-16">
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-2 bg-blue-500 origin-left z-50"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isVisible ? 1 : 0, y: 0 }}
        transition={{ duration: 1 }}
        className="container mx-auto px-4 mb-12 text-center"
      >
        <div className="flex justify-center mb-6">
          <motion.img
            src="pic.png"
            alt="Andres Avelar"
            className="w-48 h-48 rounded-full object-cover border-4 border-blue-500 shadow-lg"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
            loading="eager"
          />
        </div>
        <h1 className="text-5xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-yellow-300">
          Personal Space
        </h1>
        <p className="text-xl text-gray-300 max-w-lg mx-auto">
          This is my personal page, brief intro to some of my hobbies and interests.
        </p>
      </motion.div>

      <div className="container mx-auto px-4">
        {/* Quote Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <blockquote className="text-2xl italic text-gray-300 max-w-2xl mx-auto">
            "Education is the kindling of a flame, not the filling of a vessel."
            <footer className="text-lg mt-2">- Socrates</footer>
          </blockquote>
        </motion.div>

        {/* Hobbies Section */}
        <motion.section
          id="hobbies"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            Hobbies & Interests
          </h2>

          {/* Running & Cycling */}
          <HobbySection id="running" title="Running & Cycling" emoji="🏃‍♂️ 🚴">
            <div>
              <p className="text-gray-300 mb-4">
                Training for a 1/2 marathon in Santa Barbara; cross training with cycling on a Specialized Langster Pro.
              </p>
              <ul className="list-disc list-inside text-gray-300 mb-4">
                <li>1/2 marathon: 1hr 23min (3x)</li>
                <li>5k: 16:19</li>
                <li>Mile: 4:36</li>
                <li>800m: 2:00 flat</li>
                <li>400m: 50.9 sec</li>
              </ul>
            </div>
            <PhotoCarousel photos={["/running1.png", "/sunriserun.png", "/sunsetrun.png", "/sunsetrun2.png"]} speed={25} />
          </HobbySection>

          {/* Astrophotography */}
          <HobbySection id="astro" title="Astrophotography">
            <div>
              <p className="text-gray-300 mb-4">Current telescope: SeaStar S50</p>
              <ul className="list-disc list-inside text-gray-300 mb-4">
                <li>Messier 1: Crab Nebula</li>
                <li>NGC 281: Pacman Nebula</li>
                <li>M97: Owl Nebula</li>
                <li>Andromeda Galaxy</li>
                <li>Jupiter & its moons</li>
                <li>Our Moon</li>
                <li>Mars</li>
              </ul>
            </div>
            <PhotoCarousel photos={["/crab.png", "/pacman.png", "/owl.png", "/andromeda.png", "/jupiter.png", "/moon.png", "/mars.png"]} speed={35} />
          </HobbySection>

          {/* Rock Climbing */}
          <HobbySection id="climbing" title="Rock Climbing" emoji="🏔️ 🧗" reverse={true}>
            <PhotoCarousel photos={["/climbing1.png", "/climbing2.png", "/rock.png", "/climbing3.png"]} speed={25} />
            <div>
              <p className="text-gray-300 mb-4">
                Maxed out at 5.11b; aiming for 5.12+ by the end of 2025.
              </p>
            </div>
          </HobbySection>

          {/* Solo Travel */}
          <HobbySection id="travel" title="Solo Travel" emoji="🌎 🛫">
            <PhotoCarousel photos={["/swiss2.png", "/tokyo1.png", "/kyotostairs.png", "/italy.png", "/fuji.png", "/osaka.png", "/kobe.png", "/thaisteak.png", "/elephant.png", "/germany.png", "/italy2.png", "/swiss.png", "/thai2.png", "/ramen.png", "/kyoto.png", "/thai1.png"]} speed={50} />
            <div>
              <p className="text-gray-300 mb-3">
                Passionate about experiencing new cultures and environments.
              </p>
              <p className="text-gray-300 mb-4 text-2xl">
                🇩🇪 🇫🇷 🇨🇭 🇦🇹 🇮🇹 🇹🇭 🇯🇵
              </p>
              <p className="text-gray-300 mb-3">
                Most memorable moment: almost getting attacked by a wild boar in Kyoto, Japan.
              </p>
              <p className="text-gray-300">
                Next up: 🇧🇷 🇨🇷 🇬🇧 🇪🇸
              </p>
            </div>
          </HobbySection>

          {/* Hiking */}
          <HobbySection id="hiking" title="Hiking" emoji="🥾 🏔️">
            <PhotoCarousel photos={["/lizards.png", "/tangerine2.png", "/hikegroup.png", "/creek.png", "/sunsethike.png", "/7falls.png"]} speed={25} />
            <div>
              <p className="text-gray-300 mb-4">
                Exploring Santa Barbara and Montecito mountains with breathtaking views.
              </p>
              <p className="text-gray-300 mb-4">
                I found a secret cliff jumping spot in the mountains, gatekeeping it. Some of my favorite hikes include:
              </p>
              <ul className="list-disc list-inside text-gray-300 mb-4">
                <li>Lizards Mouth Point – Short climb, best view of UCSB</li>
                <li>Cold Spring Trail – Creek and forest scenery</li>
                <li>Montecito Hot Springs – Relaxing post-hike pools</li>
                <li>7 Falls – Refreshing pools and waterfalls</li>
                <li>Tangerine Falls – A bit technical but so worth it</li>
              </ul>
              <p className="text-gray-300">
                Hiking and being in nature keep me sane.
              </p>
            </div>
          </HobbySection>
        </motion.section>
      </div>
      
      {/* Back to Top Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-8 right-8 bg-blue-500 text-white p-3 rounded-full shadow-lg"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        ↑
      </motion.button>
    </div>
  );
};

// Reusable HobbySection Component
const HobbySection = ({ id, title, children, emoji = "", reverse = false }) => (
  <div 
    id={id}
    className="mb-12 bg-gray-800 bg-opacity-50 backdrop-blur-lg p-8 rounded-lg hover:bg-opacity-70 transition-all"
  >
    <h3 className="text-2xl font-bold mb-4">
      {title} {emoji}
    </h3>
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 ${reverse ? 'md:flex md:flex-row-reverse' : ''}`}>
      {children}
    </div>
  </div>
);

export default PersonalPage;