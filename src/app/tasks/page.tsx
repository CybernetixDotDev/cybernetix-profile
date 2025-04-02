export default function TasksPage() {
    const trending = ['Decentralized Reputation System', 'AI Task Generator', 'Quantum-Resilient Identity Protocol']
  
    return (
      <div className="min-h-screen bg-black text-white p-6">
        <h1 className="text-3xl font-bold mb-4">🚀 Open Tasks</h1>
        <p className="text-gray-400 mb-6">Here are some trending tasks 🔥</p>
        <ul className="space-y-3">
          {trending.map((task, index) => (
            <li key={index} className="bg-zinc-900 p-4 rounded-xl shadow-lg hover:scale-[1.02] transition transform">
              <span className="text-purple-400">🔥 Trending:</span> {task}
            </li>
          ))}
        </ul>
      </div>
    )
  }
  