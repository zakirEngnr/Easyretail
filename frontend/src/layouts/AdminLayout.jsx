


// import React, { useState } from "react";
// import { Outlet } from "react-router-dom";
// import Sidebar from "../components/common/Sidebar";
// import Navbar from "../components/common/Navbar";

// const AdminLayout = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Desktop Sidebar */}
//       <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72">
//         <Sidebar />
//       </div>

//       {/* Mobile Sidebar */}
//       <div className="lg:hidden">
//         <Sidebar
//           isMobileOpen={sidebarOpen}
//           onClose={() => setSidebarOpen(false)}
//         />
//       </div>

//       {/* Main content */}
//       <div className="lg:pl-72">
//         <Navbar onMenuClick={() => setSidebarOpen(true)} />
//         <main className="p-6">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// };

// export default AdminLayout;


import React, { useState } from 'react';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <Sidebar 
        collapsed={sidebarCollapsed}
        isMobileOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <Navbar 
          onMenuClick={() => setMobileSidebarOpen(true)}
          sidebarCollapsed={sidebarCollapsed}
        />
        
        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;