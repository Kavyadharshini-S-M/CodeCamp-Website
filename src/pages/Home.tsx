import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Users, Code, Target } from 'lucide-react';
import { motion } from 'motion/react';

export default function Home() {
  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="text-center pt-16 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
            From School to <span className="text-indigo-600">Industry-Ready</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10">
            CodeCamp is the ultimate learning hub and mentorship network for college freshers. 
            Find your domain, learn relevant skills, and get guided by seniors.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/signup" className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2">
              Get Started <ArrowRight className="h-5 w-5" />
            </Link>
            <Link to="/courses" className="bg-white text-slate-700 border border-slate-300 px-8 py-3 rounded-lg font-medium hover:bg-slate-50 transition-colors">
              Explore Courses
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="grid md:grid-cols-3 gap-8">
        <FeatureCard 
          icon={<Target className="h-8 w-8 text-emerald-500" />}
          title="Structured Learning Paths"
          description="Confused about what to learn? Follow our curated roadmaps for Web Dev, AI, Data Science, and more."
        />
        <FeatureCard 
          icon={<Users className="h-8 w-8 text-blue-500" />}
          title="Senior Mentorship"
          description="Connect with seniors who have been in your shoes. Get 1-on-1 guidance, resume reviews, and advice."
        />
        <FeatureCard 
          icon={<Code className="h-8 w-8 text-purple-500" />}
          title="Guided Projects"
          description="Don't just watch tutorials. Build real-world projects with starter code and mentor feedback."
        />
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{description}</p>
    </div>
  );
}
