import React from 'react';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Users, Trophy, Target } from 'lucide-react';
import { motion } from 'motion/react';

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="space-y-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Welcome back, {user.name}!</h1>
        <p className="text-slate-500 mt-1">Here's what's happening with your learning journey.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<BookOpen className="h-6 w-6 text-indigo-500" />} title="Active Courses" value="2" />
        <StatCard icon={<Target className="h-6 w-6 text-emerald-500" />} title="Projects Completed" value="0" />
        <StatCard icon={<Users className="h-6 w-6 text-blue-500" />} title="Mentors" value="1" />
        <StatCard icon={<Trophy className="h-6 w-6 text-amber-500" />} title="Points" value="150" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Your Roadmap</h2>
            <div className="space-y-4">
              <RoadmapItem title="HTML & CSS Basics" status="completed" />
              <RoadmapItem title="JavaScript Fundamentals" status="in-progress" />
              <RoadmapItem title="React Introduction" status="locked" />
              <RoadmapItem title="Build a Portfolio" status="locked" />
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Announcements</h2>
            <div className="space-y-4">
              <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                <p className="text-sm font-medium text-indigo-900">Upcoming Hackathon!</p>
                <p className="text-xs text-indigo-700 mt-1">Register for the CodeCamp fresher hackathon this weekend.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value }: { icon: React.ReactNode, title: string, value: string }) {
  return (
    <motion.div 
      whileHover={{ y: -2 }}
      className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4"
    >
      <div className="p-3 bg-slate-50 rounded-xl">{icon}</div>
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
      </div>
    </motion.div>
  );
}

function RoadmapItem({ title, status }: { title: string, status: 'completed' | 'in-progress' | 'locked' }) {
  const statusColors = {
    'completed': 'bg-emerald-100 text-emerald-700',
    'in-progress': 'bg-indigo-100 text-indigo-700',
    'locked': 'bg-slate-100 text-slate-500'
  };

  return (
    <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
      <div className="flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full ${status === 'completed' ? 'bg-emerald-500' : status === 'in-progress' ? 'bg-indigo-500' : 'bg-slate-300'}`} />
        <span className="font-medium text-slate-700">{title}</span>
      </div>
      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[status]}`}>
        {status.replace('-', ' ').toUpperCase()}
      </span>
    </div>
  );
}
