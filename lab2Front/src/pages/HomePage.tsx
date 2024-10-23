import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, ShoppingBag, BarChart3, ArrowRight, Menu, X } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Магазины', path: '/stores' },
    { name: 'Продукты', path: '/products' },
    { name: 'Аналитика', path: '/analytics' }
  ];

  const features = [
    {
      icon: <Store className="w-8 h-8 text-white" />,
      title: "Управление магазинами",
      description: "Эффективное управление сетью магазинов в одном интерфейсе",
      path: "/stores",
      color: "bg-blue-600"
    },
    {
      icon: <ShoppingBag className="w-8 h-8 text-white" />,
      title: "Каталог продуктов",
      description: "Организация и контроль товарного ассортимента",
      path: "/products",
      color: "bg-blue-500"
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-white" />,
      title: "Аналитика продаж",
      description: "Подробная статистика и анализ эффективности",
      path: "/analytics",
      color: "bg-blue-400"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Floating Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        scrollPosition > 50 ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold text-blue-600">
              StoreFlow
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              {navLinks.map((link) => (
                <button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  {link.name}
                </button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? 
                <X className="w-6 h-6 text-blue-600" /> : 
                <Menu className="w-6 h-6 text-blue-600" />
              }
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg py-4">
              {navLinks.map((link) => (
                <button
                  key={link.path}
                  onClick={() => {
                    navigate(link.path);
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-blue-50"
                >
                  {link.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-32 pb-20 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Управляйте бизнесом 
              <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
                эффективно
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-4">
              Комплексное решение для управления магазинами, товарами и аналитикой продаж
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group relative overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-2"
                onClick={() => navigate(feature.path)}
              >
                <div className={`${feature.color} p-8 h-full cursor-pointer`}>
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    {feature.icon}
                  </div>
                  <div className="relative z-10">
                    <div className="mb-6">{feature.icon}</div>
                    <h3 className="text-2xl font-semibold text-white mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-blue-50 mb-6">
                      {feature.description}
                    </p>
                    <div className="flex items-center text-white group-hover:translate-x-2 transition-transform">
                      Подробнее
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section with Animation */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { value: '100+', label: 'Активных магазинов' },
              { value: '50k+', label: 'Транзакций в день' },
              { value: '99.9%', label: 'Точность данных' }
            ].map((stat, index) => (
              <div 
                key={index}
                className="text-center p-8 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors"
              >
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;