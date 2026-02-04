import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    FileText,
    Users,
    Settings,
    LogOut,
    Shield
} from 'lucide-react';

const Sidebar = () => {
    const { logout } = useContext(AuthContext); // Use logout from context
    // const navigate = useNavigate(); // Not strictly needed if logout clears state and wrapper redirects, but let's keep it clean

    const handleLogout = () => {
        logout();
        // The App component's ProtectedRoute will handle the redirect to /login
    };

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
        { icon: FileText, label: 'Complaints', path: '/admin/complaints' },
        { icon: Users, label: 'Students', path: '/admin/students' },
        { icon: Settings, label: 'Settings', path: '/admin/settings' },
    ];

    return (
        <div className="bg-secondary-900 w-72 min-h-screen text-secondary-300 flex flex-col fixed left-0 top-0 h-full z-20 font-sans border-r border-secondary-800">
            {/* Brand */}
            <div className="h-24 flex items-center px-8 border-b border-white/5">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center mr-3 shadow-lg shadow-primary-500/20 text-white">
                    <Shield size={18} className="text-secondary-900" />
                </div>
                <span className="text-xl font-bold tracking-tight text-white font-outfit">YellowShield</span>
            </div>

            {/* Nav */}
            <div className="flex-1 px-4 space-y-2 py-6">
                {navItems.map((item) => (
                    <NavLink
                        key={item.label}
                        to={item.path}
                        className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group font-medium
              ${isActive
                                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-secondary-900 shadow-lg shadow-primary-500/20 font-bold'
                                : 'text-secondary-400 hover:bg-white/5 hover:text-white'
                            }
            `}
                    >
                        {({ isActive }) => (
                            <>
                                <item.icon size={20} className={isActive ? 'text-secondary-900' : 'text-secondary-500 group-hover:text-primary-400 transition-colors'} />
                                <span className="tracking-wide">{item.label}</span>
                            </>
                        )}
                    </NavLink>
                ))}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/5">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-3.5 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 rounded-xl transition-all duration-300 text-sm font-medium group"
                >
                    <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span>Sign Out</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
