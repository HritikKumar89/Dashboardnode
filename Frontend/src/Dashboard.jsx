import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { FaBars, FaBell, FaUserCircle } from 'react-icons/fa';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, ArcElement, Tooltip, Legend);

function Dashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/login');
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const lineData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    datasets: [
      {
        label: 'Activity',
        data: [10, 40, 15, 30, 20],
        borderColor: '#2563eb',
        tension: 0.4,
      },
    ],
  };

  const pieData = {
    labels: ['Completed', 'Pending', 'Failed'],
    datasets: [
      {
        data: [60, 25, 15],
        backgroundColor: ['#10b981', '#facc15', '#ef4444'],
        borderWidth: 1,
      },
    ],
  };

  const stats = [
    { title: "New Tickets", value: 43, change: "+6%", color: "green" },
    { title: "Closed Today", value: 17, change: "-3%", color: "red" },
    { title: "Followers", value: "27.3k", change: "+3%", color: "green" },
    { title: "Earnings", value: "₹34,000", change: "+5%", color: "green" },
  ];

  return (
    <div style={{
      display: 'flex',
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      fontFamily: 'Arial'
    }}>
      {/* Sidebar */}
      {sidebarOpen && (
        <div style={{
          width: '220px',
          background: '#1e3a8a',
          color: '#fff',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <h2>Dashboard</h2>
          <a href="#" style={{ color: '#fff', textDecoration: 'none' }}>Home</a>
          <a href="#" style={{ color: '#fff', textDecoration: 'none' }}>Reports</a>
          <a href="#" style={{ color: '#fff', textDecoration: 'none' }}>Analytics</a>
          <a href="#" style={{ color: '#fff', textDecoration: 'none' }}>Settings</a>
          <button onClick={handleLogout} style={{
            marginTop: 'auto',
            backgroundColor: '#ef4444',
            color: 'white',
            border: 'none',
            padding: '10px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            Logout
          </button>
        </div>
      )}

      {/* Main Content */}
      <div style={{
        flex: 1,
        backgroundColor: '#f9fafb',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto'
      }}>
        {/* Navbar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 24px',
          background: '#fff',
          boxShadow: '0 1px 4px rgba(0,0,0,0.05)'
        }}>
          <FaBars size={20} onClick={toggleSidebar} style={{ cursor: 'pointer' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <FaBell size={18} />
            <FaUserCircle size={22} />
            <span>Jane (Admin)</span>
          </div>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '20px',
          padding: '20px',
          flexShrink: 0
        }}>
          {stats.map((stat, idx) => (
            <div key={idx} style={{
              backgroundColor: '#fff',
              padding: '16px',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
              textAlign: 'center'
            }}>
              <h3 style={{ margin: 0, color: stat.color }}>{stat.change}</h3>
              <h2 style={{ margin: '10px 0' }}>{stat.value}</h2>
              <p style={{ margin: 0, color: '#555' }}>{stat.title}</p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          padding: '0 20px 20px 20px',
          flexGrow: 1
        }}>
          <div style={{
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}>
            <h3>Activity Over Time</h3>
            <Line data={lineData} />
          </div>
          <div style={{
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}>
            <h3>Task Breakdown</h3>
            <Pie data={pieData} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
