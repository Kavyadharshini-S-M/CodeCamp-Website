import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { User, MessageSquare, CheckCircle, XCircle, Clock } from 'lucide-react';

export default function Mentorship() {
  const { user } = useAuth();
  const [seniors, setSeniors] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [selectedSenior, setSelectedSenior] = useState<number | null>(null);

  useEffect(() => {
    if (user?.role === 'fresher') {
      fetch('/api/mentorship/seniors')
        .then(res => res.json())
        .then(data => setSeniors(data.seniors));
    }
    
    fetch('/api/mentorship/requests')
      .then(res => res.json())
      .then(data => {
        setRequests(data.requests);
        setLoading(false);
      });
  }, [user]);

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSenior) return;

    try {
      const res = await fetch('/api/mentorship/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senior_id: selectedSenior, message }),
      });
      
      if (res.ok) {
        alert('Request sent successfully!');
        setMessage('');
        setSelectedSenior(null);
        // Refresh requests
        fetch('/api/mentorship/requests')
          .then(res => res.json())
          .then(data => setRequests(data.requests));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusUpdate = async (id: number, status: string) => {
    try {
      const res = await fetch(`/api/mentorship/request/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      
      if (res.ok) {
        setRequests(requests.map(req => req.id === id ? { ...req, status } : req));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="text-center py-20">Loading mentorship data...</div>;

  return (
    <div className="space-y-12">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Mentorship Hub</h1>
        <p className="text-slate-600">Connect with seniors, get guidance, and accelerate your learning journey.</p>
      </div>

      {user?.role === 'fresher' && (
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900">Available Seniors</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {seniors.map(senior => (
              <motion.div 
                key={senior.id}
                whileHover={{ y: -2 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{senior.name}</h3>
                    <p className="text-sm text-slate-500">{senior.year} • {senior.college}</p>
                  </div>
                </div>
                <div className="mb-6">
                  <p className="text-sm text-slate-600 mb-2"><span className="font-medium">Interests:</span> {senior.interests}</p>
                  <p className="text-sm text-slate-600"><span className="font-medium">Level:</span> {senior.skill_level}</p>
                </div>
                
                {selectedSenior === senior.id ? (
                  <form onSubmit={handleRequest} className="space-y-3">
                    <textarea
                      required
                      placeholder="Why do you want mentorship?"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      rows={3}
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <button type="submit" className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700">Send</button>
                      <button type="button" onClick={() => setSelectedSenior(null)} className="flex-1 bg-slate-100 text-slate-700 py-2 rounded-lg text-sm font-medium hover:bg-slate-200">Cancel</button>
                    </div>
                  </form>
                ) : (
                  <button 
                    onClick={() => setSelectedSenior(senior.id)}
                    className="w-full flex items-center justify-center gap-2 bg-slate-50 text-indigo-600 border border-indigo-100 py-2.5 rounded-lg font-medium hover:bg-indigo-50 transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" /> Request Mentorship
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        </section>
      )}

      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900">Your Requests</h2>
        {requests.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center">
            <p className="text-slate-500">No mentorship requests yet.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <ul className="divide-y divide-slate-200">
              {requests.map(req => (
                <li key={req.id} className="p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900">
                        {user?.role === 'senior' ? req.fresher_name : req.senior_name}
                      </h4>
                      <p className="text-sm text-slate-500 mb-2">
                        {user?.role === 'senior' ? req.fresher_college : req.senior_college}
                      </p>
                      <p className="text-slate-700 text-sm bg-slate-100 p-3 rounded-lg inline-block">"{req.message}"</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                        req.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                        req.status === 'accepted' ? 'bg-emerald-100 text-emerald-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {req.status === 'pending' && <Clock className="w-3 h-3" />}
                        {req.status === 'accepted' && <CheckCircle className="w-3 h-3" />}
                        {req.status === 'rejected' && <XCircle className="w-3 h-3" />}
                        {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                      </span>
                      {user?.role === 'senior' && req.status === 'pending' && (
                        <div className="flex gap-2 mt-2">
                          <button onClick={() => handleStatusUpdate(req.id, 'accepted')} className="text-xs font-medium bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-md hover:bg-emerald-100">Accept</button>
                          <button onClick={() => handleStatusUpdate(req.id, 'rejected')} className="text-xs font-medium bg-red-50 text-red-600 px-3 py-1.5 rounded-md hover:bg-red-100">Decline</button>
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
}
