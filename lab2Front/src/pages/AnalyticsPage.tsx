import React, { useState, useEffect } from 'react';
import { BarChart3, Loader2, ChevronLeft, ChevronRight, Calendar, Store, Package, DollarSign, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

// Types
interface SaleData {
  date: string;
  quantity: number;
  store_name: string;
  product_name: string;
}

interface Statistics {
  total_quantity_sold: number;
  total_sales_amount: number;
}

interface ApiResponse {
  sales: SaleData[];
  total_count: number;
  limit: number;
  offset: number;
  current_page: number;
  total_pages: number;
  statistics: Statistics;
}

interface FilterState {
  start_date: string;
  end_date: string;
  store_filter: string;
  product_filter: string;
}

const AnalyticsPage = () => {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FilterState>({
    start_date: '',
    end_date: '',
    store_filter: '',
    product_filter: ''
  });
  const limit = 10;

  const fetchSales = async (page: number) => {
    try {
      setIsLoading(true);
      const offset = (page - 1) * limit;
      
      // Build query params
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
        ...(filters.start_date && { start_date: filters.start_date }),
        ...(filters.end_date && { end_date: filters.end_date }),
        ...(filters.store_filter && { store_filter: filters.store_filter }),
        ...(filters.product_filter && { product_filter: filters.product_filter })
      });

      const response = await fetch(
        `http://127.0.0.1:8000/sales/all?${params.toString()}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch sales data');
      }
      
      const jsonData = await response.json();
      setData(jsonData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSales(currentPage);
  }, [currentPage, filters]);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handlePageChange = (page: number) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentPage(page);
  };

  const StatCard = ({ title, value, icon: Icon, color }: { title: string; value: string; icon: React.ElementType; color: string }) => (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center space-x-4">
        <div className={`p-3 ${color} rounded-xl`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );

  const PaginationControls = () => {
    if (!data || data.total_pages <= 1) return null;

    const renderPageButton = (pageNum: number, isActive: boolean) => (
      <button
        key={pageNum}
        onClick={() => handlePageChange(pageNum)}
        className={`w-10 h-10 rounded-lg transition-colors ${
          isActive
            ? 'bg-blue-600 text-white'
            : 'hover:bg-blue-50 text-gray-600'
        } flex items-center justify-center`}
      >
        {pageNum}
      </button>
    );

    const renderEllipsis = (key: string) => (
      <span key={key} className="px-4 py-2 text-gray-400">
        ...
      </span>
    );

    const renderPaginationButtons = () => {
      const buttons = [];
      const totalPages = data.total_pages;

      if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, i) => 
          renderPageButton(i + 1, i + 1 === currentPage)
        );
      }

      buttons.push(renderPageButton(1, currentPage === 1));

      if (currentPage > 3) {
        buttons.push(renderEllipsis('start'));
      }

      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 3) {
        endPage = Math.min(5, totalPages - 1);
      }
      if (currentPage >= totalPages - 2) {
        startPage = Math.max(totalPages - 4, 2);
      }

      for (let i = startPage; i <= endPage; i++) {
        buttons.push(renderPageButton(i, i === currentPage));
      }

      if (currentPage < totalPages - 2) {
        buttons.push(renderEllipsis('end'));
      }

      buttons.push(renderPageButton(totalPages, currentPage === totalPages));

      return buttons;
    };

    return (
      <div className="flex items-center justify-center space-x-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-5 h-5 text-blue-600" />
        </button>
        
        <div className="flex space-x-2">
          {renderPaginationButtons()}
        </div>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === data.total_pages}
          className="p-2 rounded-lg hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Next page"
        >
          <ChevronRight className="w-5 h-5 text-blue-600" />
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
  <div className="container mx-auto px-4 py-6">
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-blue-100 rounded-xl">
          <BarChart3 className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Аналитика продаж</h1>
          <p className="text-gray-600">
            {data ? `Всего записей: ${data.total_count}` : 'Загрузка...'}
          </p>
        </div>
      </div>
      <Link 
        to="/" 
        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
      >
        На главную
      </Link>
    </div>
  </div>
</div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        {data && (
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <StatCard
              title="Общее количество продаж"
              value={data.statistics.total_quantity_sold.toLocaleString()}
              icon={ShoppingCart}
              color="bg-blue-600"
            />
            <StatCard
              title="Общая сумма продаж"
              value={`₽${data.statistics.total_sales_amount.toLocaleString()}`}
              icon={DollarSign}
              color="bg-blue-500"
            />
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Фильтры</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline-block mr-2" />
                Дата начала
              </label>
              <input
                type="date"
                value={filters.start_date}
                onChange={(e) => handleFilterChange('start_date', e.target.value)}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline-block mr-2" />
                Дата окончания
              </label>
              <input
                type="date"
                value={filters.end_date}
                onChange={(e) => handleFilterChange('end_date', e.target.value)}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Store className="w-4 h-4 inline-block mr-2" />
                Магазин
              </label>
              <input
                type="text"
                value={filters.store_filter}
                onChange={(e) => handleFilterChange('store_filter', e.target.value)}
                placeholder="Название магазина"
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Package className="w-4 h-4 inline-block mr-2" />
                Продукт
              </label>
              <input
                type="text"
                value={filters.product_filter}
                onChange={(e) => handleFilterChange('product_filter', e.target.value)}
                placeholder="Название продукта"
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="text-red-600 mb-2">Произошла ошибка при загрузке данных</div>
            <button
              onClick={() => fetchSales(currentPage)}
              className="text-blue-600 hover:text-blue-700"
            >
              Попробовать снова
            </button>
          </div>
        ) : (
          <>
            {/* Sales Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
              <div className="overflow-x-auto">
                <table className="w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Дата
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Магазин
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Продукт
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Количество
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data?.sales.map((sale, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(sale.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {sale.store_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {sale.product_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {sale.quantity}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            <div className="mt-8">
              <PaginationControls />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AnalyticsPage;