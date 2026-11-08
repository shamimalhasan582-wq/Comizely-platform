import React, { useState, useRef, useEffect } from 'react';
import {
  CheckSquare,
  Plus,
  CheckCircle2,
  Clock,
  Trash2,
  SlidersHorizontal,
  ChevronDown,
  Download,
  Printer,
  Search,
  ArrowUpDown,
} from 'lucide-react';

interface TaskItem {
  id: string;
  title: string;
  priority: 'High' | 'Medium' | 'Low';
  dueDate: string;
  completed: boolean;
  assignedTo: string;
}

export const TasksView: React.FC = () => {
  const [tasks, setTasks] = useState<TaskItem[]>([
    {
      id: 't-1',
      title: 'Call MR MD Saidur Rahman to re-confirm Dhanmondi size choice on #21529',
      priority: 'High',
      dueDate: 'Today',
      completed: false,
      assignedTo: 'Admin',
    },
    {
      id: 't-2',
      title: 'Print packaging manifests for Steadfast courier batch (7 orders)',
      priority: 'High',
      dueDate: 'Today',
      completed: false,
      assignedTo: 'Fulfillment Team',
    },
    {
      id: 't-3',
      title: 'Restock Cotton Casual Shirt - Navy Blue (SKU: CCS-NB-01)',
      priority: 'Medium',
      dueDate: 'Tomorrow',
      completed: true,
      assignedTo: 'Warehouse',
    },
    {
      id: 't-4',
      title: 'Inspect returned items for #21512 (Size exchange request)',
      priority: 'Medium',
      dueDate: '29 Jul',
      completed: false,
      assignedTo: 'QC Inspector',
    },
    {
      id: 't-5',
      title: 'Verify bKash merchant transaction logs against order deliveries',
      priority: 'Low',
      dueDate: '30 Jul',
      completed: false,
      assignedTo: 'Accounts',
    },
  ]);

  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'All' | 'Pending' | 'Completed' | 'High Priority'>('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [moreActionsOpen, setMoreActionsOpen] = useState(false);
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [newTaskAssigned, setNewTaskAssigned] = useState('Admin');
  const [sortAsc, setSortAsc] = useState(true);

  const moreActionsRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (moreActionsRef.current && !moreActionsRef.current.contains(e.target as Node)) {
        setMoreActionsOpen(false);
      }
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTask = (id: string) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    setTasks([
      {
        id: `t-${Date.now()}`,
        title: newTaskTitle.trim(),
        priority: newTaskPriority,
        dueDate: 'Today',
        completed: false,
        assignedTo: newTaskAssigned,
      },
      ...tasks,
    ]);
    setNewTaskTitle('');
    setIsAddOpen(false);
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const markAllCompleted = () => {
    setTasks(tasks.map((t) => ({ ...t, completed: true })));
    setMoreActionsOpen(false);
  };

  const clearCompleted = () => {
    setTasks(tasks.filter((t) => !t.completed));
    setMoreActionsOpen(false);
  };

  const exportTasksToCSV = () => {
    const headers = ['Task Title', 'Priority', 'Assigned To', 'Due Date', 'Status'];
    const rows = filteredTasks.map((t) => [
      `"${t.title}"`,
      t.priority,
      `"${t.assignedTo}"`,
      `"${t.dueDate}"`,
      t.completed ? 'Completed' : 'Pending',
    ]);
    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `tasks_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setMoreActionsOpen(false);
  };

  const filteredTasks = tasks
    .filter((t) => {
      const matchSearch =
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.assignedTo.toLowerCase().includes(search.toLowerCase());
      const matchTab =
        activeTab === 'All'
          ? true
          : activeTab === 'Pending'
          ? !t.completed
          : activeTab === 'Completed'
          ? t.completed
          : t.priority === 'High';
      const matchPriority = priorityFilter === 'All' || t.priority === priorityFilter;
      return matchSearch && matchTab && matchPriority;
    })
    .sort((a, b) => {
      return sortAsc ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
    });

  const pendingCount = tasks.filter((t) => !t.completed).length;
  const completedCount = tasks.filter((t) => t.completed).length;
  const highCount = tasks.filter((t) => t.priority === 'High' && !t.completed).length;

  return (
    <div className="p-6 md:p-8 space-y-5 bg-[#F2F2F2]">
      {/* Top Header Row (Matches Orders style: Title on left, Filter + More Actions + Add Task on right) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Tasks</h1>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Filter Dropdown */}
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
              className={`flex items-center gap-2 px-4 py-2 bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 text-sm font-medium rounded-xl border transition-all cursor-pointer shadow-2xs ${
                filterDropdownOpen || priorityFilter !== 'All'
                  ? 'border-purple-300 ring-2 ring-purple-100 text-purple-700 font-semibold'
                  : 'border-slate-200/90'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4 text-purple-600" />
              <span>Filter</span>
              {priorityFilter !== 'All' && (
                <span className="w-5 h-5 rounded-full bg-purple-600 text-white text-[10px] font-bold flex items-center justify-center">
                  1
                </span>
              )}
            </button>

            {filterDropdownOpen && (
              <div className="absolute left-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 p-5 z-40 animate-in fade-in zoom-in-95 duration-100 space-y-4 text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-bold text-slate-900">Filter Priority</span>
                  </div>
                  {priorityFilter !== 'All' && (
                    <button
                      onClick={() => setPriorityFilter('All')}
                      className="text-xs text-purple-600 hover:text-purple-700 font-medium cursor-pointer"
                    >
                      Reset
                    </button>
                  )}
                </div>

                <div className="space-y-1.5">
                  {['All', 'High', 'Medium', 'Low'].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriorityFilter(p)}
                      className={`w-full py-2 px-3 rounded-lg text-left font-medium transition-colors cursor-pointer ${
                        priorityFilter === p
                          ? 'bg-purple-50 text-purple-700 font-bold'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => setFilterDropdownOpen(false)}
                    className="px-4 py-1.5 bg-[#8075FF] hover:bg-[#6e62ff] text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
                  >
                    Apply Filter
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* More Actions Dropdown */}
          <div className="relative" ref={moreActionsRef}>
            <button
              onClick={() => setMoreActionsOpen(!moreActionsOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 text-sm font-medium rounded-xl border border-slate-200/90 shadow-2xs transition-all cursor-pointer"
            >
              <span>More Actions</span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>

            {moreActionsOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-40 animate-in fade-in zoom-in-95 duration-100">
                <button
                  onClick={markAllCompleted}
                  className="w-full px-4 py-2 text-xs text-slate-700 hover:bg-purple-50 hover:text-purple-700 flex items-center gap-2.5 transition-colors cursor-pointer text-left"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Mark All Completed</span>
                </button>
                <button
                  onClick={clearCompleted}
                  className="w-full px-4 py-2 text-xs text-slate-700 hover:bg-purple-50 hover:text-purple-700 flex items-center gap-2.5 transition-colors cursor-pointer text-left"
                >
                  <Trash2 className="w-4 h-4 text-rose-500" />
                  <span>Clear Completed</span>
                </button>
                <button
                  onClick={exportTasksToCSV}
                  className="w-full px-4 py-2 text-xs text-slate-700 hover:bg-purple-50 hover:text-purple-700 flex items-center gap-2.5 transition-colors cursor-pointer text-left"
                >
                  <Download className="w-4 h-4 text-slate-400" />
                  <span>Export Tasks CSV</span>
                </button>
              </div>
            )}
          </div>

          {/* Primary Action Button */}
          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#8075FF] hover:bg-[#6e62ff] text-white text-sm font-semibold rounded-2xl shadow-sm shadow-[#8075FF]/25 transition-all cursor-pointer hover:shadow-md active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Main Table Card (matches Orders table card container) */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        {/* Sub-tabs & Search Toolbar Row */}
        <div className="px-6 pt-5 pb-4 flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 gap-4">
          {/* Left Status Tabs */}
          <div className="flex items-center gap-6 overflow-x-auto pb-1 md:pb-0 scrollbar-none text-sm select-none">
            <button
              onClick={() => setActiveTab('All')}
              className={`pb-1 whitespace-nowrap text-sm transition-all cursor-pointer relative ${
                activeTab === 'All'
                  ? 'font-bold text-slate-900 border-b-2 border-purple-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              All ({tasks.length})
            </button>
            <button
              onClick={() => setActiveTab('Pending')}
              className={`pb-1 whitespace-nowrap text-sm transition-all cursor-pointer relative ${
                activeTab === 'Pending'
                  ? 'font-bold text-slate-900 border-b-2 border-purple-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Pending ({pendingCount})
            </button>
            <button
              onClick={() => setActiveTab('Completed')}
              className={`pb-1 whitespace-nowrap text-sm transition-all cursor-pointer relative ${
                activeTab === 'Completed'
                  ? 'font-bold text-slate-900 border-b-2 border-purple-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Completed ({completedCount})
            </button>
            <button
              onClick={() => setActiveTab('High Priority')}
              className={`pb-1 whitespace-nowrap text-sm transition-all cursor-pointer relative ${
                activeTab === 'High Priority'
                  ? 'font-bold text-slate-900 border-b-2 border-purple-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              High Priority ({highCount})
            </button>
          </div>

          {/* Right Toolbar: Search input, Sort button */}
          <div className="flex items-center gap-3 self-end md:self-auto">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tasks..."
                className="pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-400 focus:bg-white w-48 sm:w-60 transition-all"
              />
            </div>

            <button
              onClick={() => setSortAsc(!sortAsc)}
              className="p-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-500 transition-colors cursor-pointer"
              title={`Sort ${sortAsc ? 'Ascending' : 'Descending'}`}
            >
              <ArrowUpDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tasks Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-600 font-semibold">
                <th className="py-3 px-5 w-12 text-center">Done</th>
                <th className="py-3 px-4">Task Description</th>
                <th className="py-3 px-4">Assigned To</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4 text-center">Priority</th>
                <th className="py-3 pr-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No tasks found matching current filter.
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task, idx) => (
                  <tr
                    key={task.id}
                    className={`transition-colors ${
                      task.completed
                        ? 'bg-slate-50/40 opacity-70'
                        : idx % 2 === 1
                        ? 'bg-[#f8f9fe] hover:bg-[#edf0fd]/80'
                        : 'bg-white hover:bg-slate-50/80'
                    }`}
                  >
                    <td className="py-3.5 px-5 text-center">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTask(task.id)}
                        className="w-4 h-4 rounded text-purple-600 focus:ring-purple-400 cursor-pointer accent-purple-600"
                      />
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      <span className={task.completed ? 'line-through text-slate-400' : 'text-slate-800'}>
                        {task.title}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{task.assignedTo}</td>
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">{task.dueDate}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          task.priority === 'High'
                            ? 'bg-rose-50 text-rose-600 border border-rose-200'
                            : task.priority === 'Medium'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-blue-50 text-blue-600 border border-blue-200'
                        }`}
                      >
                        {task.priority}
                      </span>
                    </td>
                    <td className="py-3.5 pr-5 text-right">
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Delete task"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Task Modal with the same unified styling */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100/80">
            {/* Subtle decorative glow mesh */}
            <div
              className="absolute -top-10 -left-10 w-44 h-32 rounded-full bg-gradient-to-br from-purple-400/30 via-indigo-400/25 to-pink-400/10 blur-2xl pointer-events-none"
              aria-hidden="true"
            />

            <div className="relative flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900 tracking-tight">Create New Task</h2>
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-colors cursor-pointer shrink-0"
              >
                ✕
              </button>
            </div>

            <form onSubmit={addTask} className="relative space-y-4 text-xs">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Task Description *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. Call customer to verify Dhanmondi address..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Priority</label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-400"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Assign To</label>
                  <select
                    value={newTaskAssigned}
                    onChange={(e) => setNewTaskAssigned(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-400"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Fulfillment Team">Fulfillment Team</option>
                    <option value="Warehouse">Warehouse</option>
                    <option value="QC Inspector">QC Inspector</option>
                    <option value="Accounts">Accounts</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#8075FF] hover:bg-[#6e62ff] text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors shadow-sm shadow-[#8075FF]/25"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
