import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { PlayCircle, Clock, Award } from 'lucide-react';

type Course = {
  id: number;
  title: string;
  description: string;
  price: number;
  level: string;
  image_url: string;
};

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/courses')
      .then(res => res.json())
      .then(data => {
        setCourses(data.courses);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center py-20">Loading courses...</div>;

  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Explore Learning Paths</h1>
        <p className="text-slate-600">Structured courses designed specifically for college freshers to build industry-relevant skills.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course, i) => (
          <motion.div 
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all flex flex-col"
          >
            <img src={course.image_url} alt={course.title} className="w-full h-48 object-cover" referrerPolicy="no-referrer" />
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold px-2 py-1 bg-indigo-50 text-indigo-600 rounded-md uppercase tracking-wider">
                  {course.level}
                </span>
                <span className="font-bold text-slate-900">
                  {course.price === 0 ? 'FREE' : `₹${course.price}`}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{course.title}</h3>
              <p className="text-slate-600 text-sm mb-6 flex-1">{course.description}</p>
              
              <div className="flex items-center gap-4 text-sm text-slate-500 mb-6">
                <div className="flex items-center gap-1"><PlayCircle className="w-4 h-4" /> 12 Modules</div>
                <div className="flex items-center gap-1"><Clock className="w-4 h-4" /> 4 Weeks</div>
                <div className="flex items-center gap-1"><Award className="w-4 h-4" /> Cert</div>
              </div>
              
              <button className="w-full bg-slate-900 text-white py-2.5 rounded-lg font-medium hover:bg-slate-800 transition-colors">
                Enroll Now
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
