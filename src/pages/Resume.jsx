import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TiltCard from '../components/TiltCard';
import AsciiWavesBackground from '../components/AsciiWavesBackground';

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
    <div className="pt-20 pb-16 relative z-10">
      <AsciiWavesBackground />

      {/* Header Section */}
      <header className="container mx-auto px-4 mb-12 text-center">
        <motion.div
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
          variants={fadeInUp}
          transition={{ duration: 1 }}
        >
          <div className="flex justify-center mb-6">
            <motion.div whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 300 }}>
              <img
                src="/pic.png"
                alt="Andres Avelar"
                className="w-40 h-40 rounded-full object-cover border-4 border-blue-500 shadow-lg"
                width={160}
                height={160}
                loading="eager"
                decoding="async"
                fetchpriority="high"
              />
            </motion.div>
          </div>
          <h1 className="text-5xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-yellow-300">
            Andres Avelar
          </h1>
          <div className="flex flex-col md:flex-row justify-center items-center gap-3 mb-4">
            <p className="text-xl text-gray-300">Statistics & Data Science + Economics</p>
            <span className="hidden md:inline text-gray-500">•</span>
            <p className="text-xl text-gray-300">UCSB '26</p>
          </div>
          <p className="text-gray-400 max-w-2xl mx-auto">
            I design and build data products and ML systems with a focus on
            clarity, performance, and measurable outcomes.
          </p>
        </motion.div>
      </header>

      {/* Main Content: 2-column layout */}
      <main className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-1 space-y-6 lg:sticky lg:top-24 self-start">
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="glass-card hover-change p-6 rounded-lg"
          >
            <h3 className="text-lg font-semibold mb-2">Contact</h3>
            <div className="space-y-2 text-gray-300">
              <a href="mailto:andresavelar@ucsb.edu" className="text-blue-400 hover:text-blue-300 block">
                andresavelar@ucsb.edu
              </a>
              <p className="text-gray-300">Santa Barbara, CA</p>
              <div className="flex gap-3">
                <a
                  href="https://github.com/andres844"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300"
                >
                  GitHub
                </a>
                <span className="text-gray-600">•</span>
                <a
                  href="https://linkedin.com/in/andres-avelar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300"
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={fadeInUp}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="glass-card hover-change p-6 rounded-lg"
          >
            <h3 className="text-lg font-semibold mb-2">Skills</h3>
            <div className="space-y-4">
              {[
                {
                  header: 'Frameworks/Tools',
                  content:
                    'Docker, FastAPI, Git, Google AI Studio, Google Colab, HuggingFace, MongoDB, N8N (AI Agents), Node.js, PyTorch, Qdrant (Vector DB), RStudio, React, Scrapy, SciKit-learn, Siren (Graph DB), .NET, VS',
                },
                {
                  header: 'Finance',
                  content:
                    'Futures/Options (Level II), TradoVate, TradingView, Capital IQ, Artemis, Etherscan, Kucoin',
                },
                {
                  header: 'Languages',
                  content:
                    'Spanish (proficient), Python, SQL, R, C#, Java, JS, SAS, STATA, Solidity, Swift, HTML, CSS',
                },
              ].map((s, i) => (
                <div key={i}>
                  <h4 className="font-medium text-gray-200">{s.header}</h4>
                  <p className="text-gray-300 text-sm">{s.content}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </aside>

        {/* Main column */}
        <section className="lg:col-span-2">
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
              title: 'AI Engineer - BNY Mellon',
              dates: 'June 2026 - August 2026',
              location: 'Pittsburgh, PA',
              points: [
                'Multi Agent LLM-as-a-Judge pipeline for Quantitative Cyber Risk Team: Automated risk assessment of complete CRIv2.1 and MITRE ATT&CK Frameworks with respect to Global BNY business units.',
                'Saved 270+ hours of manual labor by leveraging fine-tuned locally hosted LLMs',
                'Utilized Parallel Processing and Advanced Prompt Engineering to optimize agent workflows and reduce latency by 85%'

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
              dates: 'September 2023 - April 2025',
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
            <div className="mb-8" key={index}>
              <TiltCard>
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  variants={fadeInUp}
                  transition={{ duration: 0.6, delay: job.delay }}
                  viewport={{ once: true }}
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
            </div>
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
                description: 'Extensively analyzed and forecasted weather time-series data using ARIMA and SARIMA models, leveraging R (including the forecast package for automatic ARIMA and state-space exponential smoothing) for model selection and diagnostics (ACF/PACF, stationarity tests), and presented insights through custom visualizations',
                tags: ['R Studio', 'ggplot2', 'auto.arima'],
                delay: 0,
              },
              {
                title: 'Quantitative Backtesting Framework',
                description: 'Implemented Monte Carlo simulation-driven backtesting with 10,000 step walk-forward optimization, leveraging Python, statistical resampling (e.g., bootstrapping/permutation testing), dynamic risk-adjusted performance metrics, and visualizations to evaluate strategy robustness across multiple market regimes.',
                tags: ['Scikit Learn', 'Random Forest', 'Donchian Breakout Strategy'],
                delay: 0.1,
              },
              {
                title: 'Volatility Surface Visualization',
                description:
                  'Derived formula to visualize volatility smile/skew of options contracts using Black–Scholes modeling, implied volatility extraction, and 3D surface plotting (Python/Matplotlib/NumPy) to assess bias of given stock',
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
                className="glass-card hover-change p-6 rounded-lg transition-all duration-300"
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

        </section>
      </main>

      {/* Back to Top Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-8 right-8 bg-yellow-300 text-black p-3 rounded-full shadow-lg"
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
