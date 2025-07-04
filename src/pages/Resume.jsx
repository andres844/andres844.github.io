import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ScrollProgress from '../components/ScrollProgress';
import TiltCard from '../components/TiltCard';
import MagneticButton from '../components/MagneticButton';

// Animation variants for reusability
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const Resume = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Trigger entry animations on mount
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="pt-20 pb-16">
      <ScrollProgress />

      {/* Header Section */}
      <header className="container mx-auto px-4 mb-12 text-center">
        <motion.div
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
          variants={fadeInUp}
          transition={{ duration: 1 }}
        >
          <div className="flex justify-center mb-6">
            <motion.img
              src="pic.png"
              alt="Andres Avelar"
              className="w-40 h-40 rounded-full object-cover border-4 border-blue-500 shadow-lg"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            />
          </div>
          <h1 className="text-5xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-yellow-300">
            Andres Avelar
          </h1>
          <div className="flex flex-col md:flex-row justify-center items-center gap-3 mb-4">
            <p className="text-xl text-gray-300">Statistics & Data Science | Economics</p>
            <span className="hidden md:inline text-gray-500">•</span>
            <p className="text-xl text-gray-300">UCSB '26</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            <a href="mailto:andresavelar@ucsb.edu" className="text-blue-400 hover:text-blue-300">
              (661) 304-8868 | andresavelar@ucsb.edu
            </a>
          </div>
          <div className="flex justify-center gap-4">
            <MagneticButton className="opacity-100 active:scale-95 active:shadow-inner">
              <a
                href="https://github.com/andres844"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center text-white"
              >
                GitHub
              </a>
            </MagneticButton>
            <MagneticButton className="opacity-100 active:scale-95 active:shadow-inner">
              <a
                href="https://linkedin.com/in/andres-avelar"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center text-white"
              >
                LinkedIn
              </a>
            </MagneticButton>
          </div>
        </motion.div>
      </header>

      <main className="container mx-auto px-4">
        {/* Education Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          variants={fadeInUp}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold mb-4 pb-2 border-b border-blue-500">Education</h2>
          <div className="pl-2 space-y-8">
            {/* UCSB Section */}
            <div>
              <h3 className="text-xl font-semibold">University of California, Santa Barbara</h3>
              <div className="flex justify-between">
                <p className="text-gray-300">Bachelor of Science, Statistics & Data Science</p>
                <p className="text-gray-400">Expected June 2026</p>
              </div>
              <p className="text-gray-300">Bachelor of Arts, Economics</p>
              <ul className="list-disc list-inside text-gray-300 mt-2">
                <li>Data Science Club member, California Nano Systems Institute Fellowship recipient</li>
                <li>Major GPA: 3.6, Deans Honors List F2023, W2023</li>
              </ul>
            </div>

            {/* UC San Diego Summer Extension Section */}
            <div>
              <h3 className="text-xl font-semibold">University of California, San Diego: Summer Extension</h3>
              <div className="flex justify-between">
                <p className="text-gray-300">Computational Biology</p>
                <p className="text-gray-400">June 2022</p>
              </div>
              <ul className="list-disc list-inside text-gray-300 mt-2">
                <li>Awarded full scholarship to take Computational Biology with Python over summer quarter</li>
                <li>Experimented with Genome sequencing, wildlife ecology simulations, and epidemiology simulations</li>
              </ul>
            </div>
          </div>
        </motion.section>


        {/* Experience Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold mb-4 pb-2 border-b border-blue-500">Experience</h2>

          {/* Experience Card Template */}
          {[
            {
              title: 'Data Scientist - BNY Mellon',
              dates: 'June 2026 - Current',
              location: 'Pittsburgh, PA',
              points: [
                'Automating data pipelines, ongoing project'
              ],
              delay: 0,
            },
            {
              title: 'President - BlockchainUCSB',
              dates: 'June 2024 - Current',
              location: 'Santa Barbara, CA',
              points: [
                'Led Blockchain Summit (100+ attendees, $10K+ sponsorship) boosting community and funding.',
                'Organized weekly blockchain lectures for 200+ STEM students. (Intro to Chainlink, Solidity, & DeFi)',
                'Built industry and inter-club ties via domestic/international conferences; secured 4 sponsors.',
                'Analyzed DEX vs. CEX risks using Artemis data & DeFi principles under Prof. Malkhi.',
                'Assisted in joint research with Computer Science and Economics Departments; optimized ordering algorithims for Automated Market Makers.',
              ],
              delay: 0.1,
            },
            {
              title: 'Machine Learning Engineer - 2430 Group',
              dates: 'June 2024 - December 2024',
              location: 'Santa Barbara, CA',
              points: [
                'Developed a pipeline using RegEx & open-source LLMs (FuseChat-7b, e5-Mistral) to parse 9M+ data points; optimized vector embeddings.',
                'Led a 5-member team to build a custom machine learning (Random Forest, XGBoost) and RAG pipeline to derive proprietary risk of IP theft formula.',
                'Engineered the Glean AI app (Google Drive API, Postman) to streamline research and cut processing time by 20%.',
                'Fine-tuned YOLOv8 via Roboflow, reaching 94% test accuracy.',
              ],
              delay: 0.2,
            },
            {
              title: 'Systems Operator - UCSB Information Technology',
              dates: 'September 2023 - Current',
              location: 'Santa Barbara, CA',
              points: [
                'Deployed/imaged ~2,500 computers for 35K users; configured BIOS and mitigated tech risks.',
                'Automated class software installs/updates (Deep Freeze, PDQ) to boost efficiency by 30%.',
                'Scripted Python tools for Airtable inventory updates.',
              ],
              delay: 0.2,
            },
            {
              title: 'Software Engineer - APTCO',
              dates: 'July 2023 - September 2023',
              location: 'McFarland, CA',
              points: [
                'Built a full-stack ASP.NET app with senior engineers, reducing data entry by 45%.',
                'Trained Spanish-speaking users and enhanced accessibility, driving 87K+ entries by EOY.',
                'Developed an industrial connectivity solution using .NET MAUI with an MSSQL backend.',
                'Integrated a PLC with Aveva Edge, displaying 1K+ daily data points to boost QC efficiency by ~30%.',
              ],
              delay: 0.3,
            },
          ].map((job, index) => (
            <TiltCard key={index}>
              <motion.div
                initial="hidden"
                whileInView="visible"
                variants={fadeInUp}
                transition={{ duration: 0.6, delay: job.delay }}
                viewport={{ once: true }}
                className="mb-8 bg-gray-800 bg-opacity-50 backdrop-blur-lg p-6 rounded-lg hover:bg-opacity-70 transition-all"
              >
                <div className="flex flex-col md:flex-row justify-between mb-2">
                  <h3 className="text-xl font-semibold">{job.title}</h3>
                  <p className="text-gray-400">{job.dates}</p>
                </div>
                <p className="text-gray-400 mb-2">{job.location}</p>
                <ul className="list-disc list-inside text-gray-300">
                  {job.points.map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              </motion.div>
            </TiltCard>
          ))}
        </motion.section>

        {/* Projects Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          variants={fadeInUp}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold mb-4 pb-2 border-b border-blue-500">Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: 'AI Research Assistant',
                description: 'Built a RAG-powered research assistant using LangChain and OpenAI API',
                tags: ['Python', 'LangChain', 'OpenAI'],
                delay: 0,
              },
              {
                title: 'Time Series Forecasting',
                description: 'Extensively analyzed and forecasted weather time series data using ARIMA, SARIMA, and custom visualizations',
                tags: ['R Studio', 'ggplot2'],
                delay: 0,
              },
              {
                title: 'Quantitative Backtesting Framework',
                description: 'Developed Monte Carlo simulation to backtest trading strategies using historical data, including walk-forward analysis',
                tags: ['Scikit Learn', 'Random Forest', 'Donchian Breakout Strategy'],
                delay: 0.1,
              },
              {
                title: 'Volatility Surface Visualization',
                description:
                  'Derived formula to visualize volatility smile/skew of options contracts to assess bias of given stock',
                tags: ['Polygon.io API', 'Matplotlib', 'SeaBorn'],
                delay: 0.1,
              },
              {
                title: 'Neural Network from scratch',
                description:
                  'Coded neural network in base Python to identify MNIST dataset, strengthening my theoretical knowledge',
                tags: ['NumPy'],
                delay: 0.1,
              },
            ].map((project, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                variants={fadeInUp}
                transition={{ duration: 0.6, delay: project.delay }}
                viewport={{ once: true }}
                className="bg-gray-800 bg-opacity-50 backdrop-blur-lg p-6 rounded-lg hover:bg-opacity-70 transition-all duration-300"
              >
                <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                <p className="text-gray-300 mb-2">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, i) => (
                    <span key={i} className="bg-blue-700 px-2 py-1 rounded text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Skills Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          variants={fadeInUp}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold mb-4 pb-2 border-b border-blue-500">Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                header: 'Frameworks/Tools',
                content:
                'Docker, FastAPI, Git, Google AI Studio, Google Colab, HuggingFace, MongoDB, N8N (AI Agents), Node.js, PyTorch, Qdrant (Vector Database), RStudio, React, Scrapy, SciKit-learn, Siren (Graph Database), .NET, Visual Studio',
                delay: 0,
              },
              {
                header: 'Finance',
                content:
                  'Futures/Options trading (Level II market data), TradoVate, TradingView, Artemis Data Analytics, Etherscan, Kucoin',
                delay: 0.1,
              },
              {
                header: 'Languages',
                content:
                  'Spanish (proficient), Python, SQL, R, C#, Java, JavaScript, SAS, STATA, Solidity, Swift, HTML, CSS',
                delay: 0.2,
              },
            ].map((skill, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                variants={fadeInUp}
                transition={{ duration: 0.6, delay: skill.delay }}
                viewport={{ once: true }}
                className="bg-gray-800 bg-opacity-50 backdrop-blur-lg p-6 rounded-lg hover:bg-opacity-70 transition-all duration-300"
              >
                <h3 className="font-bold mb-2">{skill.header}</h3>
                <p className="text-gray-300">{skill.content}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </main>

      {/* Back to Top Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-8 right-8 bg-blue-500 text-white p-3 rounded-full shadow-lg"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        ↑
      </motion.button>

      {/* Footer */}
      <footer className="py-6 text-center text-gray-500">
        <p>© {new Date().getFullYear()} Andres Avelar</p>
      </footer>
    </div>
  );
};

export default Resume;