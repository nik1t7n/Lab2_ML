import React, { useState, useEffect } from 'react';
import { Store, Clock, MapPin, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { API_BASE_URL } from '../config';
import { Link } from 'react-router-dom';

// Types
interface StoreData {
  store_name: string;
  address: string;
  working_time: string;
}

interface ApiResponse {
  stores: StoreData[];
  total_count: number;
  limit: number;
  offset: number;
  current_page: number;
  total_pages: number;
}

const StoresPage = () => {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 5;

  const fetchStores = async (page: number) => {
    try {
      setIsLoading(true);
      const offset = (page - 1) * limit;
      const response = await fetch(
        `${API_BASE_URL}/stores/all?limit=${limit}&offset=${offset}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch stores');
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
    fetchStores(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentPage(page);
  };

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

      // Always show first page
      buttons.push(renderPageButton(1, currentPage === 1));

      if (currentPage > 3) {
        buttons.push(renderEllipsis('start'));
      }

      // Calculate middle pages
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

      // Always show last page
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

  const StoreCard = ({ store }: { store: StoreData }) => (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 border border-gray-100">
      <div className="flex flex-col h-full">
        <div className="mb-4">
          <div className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
            <Store className="w-4 h-4 mr-2" />
            Магазин
          </div>
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          {store.store_name}
        </h3>

        <div className="flex-grow space-y-4">
          <div className="flex items-start space-x-3">
            <MapPin className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
            <p className="text-gray-600 text-sm">{store.address}</p>
          </div>

          <div className="flex items-center space-x-3">
            <Clock className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <p className="text-gray-600 text-sm">{store.working_time}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
  <div className="container mx-auto px-4 py-6">
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-blue-100 rounded-xl">
          <Store className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Наши магазины</h1>
          <p className="text-gray-600">
            {data ? `Всего магазинов: ${data.total_count}` : 'Загрузка...'}
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
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="text-red-600 mb-2">Произошла ошибка при загрузке данных</div>
            <button
              onClick={() => fetchStores(currentPage)}
              className="text-blue-600 hover:text-blue-700"
            >
              Попробовать снова
            </button>
          </div>
        ) : (
          <>
            {/* Stores Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {data?.stores.map((store, index) => (
                <StoreCard key={index} store={store} />
              ))}
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

export default StoresPage;