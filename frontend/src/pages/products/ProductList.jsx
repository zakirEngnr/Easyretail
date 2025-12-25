import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  Package,
  ChevronRight,
  ChevronLeft,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Download,
  RefreshCw,
  X,
  Save,
  Hash,
  Tag,
  Layers,
  DollarSign,
  Upload,
  Image as ImageIcon
} from 'lucide-react';

const ProductList = () => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [animateStats, setAnimateStats] = useState(false);
  
  // New product state
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Clothing',
    price: '',
    stock: '',
    status: 'in-stock',
    description: '',
  });

  // Load products from localStorage on initial render
  const [products, setProducts] = useState(() => {
    const savedProducts = localStorage.getItem('products');
    return savedProducts ? JSON.parse(savedProducts) : [];
  });

  // Save products to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    setAnimateStats(true);
    const timer = setTimeout(() => setAnimateStats(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Categories with updated counts based on actual products
  const categories = [
    { name: 'All Categories', count: products.length, color: 'from-blue-500 to-cyan-500' },
    { name: 'Clothing', count: products.filter(p => p.category === 'Clothing').length, color: 'from-purple-500 to-pink-500' },
    { name: 'Electronics', count: products.filter(p => p.category === 'Electronics').length, color: 'from-blue-500 to-indigo-500' },
    { name: 'Accessories', count: products.filter(p => p.category === 'Accessories').length, color: 'from-emerald-500 to-green-500' },
    { name: 'Food', count: products.filter(p => p.category === 'Food').length, color: 'from-amber-500 to-orange-500' },
    { name: 'Fitness', count: products.filter(p => p.category === 'Fitness').length, color: 'from-red-500 to-rose-500' },
  ];

  // Calculate status stats based on actual products
  const statusStats = [
    { 
      label: 'In Stock', 
      count: products.filter(p => p.status === 'in-stock').length, 
      color: 'bg-emerald-500' 
    },
    { 
      label: 'Low Stock', 
      count: products.filter(p => p.status === 'low-stock').length, 
      color: 'bg-amber-500' 
    },
    { 
      label: 'Out of Stock', 
      count: products.filter(p => p.status === 'out-of-stock').length, 
      color: 'bg-red-500' 
    },
  ];

  // Filter products based on search, category, and status
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase()) ||
                         product.id.toLowerCase().includes(search.toLowerCase()) ||
                         product.category.toLowerCase().includes(search.toLowerCase());
    
    const matchesCategory = categoryFilter === 'All Categories' || product.category === categoryFilter;
    const matchesStatus = statusFilter === 'All Status' || product.status === statusFilter.toLowerCase().replace(' ', '-');
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Delete product function
  const handleDeleteProduct = () => {
    if (selectedProduct) {
      setProducts(products.filter(p => p.id !== selectedProduct.id));
      setShowDeleteModal(false);
      setSelectedProduct(null);
    }
  };

  // Edit product function
  const handleEditProduct = () => {
    if (selectedProduct) {
      const updatedProducts = products.map(p =>
        p.id === selectedProduct.id ? selectedProduct : p
      );
      setProducts(updatedProducts);
      setShowEditModal(false);
      setSelectedProduct(null);
    }
  };

  // Add new product function
  const handleAddProduct = () => {
    if (newProduct.name && newProduct.price && newProduct.stock) {
      const newProd = {
        id: `PROD-${String(products.length + 1).padStart(3, '0')}`,
        name: newProduct.name,
        category: newProduct.category,
        price: `$${parseFloat(newProduct.price).toFixed(2)}`,
        stock: parseInt(newProduct.stock),
        status: newProduct.status,
        sales: Math.floor(Math.random() * 200), // Random sales for demo
        description: newProduct.description || 'No description available.',
        sku: `SKU-${String(products.length + 1).padStart(3, '0')}`,
        image: newProduct.image || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop'
      };
      
      setProducts([...products, newProd]);
      setShowAddModal(false);
      setNewProduct({
        name: '',
        category: 'Clothing',
        price: '',
        stock: '',
        status: 'in-stock',
        description: '',
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop'
      });
    }
  };

  // View product function
  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setShowViewModal(true);
  };

  // Edit button click
  const handleEditClick = (product) => {
    setSelectedProduct({...product});
    setShowEditModal(true);
  };

  // Delete button click
  const handleDeleteClick = (product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  // Export function
  const handleExport = () => {
    if (products.length === 0) {
      alert('No products to export!');
      return;
    }
    
    const dataStr = JSON.stringify(products, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'products-export.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Clear all products function
  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all products? This cannot be undone.')) {
      setProducts([]);
      setSearch('');
      setCategoryFilter('All Categories');
      setStatusFilter('All Status');
      setCurrentPage(1);
    }
  };

  // Reset filters function
  const handleResetFilters = () => {
    setSearch('');
    setCategoryFilter('All Categories');
    setStatusFilter('All Status');
    setCurrentPage(1);
  };

  // Calculate average price
  const calculateAveragePrice = () => {
    if (products.length === 0) return '$0.00';
    
    const total = products.reduce((sum, product) => {
      const price = parseFloat(product.price.replace('$', ''));
      return sum + price;
    }, 0);
    
    return `$${(total / products.length).toFixed(2)}`;
  };

  // Calculate total sales
  const calculateTotalSales = () => {
    return products.reduce((sum, product) => sum + product.sales, 0);
  };

  // Handle input change for edit modal
  const handleEditInputChange = (field, value) => {
    setSelectedProduct(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle input change for add modal
  const handleAddInputChange = (field, value) => {
    setNewProduct(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle image upload
  const handleImageUpload = (e, isEdit = false) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isEdit && selectedProduct) {
          handleEditInputChange('image', reader.result);
        } else {
          handleAddInputChange('image', reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Calculate pagination
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  // Get unique categories for filter dropdown
  const uniqueCategories = ['All Categories', ...new Set(products.map(p => p.category))];

  return (
    <div className="min-h-screen bg-gray-50 transition-all duration-300">
      <div className="relative">
        {/* Header */}
        <div className="px-3 sm:px-4 lg:px-6 pt-6 sm:pt-8 pb-4 sm:pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900 tracking-tight">
                Products Management
              </h1>
              <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                {products.length === 0 ? 'No products yet. Add your first product!' : `Managing ${products.length} products`}
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-0">
              <button 
                onClick={handleExport}
                className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-300 shadow-sm hover:shadow text-xs sm:text-sm"
              >
                <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Export</span>
              </button>
              {products.length > 0 && (
                <button 
                  onClick={handleClearAll}
                  className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-all duration-300 shadow-sm hover:shadow text-xs sm:text-sm"
                >
                  <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden xs:inline">Clear All</span>
                </button>
              )}
              <button 
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-300 shadow-sm hover:shadow text-xs sm:text-sm"
              >
                <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Add Product</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-3 sm:px-4 lg:px-6 pb-6 sm:pb-8">
          {/* Category Filters */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 mb-6">
            {categories.map((category) => (
              <div 
                key={category.name}
                className={`group relative bg-white rounded-xl border shadow-sm 
                  hover:shadow-md transition-all duration-300 ease-in-out overflow-hidden cursor-pointer
                  ${categoryFilter === category.name ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-gray-300'}`}
                onClick={() => setCategoryFilter(category.name)}
              >
                <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${category.color}`}></div>
                
                <div className="p-3 sm:p-4">
                  <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-0.5 sm:mb-1">
                    {category.count}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 font-medium truncate">
                    {category.name}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {products.length === 0 && (
            <div className="group bg-white rounded-xl border border-gray-300 shadow-sm hover:shadow-md transition-all duration-300 ease-in-out mb-6">
              <div className="p-8 sm:p-12 text-center">
                <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 flex items-center justify-center mb-4">
                  <Package className="h-8 w-8 sm:h-10 sm:w-10 text-blue-500" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                  No Products Yet
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Get started by adding your first product. Manage inventory, track sales, and monitor stock levels.
                </p>
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-300 shadow-sm hover:shadow"
                >
                  <Plus className="h-4 w-4" />
                  Add Your First Product
                </button>
              </div>
            </div>
          )}

          {/* Search and Filters - Only show if there are products */}
          {products.length > 0 && (
            <div className="group bg-white rounded-xl border border-gray-300 shadow-sm hover:shadow-md transition-all duration-300 ease-in-out mb-4 sm:mb-6">
              <div className="p-4 sm:p-5 lg:p-6">
                <div className="flex flex-col lg:flex-row lg:items-center gap-3 sm:gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-3 w-3 sm:h-4 sm:w-4 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search products by name, SKU, or category..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 sm:pl-11 pr-3 sm:pr-4 py-2 sm:py-2.5 border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm transition-all duration-300 w-full"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <select 
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="px-3 sm:pl-10 sm:pr-4 py-2 sm:py-2.5 border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm transition-all duration-300 w-full sm:w-auto"
                    >
                      {uniqueCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <select 
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-3 sm:pl-10 sm:pr-4 py-2 sm:py-2.5 border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm transition-all duration-300 w-full sm:w-auto"
                    >
                      <option>All Status</option>
                      <option>In Stock</option>
                      <option>Low Stock</option>
                      <option>Out of Stock</option>
                    </select>
                    <button 
                      onClick={handleResetFilters}
                      className="flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-all duration-300 text-xs sm:text-sm"
                    >
                      <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4" />
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Products Table - Only show if there are products */}
          {products.length > 0 && (
            <div className="group bg-white rounded-xl border border-gray-300 shadow-sm hover:shadow-md transition-all duration-300 ease-in-out overflow-hidden mb-6 sm:mb-8">
              <div className="p-4 sm:p-5 lg:p-6 border-b border-gray-300">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">All Products</h2>
                    <p className="text-sm text-gray-600">
                      {filteredProducts.length === products.length 
                        ? 'Showing all products' 
                        : `Filtered: ${filteredProducts.length} of ${products.length} products`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-3 sm:mt-0">
                    <button 
                      onClick={handleClearAll}
                      className="p-2 rounded-lg border border-gray-300 bg-gray-50 hover:bg-red-50/50 transition-all duration-300 hover:scale-105"
                    >
                      <Trash2 className="h-4 w-4 text-gray-600" />
                    </button>
                    <div className="text-sm text-gray-600">
                      Showing <span className="font-semibold text-gray-900">{paginatedProducts.length}</span> of{' '}
                      <span className="font-semibold text-gray-900">{filteredProducts.length}</span> products
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <div className="min-w-full">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Stock
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Sales
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {paginatedProducts.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50 transition-colors duration-150">
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center gap-2 sm:gap-3">
                              <div className="relative h-8 w-8 sm:h-10 sm:w-10 rounded-lg overflow-hidden flex-shrink-0">
                                <img 
                                  src={product.image} 
                                  alt={product.name}
                                  className="absolute inset-0 w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop';
                                  }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20"></div>
                              </div>
                              <div className="min-w-0">
                                <div className="font-medium text-gray-900 text-xs sm:text-sm truncate">{product.name}</div>
                                <div className="text-xs text-gray-500 truncate">{product.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-gray-700 text-xs sm:text-sm">{product.category}</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className="font-semibold text-gray-900 text-xs sm:text-sm">
                              {product.price}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center gap-1 sm:gap-2">
                              <span className={`font-semibold text-xs sm:text-sm ${
                                product.status === 'in-stock' ? 'text-emerald-600' :
                                product.status === 'low-stock' ? 'text-amber-600' : 'text-red-500'
                              }`}>
                                {product.stock} units
                              </span>
                              {product.status === 'low-stock' && (
                                <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 text-amber-500" />
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border text-xs font-medium ${
                              product.status === 'in-stock' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                              product.status === 'low-stock' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                              'bg-red-50 text-red-700 border-red-200'
                            }`}>
                              {product.status === 'in-stock' ? (
                                <CheckCircle className="h-3 w-3" />
                              ) : (
                                <AlertCircle className="h-3 w-3" />
                              )}
                              {product.status === 'in-stock' ? 'In Stock' : product.status === 'low-stock' ? 'Low Stock' : 'Out of Stock'}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center gap-1 sm:gap-2">
                              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-500" />
                              <span className="font-medium text-gray-900 text-xs sm:text-sm">{product.sales}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center space-x-1 sm:space-x-2">
                              <button 
                                onClick={() => handleViewProduct(product)}
                                className="p-1 hover:bg-blue-50/50 rounded-lg transition-all duration-300 hover:scale-110"
                              >
                                <Eye className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                              </button>
                              <button 
                                onClick={() => handleEditClick(product)}
                                className="p-1 hover:bg-blue-50/50 rounded-lg transition-all duration-300 hover:scale-110"
                              >
                                <Edit className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                              </button>
                              <button 
                                onClick={() => handleDeleteClick(product)}
                                className="p-1 hover:bg-red-50/50 rounded-lg transition-all duration-300 hover:scale-110"
                              >
                                <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="p-4 sm:p-6 border-t border-gray-300">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                  <p className="text-sm text-gray-700">
                    Page <span className="font-medium text-gray-900">{currentPage}</span> of{' '}
                    <span className="font-medium text-gray-900">{totalPages}</span>
                  </p>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <button 
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      className="p-1.5 sm:p-2 rounded-lg border border-gray-300 bg-gray-50 hover:bg-blue-50/50 text-gray-700 hover:text-gray-900 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                    </button>
                    {[...Array(totalPages)].map((_, index) => (
                      <button
                        key={index + 1}
                        onClick={() => setCurrentPage(index + 1)}
                        className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 text-xs sm:text-sm ${
                          currentPage === index + 1
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'border border-gray-300 bg-gray-50 text-gray-700 hover:bg-blue-50/50 hover:text-gray-900'
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                    <button 
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      className="p-1.5 sm:p-2 rounded-lg border border-gray-300 bg-gray-50 hover:bg-blue-50/50 text-gray-700 hover:text-gray-900 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Stats Grid - Only show if there are products */}
          {products.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Inventory Status */}
              <div className="group bg-white rounded-xl border border-gray-300 shadow-sm hover:shadow-md transition-all duration-300 ease-in-out overflow-hidden">
                <div className="p-4 sm:p-5 lg:p-6">
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Inventory Status</h3>
                      <p className="text-sm text-gray-600">Stock overview</p>
                    </div>
                    <div className="p-2 rounded-lg bg-blue-50">
                      <Package className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                  
                  <div className="space-y-3 sm:space-y-4">
                    {statusStats.map((stat, index) => (
                      <div key={stat.label} className="space-y-1.5 sm:space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">{stat.label}</span>
                          <span className="text-sm font-medium text-gray-900">{stat.count} products</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${stat.color} rounded-full transition-all duration-1000`}
                            style={{ width: `${products.length > 0 ? (stat.count / products.length) * 100 : 0}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="group bg-white rounded-xl border border-gray-300 shadow-sm hover:shadow-md transition-all duration-300 ease-in-out overflow-hidden">
                <div className="p-4 sm:p-5 lg:p-6">
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Product Insights</h3>
                      <p className="text-sm text-gray-600">Key metrics</p>
                    </div>
                    <div className="p-2 rounded-lg bg-emerald-50">
                      <TrendingUp className="h-5 w-5 text-emerald-600" />
                    </div>
                  </div>
                  
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex justify-between items-center p-3 rounded-lg bg-blue-50/30 hover:bg-blue-50/50 transition-colors duration-300">
                      <span className="text-gray-700">Total Products</span>
                      <span className="font-semibold text-gray-900">{products.length}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-emerald-50/30 hover:bg-emerald-50/50 transition-colors duration-300">
                      <span className="text-gray-700">Avg. Price</span>
                      <span className="font-semibold text-gray-900">{calculateAveragePrice()}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-purple-50/30 hover:bg-purple-50/50 transition-colors duration-300">
                      <span className="text-gray-700">Total Sales</span>
                      <span className="font-semibold text-gray-900">{calculateTotalSales()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="group bg-white rounded-xl border border-gray-300 shadow-sm hover:shadow-md transition-all duration-300 ease-in-out overflow-hidden">
                <div className="p-4 sm:p-5 lg:p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Quick Actions</h3>
                  
                  <div className="space-y-2 sm:space-y-3">
                    <button 
                      onClick={() => setShowAddModal(true)}
                      className="w-full flex items-center justify-center gap-1 sm:gap-2 px-4 py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-300 shadow-sm hover:shadow text-sm"
                    >
                      <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                      Add New Product
                    </button>
                    <button 
                      onClick={handleExport}
                      className="w-full flex items-center justify-center gap-1 sm:gap-2 px-4 py-2.5 sm:py-3 bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-gray-900 font-medium rounded-lg border border-gray-300 transition-all duration-300 text-sm"
                    >
                      <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                      Export Products
                    </button>
                    <button 
                      onClick={handleClearAll}
                      className="w-full flex items-center justify-center gap-1 sm:gap-2 px-4 py-2.5 sm:py-3 bg-red-50 hover:bg-red-100 text-red-700 hover:text-red-900 font-medium rounded-lg border border-red-200 transition-all duration-300 text-sm"
                    >
                      <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                      Clear All Products
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-3 sm:p-4">
          <div className="relative w-full max-w-md">
            <div className="bg-white rounded-2xl border border-gray-300 shadow-2xl p-4 sm:p-5 lg:p-6">
              <div className="mb-4 sm:mb-6">
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-r from-red-500/20 to-rose-500/20 flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Delete Product</h3>
                    <p className="text-sm text-gray-600">This action cannot be undone</p>
                  </div>
                </div>
                
                <p className="text-gray-700 text-sm sm:text-base">
                  Are you sure you want to delete <span className="font-semibold text-gray-900">"{selectedProduct?.name}"</span>? 
                  All product data will be permanently removed.
                </p>
              </div>
              
              <div className="flex justify-end gap-2 sm:gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedProduct(null);
                  }}
                  className="px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-50 hover:bg-blue-50/50 text-gray-700 hover:text-gray-900 font-medium rounded-lg border border-gray-300 transition-all duration-300 hover:scale-105 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteProduct}
                  className="px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-medium rounded-lg transition-all duration-300 shadow-sm hover:shadow hover:scale-105 text-sm"
                >
                  Delete Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Product Modal */}
      {showViewModal && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-3 sm:p-4">
          <div className="relative w-full max-w-2xl">
            <div className="bg-white rounded-2xl border border-gray-300 shadow-2xl p-4 sm:p-5 lg:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                    <Eye className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Product Details</h3>
                    <p className="text-sm text-gray-600">View product information</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setSelectedProduct(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                <div className="md:col-span-2 space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src={selectedProduct.image} 
                        alt={selectedProduct.name}
                        className="absolute inset-0 w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop';
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-2">Product Information</h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-700">Name: </span>
                            <span className="font-medium text-gray-900">{selectedProduct.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Tag className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-700">Category: </span>
                            <span className="font-medium text-gray-900">{selectedProduct.category}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Hash className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-700">SKU: </span>
                            <span className="font-medium text-gray-900">{selectedProduct.id}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-700">Price: </span>
                            <span className="font-medium text-gray-900">{selectedProduct.price}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Layers className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-700">Stock: </span>
                            <span className={`font-medium ${
                              selectedProduct.status === 'in-stock' ? 'text-emerald-600' :
                              selectedProduct.status === 'low-stock' ? 'text-amber-600' : 'text-red-500'
                            }`}>
                              {selectedProduct.stock} units
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                    <p className="text-gray-700 bg-gray-50 rounded-lg p-4">
                      {selectedProduct.description}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Status</h4>
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
                      selectedProduct.status === 'in-stock' ? 'bg-emerald-50 text-emerald-700' :
                      selectedProduct.status === 'low-stock' ? 'bg-amber-50 text-amber-700' :
                      'bg-red-50 text-red-700'
                    }`}>
                      {selectedProduct.status === 'in-stock' ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <AlertCircle className="h-4 w-4" />
                      )}
                      <span className="font-medium">
                        {selectedProduct.status === 'in-stock' ? 'In Stock' : 
                         selectedProduct.status === 'low-stock' ? 'Low Stock' : 'Out of Stock'}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Sales Performance</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-700">Total Sales:</span>
                        <span className="font-semibold text-gray-900">{selectedProduct.sales}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-emerald-500" />
                        <span className="text-sm text-gray-600">Good performance</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <button
                      onClick={() => {
                        setShowViewModal(false);
                        handleEditClick(selectedProduct);
                      }}
                      className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                      Edit Product
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditModal && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-3 sm:p-4">
          <div className="relative w-full max-w-md">
            <div className="bg-white rounded-2xl border border-gray-300 shadow-2xl p-4 sm:p-5 lg:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                    <Edit className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Edit Product</h3>
                    <p className="text-sm text-gray-600">Update product information</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedProduct(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              
              <div className="space-y-4">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Image
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                      <img 
                        src={selectedProduct.image} 
                        alt={selectedProduct.name}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg border border-gray-300 cursor-pointer transition-colors">
                        <Upload className="h-4 w-4" />
                        Upload Image
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, true)}
                          className="hidden"
                        />
                      </label>
                      <p className="text-xs text-gray-500 mt-1">JPG, PNG up to 2MB</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={selectedProduct.name}
                    onChange={(e) => handleEditInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter product name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={selectedProduct.category}
                    onChange={(e) => handleEditInputChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Clothing">Clothing</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Food">Food</option>
                    <option value="Fitness">Fitness</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price
                    </label>
                    <input
                      type="text"
                      value={selectedProduct.price.replace('$', '')}
                      onChange={(e) => handleEditInputChange('price', `$${e.target.value}`)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Stock
                    </label>
                    <input
                      type="number"
                      value={selectedProduct.stock}
                      onChange={(e) => handleEditInputChange('stock', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={selectedProduct.status}
                    onChange={(e) => handleEditInputChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="in-stock">In Stock</option>
                    <option value="low-stock">Low Stock</option>
                    <option value="out-of-stock">Out of Stock</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={selectedProduct.description}
                    onChange={(e) => handleEditInputChange('description', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="3"
                    placeholder="Enter product description"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedProduct(null);
                  }}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditProduct}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  <Save className="inline h-4 w-4 mr-2" />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-3 sm:p-4">
          <div className="relative w-full max-w-md">
            <div className="bg-white rounded-2xl border border-gray-300 shadow-2xl p-4 sm:p-5 lg:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                    <Plus className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Add New Product</h3>
                    <p className="text-sm text-gray-600">Create a new product entry</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              
              <div className="space-y-4">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Image
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                      <img 
                        src={newProduct.image} 
                        alt="Preview"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg border border-gray-300 cursor-pointer transition-colors">
                        <Upload className="h-4 w-4" />
                        Upload Image
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, false)}
                          className="hidden"
                        />
                      </label>
                      <p className="text-xs text-gray-500 mt-1">JPG, PNG up to 2MB</p>
                      <input
                        type="text"
                        value={newProduct.image}
                        onChange={(e) => handleAddInputChange('image', e.target.value)}
                        className="w-full mt-2 px-3 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Or enter image URL"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => handleAddInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter product name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => handleAddInputChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Clothing">Clothing</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Food">Food</option>
                    <option value="Fitness">Fitness</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price ($) *
                    </label>
                    <input
                      type="number"
                      value={newProduct.price}
                      onChange={(e) => handleAddInputChange('price', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.00"
                      step="0.01"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Stock *
                    </label>
                    <input
                      type="number"
                      value={newProduct.stock}
                      onChange={(e) => handleAddInputChange('stock', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={newProduct.status}
                    onChange={(e) => handleAddInputChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="in-stock">In Stock</option>
                    <option value="low-stock">Low Stock</option>
                    <option value="out-of-stock">Out of Stock</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newProduct.description}
                    onChange={(e) => handleAddInputChange('description', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="3"
                    placeholder="Enter product description (optional)"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddProduct}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  <Save className="inline h-4 w-4 mr-2" />
                  Add Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;