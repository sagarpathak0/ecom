import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faUser, faPhone, faTag } from '@fortawesome/free-solid-svg-icons';

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const router = useRouter();

  // Check authentication status on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token); // Set to true if token exists
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token
    setIsAuthenticated(false); // Update authentication state
    router.push('/login'); // Redirect to login page
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 flex justify-between items-center py-4">
        {/* Logo */}
        <div className="text-2xl font-extrabold text-gray-800">
          <Link href="/" className="hover:text-indigo-600 transition duration-300">
            ShopMate
          </Link>
        </div>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex md:space-x-6 text-gray-700 font-medium items-center">
          <li className="group flex items-center space-x-2">
            <FontAwesomeIcon
              icon={faTag}
              className="h-5 w-5 text-gray-500 group-hover:text-indigo-600 transition duration-300"
            />
            <Link href="/products" className="hover:text-indigo-600 transition duration-300">
              Products
            </Link>
          </li>
          <li className="group flex items-center space-x-2">
            <FontAwesomeIcon
              icon={faUser}
              className="h-5 w-5 text-gray-500 group-hover:text-indigo-600 transition duration-300"
            />
            <Link href="/about" className="hover:text-indigo-600 transition duration-300">
              About Us
            </Link>
          </li>
          <li className="group flex items-center space-x-2">
            <FontAwesomeIcon
              icon={faPhone}
              className="h-5 w-5 text-gray-500 group-hover:text-indigo-600 transition duration-300"
            />
            <Link href="/contact" className="hover:text-indigo-600 transition duration-300">
              Contact
            </Link>
          </li>
          <li className="group flex items-center space-x-2">
            <FontAwesomeIcon
              icon={faShoppingCart}
              className="h-5 w-5 text-gray-500 group-hover:text-indigo-600 transition duration-300"
            />
            <Link href="/cart" className="hover:text-indigo-600 transition duration-300">
              Cart
            </Link>
          </li>
          {isAuthenticated ? (
            <li>
              <button
                onClick={handleLogout}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition duration-300"
              >
                Logout
              </button>
            </li>
          ) : (
            <>
              <li>
                <Link href="/login" className="hover:text-indigo-600 transition duration-300">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-indigo-600 transition duration-300">
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>

        {/* Mobile Menu Icon */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="focus:outline-none text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-md">
          <ul className="flex flex-col space-y-4 py-4 px-4 text-gray-700 font-medium">
            <li className="flex items-center space-x-2">
              <FontAwesomeIcon icon={faTag} className="h-5 w-5 text-gray-500" />
              <Link href="/products" className="hover:text-indigo-600 transition duration-300">
                Products
              </Link>
            </li>
            <li className="flex items-center space-x-2">
              <FontAwesomeIcon icon={faUser} className="h-5 w-5 text-gray-500" />
              <Link href="/about" className="hover:text-indigo-600 transition duration-300">
                About Us
              </Link>
            </li>
            <li className="flex items-center space-x-2">
              <FontAwesomeIcon icon={faPhone} className="h-5 w-5 text-gray-500" />
              <Link href="/contact" className="hover:text-indigo-600 transition duration-300">
                Contact
              </Link>
            </li>
            <li className="flex items-center space-x-2">
              <FontAwesomeIcon icon={faShoppingCart} className="h-5 w-5 text-gray-500" />
              <Link href="/cart" className="hover:text-indigo-600 transition duration-300">
                Cart
              </Link>
            </li>
            {isAuthenticated ? (
              <li>
                <button
                  onClick={handleLogout}
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition duration-300"
                >
                  Logout
                </button>
              </li>
            ) : (
              <>
                <li>
                  <Link href="/login" className="hover:text-indigo-600 transition duration-300">
                    Login
                  </Link>
                </li>
                <li>
                  <Link href="/signup" className="hover:text-indigo-600 transition duration-300">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
