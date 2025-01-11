import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

const App = () => {
  const { scrollY } = useScroll();
  const [isVisible, setIsVisible] = useState(false);

  // Transform values for profile picture
  const profileScale = useTransform(scrollY, [0, 300], [1, 0.6]);
  const profileX = useTransform(scrollY, [0, 300], [0, -100]);
  const profileY = useTransform(scrollY, [0, 300], [0, -50]);
  const profileOpacity = useTransform(scrollY, [0, 300], [1, 0.8]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      {/* Hero Section with Profile Picture */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isVisible ? 1 : 0, y: 0 }}
        transition={{ duration: 1.2 }}
        className="h-[70vh] flex flex-col justify-center items-center px-4 relative"
      >
        <motion.div
          style={{ 
            scale: profileScale,
            x: profileX,
            y: profileY,
            opacity: profileOpacity
          }}
          className="mb-6 relative"
        >
          <motion.img 
            src="pic.png"
            alt="Andres Avelar"
            className="w-64 h-64 rounded-full object-cover border-4 border-blue-500 shadow-lg"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            Andres Avelar
          </h1>
          <h2 className="text-2xl text-gray-300 mb-4">Statistics & Data Science | Economics</h2>
          <p className="text-xl text-gray-300">UCSB '26</p>
        </motion.div>
      </motion.div>

      {/* Experience Section with Interactive Floating Logos */}
      <div className="relative min-h-screen px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Blockchain Experience */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-12 flex items-center gap-6"
          >
            <div className="flex-grow bg-gray-800 bg-opacity-50 backdrop-blur-lg p-6 rounded-lg hover:bg-opacity-70 transition-all">
              <h4 className="text-xl font-bold mb-2">President - Blockchain@UCSB</h4>
              <p className="text-gray-300">• Course completion in Blockchain Fundamentals with LinkedIn certification</p>
              <p className="text-gray-300">• Research team member analyzing systemic risks in exchanges</p>
              <p className="text-gray-300">• Leading 200+ weekly blockchain lectures</p>
              <p className="text-gray-300">• Organized summit with $10,000+ in sponsorships</p>
            </div>
            <div className="flex-shrink-0 flex flex-col items-center gap-2">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-blue-400 text-sm font-medium"
              >
                Click me!
              </motion.span>
              <motion.div 
                className="cursor-pointer"
                whileHover={{ scale: 1.1 }}
                animate={{ 
                  y: [-5, 5, -5],
                  rotate: [-2, 2, -2]
                }}
                transition={{ 
                  y: { duration: 2, repeat: Infinity },
                  rotate: { duration: 3, repeat: Infinity }
                }}
              >
                <img 
                  src="blockchainucsblogo.png" 
                  alt="Blockchain@UCSB" 
                  className="w-24 h-24 rounded-full shadow-lg"
                />
              </motion.div>
            </div>
          </motion.div>

          {/* ML Experience */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-12 flex items-center gap-6"
          >
            <div className="flex-grow bg-gray-800 bg-opacity-50 backdrop-blur-lg p-6 rounded-lg hover:bg-opacity-70 transition-all">
              <h4 className="text-xl font-bold mb-2">Machine Learning Engineer - 2430 Group</h4>
              <p className="text-gray-300">• Integrated FuseChat-7b AI model processing 9M+ JSON entries</p>
              <p className="text-gray-300">• Led RAG pipeline development with Random Forest & XGBoost</p>
              <p className="text-gray-300">• Automated research workflows reducing processing time by 20%</p>
              <p className="text-gray-300">• Fine-tuned YOLOv8 CNN achieving 94% accuracy</p>
            </div>
            <div className="flex-shrink-0 flex flex-col items-center gap-2">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="text-blue-400 text-sm font-medium"
              >
                Click me!
              </motion.span>
              <motion.a 
                href="https://www.2430group.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer"
                whileHover={{ scale: 1.1 }}
                animate={{ 
                  y: [5, -5, 5],
                  rotate: [2, -2, 2]
                }}
                transition={{ 
                  y: { duration: 2, repeat: Infinity, delay: 0.5 },
                  rotate: { duration: 3, repeat: Infinity, delay: 0.5 }
                }}
              >
                <img 
                  src="2430_updated_logo.png" 
                  alt="2430 Group" 
                  className="w-24 h-24 rounded-full shadow-lg"
                />
              </motion.a>
            </div>
          </motion.div>

          {/* Additional Experience */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-12"
          >
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg p-6 rounded-lg hover:bg-opacity-70 transition-all">
              <h4 className="text-xl font-bold mb-2">Additional Experience</h4>
              <p className="text-gray-300">• Systems Operator at UCSB LSIT</p>
              <p className="text-gray-300">• Software Engineer Intern at APTCO LLC</p>
              <p className="text-gray-300">• Full-stack development with ASP.NET</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Skills Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        className="px-4 py-8 bg-gradient-to-t from-purple-900 to-transparent"
      >
        <div className="max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold mb-6">Skills</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-gray-800 bg-opacity-50 backdrop-blur-lg p-6 rounded-lg hover:bg-opacity-70 transition-all duration-300"
            >
              <h4 className="font-bold mb-2">Frameworks</h4>
              <p className="text-gray-300">Git, FastAPI, Postman, Microsoft Suite, VertexAI, Google Colab, TensorFlow, SciKit-learn, React.js</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-gray-800 bg-opacity-50 backdrop-blur-lg p-6 rounded-lg hover:bg-opacity-70 transition-all duration-300"
            >
              <h4 className="font-bold mb-2">Finance</h4>
              <p className="text-gray-300">Futures/Options trading, Polygon, TradingView, Interactive Brokers, Artemis Analytics</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
              className="bg-gray-800 bg-opacity-50 backdrop-blur-lg p-6 rounded-lg hover:bg-opacity-70 transition-all duration-300"
            >
              <h4 className="font-bold mb-2">Languages</h4>
              <p className="text-gray-300">Native Spanish, Python, R, SQL, C#, Java, Javascript, Solidity, SAS, Stata</p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Projects Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        className="px-4 py-8 bg-gradient-to-b from-purple-900 to-transparent"
      >
        <div className="max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold mb-6">Projects</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-gray-800 bg-opacity-50 backdrop-blur-lg p-6 rounded-lg hover:bg-opacity-70 transition-all duration-300"
            >
              <h4 className="text-xl font-bold mb-2">AI Research Assistant</h4>
              <p className="text-gray-300 mb-2">Built a RAG-powered research assistant using LangChain and OpenAI API</p>
              <div className="flex gap-2">
                <span className="bg-blue-500 px-2 py-1 rounded text-sm">Python</span>
                <span className="bg-blue-500 px-2 py-1 rounded text-sm">LangChain</span>
                <span className="bg-blue-500 px-2 py-1 rounded text-sm">OpenAI</span>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-gray-800 bg-opacity-50 backdrop-blur-lg p-6 rounded-lg hover:bg-opacity-70 transition-all duration-300"
            >
              <h4 className="text-xl font-bold mb-2">Portfolio Analysis Tool</h4>
              <p className="text-gray-300 mb-2">Developed a tool for analyzing crypto portfolio performance and risk metrics</p>
              <div className="flex gap-2">
                <span className="bg-blue-500 px-2 py-1 rounded text-sm">Python</span>
                <span className="bg-blue-500 px-2 py-1 rounded text-sm">pandas</span>
                <span className="bg-blue-500 px-2 py-1 rounded text-sm">FastAPI</span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Hobbies Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="px-4 py-8"
      >
        <div className="max-w-3xl mx-auto">
          <motion.h3 
            initial={{ x: -20 }}
            whileInView={{ x: 0 }}
            className="text-2xl font-bold mb-6"
          >
            Hobbies
          </motion.h3>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            initial={{ y: 50 }}
            whileInView={{ y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-gray-800 bg-opacity-50 backdrop-blur-lg p-6 rounded-lg hover:bg-opacity-70 transition-all"
            >
              <h4 className="text-xl font-bold mb-2">Running & Cycling 🏃‍♂️ 🚴</h4>
              <p className="text-gray-300 mb-2">Currently training for a 1/2 marathon in beautiful Santa Barbara, cross-training with cycling</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="bg-gray-800 bg-opacity-50 backdrop-blur-lg p-6 rounded-lg hover:bg-opacity-70 transition-all"
            >
              <h4 className="text-xl font-bold mb-2">Rock Climbing 🏔️ 🧗</h4>
              <p className="text-gray-300 mb-2">Maxed out at 5.11b, working to reach 5.12 by end of 2025</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-gray-800 bg-opacity-50 backdrop-blur-lg p-6 rounded-lg hover:bg-opacity-70 transition-all"
            >
              <h4 className="text-xl font-bold mb-2">Solo Travel 🌎 🛫</h4>
              <p className="text-gray-300 mb-2">
                🇩🇪🇫🇷🇨🇭🇦🇹🇮🇹🇹🇭🇯🇵</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-gray-800 bg-opacity-50 backdrop-blur-lg p-6 rounded-lg hover:bg-opacity-70 transition-all"
            >
              <h4 className="text-xl font-bold mb-2">Hiking 🥾 🏔️</h4>
              <p className="text-gray-300 mb-2">Love to explore hiking trails in Montecito & Santa Barbara mountains</p>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default App;