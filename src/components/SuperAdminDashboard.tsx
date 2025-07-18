import React, { useState } from 'react';
import { 
  Shield, 
  Users, 
  TrendingUp, 
  AlertTriangle,
  Settings,
  Award,
  FileText,
  BarChart3,
  PieChart,
  Globe,
  Lock,
  Unlock,
  UserCheck,
  UserX,
  DollarSign,
  Calendar,
  Home,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Star
} from 'lucide-react';
import { 
  Table, 
  Modal, 
  Form, 
  Input, 
  Select, 
  Button, 
  Card, 
  Statistic, 
  Progress, 
  Tag, 
  Switch,
  Rate,
  DatePicker,
  InputNumber,
  Tabs,
  Chart
} from 'antd';
import { basicAdmins, agents, complaints, offers, bookings, performanceMetrics } from '../data/admins';
import type { BasicAdmin, Agent, Complaint, Offer } from '../data/admins';

interface SuperAdminDashboardProps {
  userRole: string;
  onLogout: () => void;
  onBack: () => void;
}

const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({ userRole, onLogout, onBack }) => {
  // State management
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedUser, setSelectedUser] = useState<BasicAdmin | Agent | null>(null);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [userType, setUserType] = useState<'admin' | 'agent'>('admin');

  // Mock Super Admin data
  const superAdmin = {
    name: "Michael Chen",
    email: "michael.chen@yorkeholidays.com",
    role: "Super Administrator",
    avatar: "MC"
  };

  // Calculate global statistics
  const totalUsers = basicAdmins.length + agents.length;
  const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalAmount, 0);
  const totalComplaints = complaints.length;
  const activeOffers = offers.filter(offer => offer.status === 'Active').length;

  // Performance data for charts
  const bookingsByMonth = [
    { month: 'Jan', cruises: 15, hotels: 12 },
    { month: 'Feb', cruises: 18, hotels: 15 },
    { month: 'Mar', cruises: 22, hotels: 18 }
  ];

  const regionPerformance = [
    { region: 'North India', bookings: 45, revenue: 2250000 },
    { region: 'South India', bookings: 38, revenue: 1900000 },
    { region: 'West India', bookings: 32, revenue: 1600000 }
  ];

  // Handle user management actions
  const handleUserAction = (userId: string, action: 'activate' | 'deactivate' | 'delete' | 'changeRole') => {
    console.log(`${action} user:`, userId);
    Modal.success({
      title: 'Action Completed',
      content: `User ${action} completed successfully.`
    });
  };

  // Handle complaint assignment
  const handleAssignComplaint = (complaintId: string, assignTo: string) => {
    console.log('Assigning complaint:', complaintId, 'to:', assignTo);
    Modal.success({
      title: 'Complaint Assigned',
      content: 'Complaint has been assigned successfully.'
    });
  };

  // Handle offer creation
  const handleCreateOffer = (offerData: any) => {
    console.log('Creating offer:', offerData);
    Modal.success({
      title: 'Offer Created',
      content: 'New offer has been created successfully.'
    });
    setShowOfferModal(false);
  };

  // Handle permission changes
  const handlePermissionChange = (feature: string, enabled: boolean) => {
    console.log(`${feature} ${enabled ? 'enabled' : 'disabled'}`);
  };

  // Table columns for all users
  const userColumns = [
    {
      title: 'User',
      key: 'user',
      render: (record: BasicAdmin | Agent) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
            {record.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <div className="font-medium">{record.name}</div>
            <div className="text-sm text-gray-500">{record.email}</div>
          </div>
        </div>
      )
    },
    {
      title: 'Role',
      key: 'role',
      render: (record: BasicAdmin | Agent) => (
        <Tag color={'team' in record ? 'purple' : 'blue'}>
          {'team' in record ? 'Basic Admin' : 'Agent'}
        </Tag>
      )
    },
    {
      title: 'Region',
      dataIndex: 'region',
      key: 'region'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'Active' ? 'green' : status === 'Pending' ? 'orange' : 'red'}>
          {status}
        </Tag>
      )
    },
    {
      title: 'Performance',
      key: 'performance',
      render: (record: BasicAdmin | Agent) => {
        if ('performance' in record) {
          return (
            <div>
              <Tag color={record.performance.grade === 'A' ? 'green' : record.performance.grade === 'B' ? 'orange' : 'red'}>
                Grade {record.performance.grade}
              </Tag>
              <div className="text-sm text-gray-600 mt-1">
                {record.performance.totalBookings} bookings
              </div>
            </div>
          );
        }
        return <span className="text-gray-400">Admin Role</span>;
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: BasicAdmin | Agent) => (
        <div className="flex gap-2">
          <Button size="small" onClick={() => setSelectedUser(record)}>
            <Eye size={14} />
          </Button>
          <Button size="small" onClick={() => handleUserAction(record.id, 'activate')}>
            <UserCheck size={14} />
          </Button>
          <Button size="small" danger onClick={() => handleUserAction(record.id, 'deactivate')}>
            <UserX size={14} />
          </Button>
        </div>
      )
    }
  ];

  // Table columns for complaints
  const complaintColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: (text: string) => <span className="font-mono text-xs">{text}</span>
    },
    {
      title: 'Customer',
      dataIndex: 'customerName',
      key: 'customerName'
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject'
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => <Tag>{category}</Tag>
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => (
        <Tag color={
          priority === 'Critical' ? 'red' : 
          priority === 'High' ? 'orange' : 
          priority === 'Medium' ? 'blue' : 'green'
        }>
          {priority}
        </Tag>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={
          status === 'Open' ? 'red' : 
          status === 'In Progress' ? 'orange' : 
          status === 'Resolved' ? 'green' : 'purple'
        }>
          {status}
        </Tag>
      )
    },
    {
      title: 'Assigned To',
      dataIndex: 'assignedTo',
      key: 'assignedTo',
      render: (assignedTo: string) => assignedTo || <span className="text-gray-400">Unassigned</span>
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: Complaint) => (
        <div className="flex gap-2">
          <Button size="small" onClick={() => setSelectedComplaint(record)}>
            View
          </Button>
          <Button size="small" onClick={() => handleAssignComplaint(record.id, 'ba1')}>
            Assign
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Top Navigation */}
      <nav className="bg-white/20 backdrop-blur-md border-b border-white/30 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left - Portal Title */}
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors"
              >
                <Home size={24} />
                <span className="text-xl font-bold">Super Admin Portal</span>
              </button>
            </div>

            {/* Center - Welcome Message */}
            <div className="hidden md:block">
              <h2 className="text-lg font-semibold text-gray-800">
                Welcome back, {superAdmin.name}
              </h2>
              <p className="text-sm text-gray-600">{superAdmin.role}</p>
            </div>

            {/* Right - Navigation */}
            <div className="flex items-center gap-4">
              <button className="text-gray-600 hover:text-gray-800 transition-colors font-medium">
                System Logs
              </button>
              <button className="text-purple-600 font-medium bg-purple-50 px-3 py-1 rounded-lg">
                Control Panel
              </button>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors font-medium"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Global Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/20 backdrop-blur-md border-white/30">
            <Statistic
              title="Total Users"
              value={totalUsers}
              prefix={<Users className="text-blue-500" size={20} />}
              valueStyle={{ color: '#3b82f6' }}
            />
          </Card>
          <Card className="bg-white/20 backdrop-blur-md border-white/30">
            <Statistic
              title="Total Revenue"
              value={totalRevenue}
              formatter={(value) => `₹${Number(value).toLocaleString('en-IN')}`}
              prefix={<DollarSign className="text-green-500" size={20} />}
              valueStyle={{ color: '#10b981' }}
            />
          </Card>
          <Card className="bg-white/20 backdrop-blur-md border-white/30">
            <Statistic
              title="Active Offers"
              value={activeOffers}
              prefix={<FileText className="text-purple-500" size={20} />}
              valueStyle={{ color: '#8b5cf6' }}
            />
          </Card>
          <Card className="bg-white/20 backdrop-blur-md border-white/30">
            <Statistic
              title="Total Complaints"
              value={totalComplaints}
              prefix={<AlertTriangle className="text-red-500" size={20} />}
              valueStyle={{ color: '#ef4444' }}
            />
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white/20 backdrop-blur-md rounded-lg border border-white/30 shadow-lg mb-6">
          <div className="flex flex-wrap gap-2 p-4">
            {[
              { key: 'overview', label: 'Overview', icon: <BarChart3 size={18} /> },
              { key: 'users', label: 'User Management', icon: <Users size={18} /> },
              { key: 'performance', label: 'Performance', icon: <TrendingUp size={18} /> },
              { key: 'complaints', label: 'Complaints', icon: <AlertTriangle size={18} /> },
              { key: 'offers', label: 'Offers', icon: <FileText size={18} /> },
              { key: 'permissions', label: 'Permissions', icon: <Shield size={18} /> },
              { key: 'incentives', label: 'Incentives', icon: <Award size={18} /> }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  activeTab === tab.key
                    ? 'bg-purple-500 text-white shadow-lg'
                    : 'bg-white/30 text-gray-700 hover:bg-white/50'
                }`}
              >
                {tab.icon}
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 shadow-lg p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">System Overview</h2>
              
              {/* Performance Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Bookings by Month" className="bg-white/30">
                  <div className="h-64 flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 size={48} className="text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">Chart visualization would be here</p>
                      <p className="text-sm text-gray-500">Showing cruise vs hotel bookings</p>
                    </div>
                  </div>
                </Card>
                
                <Card title="Revenue by Region" className="bg-white/30">
                  <div className="h-64 flex items-center justify-center">
                    <div className="text-center">
                      <PieChart size={48} className="text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">Pie chart would be here</p>
                      <p className="text-sm text-gray-500">Regional revenue distribution</p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-white/30">
                  <Statistic
                    title="Conversion Rate"
                    value={performanceMetrics.conversionRate}
                    suffix="%"
                    valueStyle={{ color: '#10b981' }}
                  />
                </Card>
                <Card className="bg-white/30">
                  <Statistic
                    title="Average Booking Value"
                    value={performanceMetrics.averageBookingValue}
                    formatter={(value) => `₹${Number(value).toLocaleString('en-IN')}`}
                    valueStyle={{ color: '#3b82f6' }}
                  />
                </Card>
                <Card className="bg-white/30">
                  <Statistic
                    title="Top Performer"
                    value={performanceMetrics.topPerformingAgent}
                    valueStyle={{ color: '#8b5cf6' }}
                  />
                </Card>
              </div>
            </div>
          )}

          {/* User Management Tab */}
          {activeTab === 'users' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
                <Button 
                  type="primary" 
                  icon={<Plus />}
                  onClick={() => setShowUserModal(true)}
                >
                  Add New User
                </Button>
              </div>
              
              <Table
                columns={userColumns}
                dataSource={[...basicAdmins, ...agents]}
                rowKey="id"
                className="bg-white/50 rounded-lg"
                pagination={{ pageSize: 10 }}
              />
            </div>
          )}

          {/* Performance Tab */}
          {activeTab === 'performance' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Performance Analytics</h2>
              
              {/* Agent Performance Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {agents.map(agent => (
                  <Card key={agent.id} className="bg-white/30">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                          {agent.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-medium">{agent.name}</div>
                          <div className="text-sm text-gray-600">{agent.region}</div>
                        </div>
                      </div>
                      <Tag color={agent.performance.grade === 'A' ? 'green' : agent.performance.grade === 'B' ? 'orange' : 'red'}>
                        Grade {agent.performance.grade}
                      </Tag>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Bookings:</span>
                        <span className="font-medium">{agent.performance.totalBookings}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Revenue:</span>
                        <span className="font-medium">₹{agent.performance.totalSales.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Success Rate:</span>
                        <span className="font-medium">{agent.performance.successRate}%</span>
                      </div>
                      <Progress percent={agent.performance.successRate} size="small" />
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Complaints Tab */}
          {activeTab === 'complaints' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Complaint Monitoring</h2>
                <div className="flex gap-2">
                  <Tag color="red">Open: {complaints.filter(c => c.status === 'Open').length}</Tag>
                  <Tag color="orange">In Progress: {complaints.filter(c => c.status === 'In Progress').length}</Tag>
                  <Tag color="green">Resolved: {complaints.filter(c => c.status === 'Resolved').length}</Tag>
                </div>
              </div>
              
              <Table
                columns={complaintColumns}
                dataSource={complaints}
                rowKey="id"
                className="bg-white/50 rounded-lg"
                pagination={{ pageSize: 10 }}
              />
            </div>
          )}

          {/* Offers Tab */}
          {activeTab === 'offers' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Offer Management</h2>
                <Button 
                  type="primary" 
                  icon={<Plus />}
                  onClick={() => setShowOfferModal(true)}
                >
                  Create Global Offer
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {offers.map(offer => (
                  <Card key={offer.id} className="bg-white/30">
                    <div className="mb-3">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold">{offer.title}</h4>
                        <Tag color={offer.status === 'Active' ? 'green' : offer.status === 'Expired' ? 'red' : 'orange'}>
                          {offer.status}
                        </Tag>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{offer.description}</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Discount:</span>
                          <span className="font-medium">
                            {offer.discountType === 'Percentage' ? `${offer.discountValue}%` : `₹${offer.discountValue}`}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Usage:</span>
                          <span>{offer.usageCount}/{offer.maxUsage || '∞'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Assigned Agents:</span>
                          <span>{offer.assignedAgents.length}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="small" icon={<Edit />} />
                      <Button size="small" icon={<Trash2 />} danger />
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Permissions Tab */}
          {activeTab === 'permissions' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">System Permissions</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card title="Basic Admin Permissions" className="bg-white/30">
                  <div className="space-y-4">
                    {[
                      { key: 'create_offers', label: 'Create Offers', enabled: true },
                      { key: 'manage_inventory', label: 'Manage Inventory', enabled: true },
                      { key: 'view_all_bookings', label: 'View All Bookings', enabled: false },
                      { key: 'delete_agents', label: 'Delete Agents', enabled: false }
                    ].map(permission => (
                      <div key={permission.key} className="flex justify-between items-center">
                        <span>{permission.label}</span>
                        <Switch 
                          checked={permission.enabled}
                          onChange={(checked) => handlePermissionChange(permission.key, checked)}
                        />
                      </div>
                    ))}
                  </div>
                </Card>

                <Card title="Regional Access Control" className="bg-white/30">
                  <div className="space-y-4">
                    {[
                      { region: 'North India', locked: false },
                      { region: 'South India', locked: false },
                      { region: 'West India', locked: true },
                      { region: 'East India', locked: false }
                    ].map(region => (
                      <div key={region.region} className="flex justify-between items-center">
                        <span>{region.region}</span>
                        <Button 
                          size="small"
                          icon={region.locked ? <Lock size={14} /> : <Unlock size={14} />}
                          onClick={() => handlePermissionChange(`region_${region.region}`, !region.locked)}
                        >
                          {region.locked ? 'Locked' : 'Open'}
                        </Button>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* Incentives Tab */}
          {activeTab === 'incentives' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Performance Incentives</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card className="bg-white/30">
                  <Statistic
                    title="A-Grade Incentive"
                    value={5000}
                    prefix="₹"
                    valueStyle={{ color: '#10b981' }}
                  />
                </Card>
                <Card className="bg-white/30">
                  <Statistic
                    title="B-Grade Incentive"
                    value={2500}
                    prefix="₹"
                    valueStyle={{ color: '#f59e0b' }}
                  />
                </Card>
                <Card className="bg-white/30">
                  <Statistic
                    title="Total Paid This Quarter"
                    value={47500}
                    prefix="₹"
                    valueStyle={{ color: '#8b5cf6' }}
                  />
                </Card>
              </div>

              {/* Agent Incentive Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {agents.map(agent => (
                  <Card key={agent.id} className="bg-white/30">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                          {agent.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-medium">{agent.name}</div>
                          <div className="text-sm text-gray-600">{agent.region}</div>
                        </div>
                      </div>
                      <Tag color={agent.performance.grade === 'A' ? 'green' : agent.performance.grade === 'B' ? 'orange' : 'red'}>
                        Grade {agent.performance.grade}
                      </Tag>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600 mb-1">
                        ₹{agent.performance.grade === 'A' ? '5,000' : agent.performance.grade === 'B' ? '2,500' : '0'}
                      </div>
                      <div className="text-sm text-gray-600">Quarterly Incentive</div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* User Details Modal */}
      <Modal
        title="User Details"
        open={!!selectedUser}
        onCancel={() => setSelectedUser(null)}
        footer={null}
        width={600}
      >
        {selectedUser && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                {selectedUser.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h3 className="text-xl font-bold">{selectedUser.name}</h3>
                <p className="text-gray-600">{selectedUser.email}</p>
                <Tag color={selectedUser.status === 'Active' ? 'green' : 'red'}>
                  {selectedUser.status}
                </Tag>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
                <p className="text-gray-900">{selectedUser.region}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Joined Date</label>
                <p className="text-gray-900">{selectedUser.joinedDate}</p>
              </div>
            </div>
            
            {'performance' in selectedUser && (
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <Card size="small">
                  <Statistic title="Total Bookings" value={selectedUser.performance.totalBookings} />
                </Card>
                <Card size="small">
                  <Statistic 
                    title="Commission Earned" 
                    value={selectedUser.performance.commissionEarned}
                    formatter={(value) => `₹${Number(value).toLocaleString('en-IN')}`}
                  />
                </Card>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Complaint Details Modal */}
      <Modal
        title="Complaint Details"
        open={!!selectedComplaint}
        onCancel={() => setSelectedComplaint(null)}
        footer={null}
      >
        {selectedComplaint && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
              <p className="text-gray-900">{selectedComplaint.customerName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <p className="text-gray-900">{selectedComplaint.subject}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <p className="text-gray-900">{selectedComplaint.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <Tag color={
                  selectedComplaint.priority === 'Critical' ? 'red' : 
                  selectedComplaint.priority === 'High' ? 'orange' : 'blue'
                }>
                  {selectedComplaint.priority}
                </Tag>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <Tag>{selectedComplaint.category}</Tag>
              </div>
            </div>
            {selectedComplaint.resolution && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Resolution</label>
                <p className="text-gray-900">{selectedComplaint.resolution}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Create Offer Modal */}
      <Modal
        title="Create Global Offer"
        open={showOfferModal}
        onCancel={() => setShowOfferModal(false)}
        onOk={() => handleCreateOffer({})}
      >
        <Form layout="vertical">
          <Form.Item label="Offer Title" required>
            <Input placeholder="Enter offer title" />
          </Form.Item>
          <Form.Item label="Description" required>
            <Input.TextArea placeholder="Enter offer description" />
          </Form.Item>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item label="Discount Type" required>
              <Select placeholder="Select discount type">
                <Select.Option value="percentage">Percentage</Select.Option>
                <Select.Option value="fixed">Fixed Amount</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="Discount Value" required>
              <InputNumber placeholder="Enter value" className="w-full" />
            </Form.Item>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item label="Valid From" required>
              <DatePicker className="w-full" />
            </Form.Item>
            <Form.Item label="Valid To" required>
              <DatePicker className="w-full" />
            </Form.Item>
          </div>
          <Form.Item label="Applicable For" required>
            <Select placeholder="Select applicable services">
              <Select.Option value="cruises">Cruises Only</Select.Option>
              <Select.Option value="hotels">Hotels Only</Select.Option>
              <Select.Option value="both">Both</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SuperAdminDashboard;