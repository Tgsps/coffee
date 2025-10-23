// Mock API for testing without backend
const mockProducts = [
  {
    _id: '1',
    name: "Ethiopia Yirgacheffe Single-Origin",
    description: "Floral and citrus-forward with a tea-like body. Washed process from Yirgacheffe; bright, elegant finish.",
    price: 18.99,
    category: "coffee",
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1200&auto=format&fit=crop",
    inStock: true,
    stockQuantity: 120,
    featured: true,
    rating: 4.7
  },
  {
    _id: '2',
    name: "Colombia Supremo Single-Origin",
    description: "Balanced body with caramel sweetness and cocoa undertones. Crowd-pleasing daily brew.",
    price: 16.50,
    category: "coffee",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1200&auto=format&fit=crop",
    inStock: true,
    stockQuantity: 150,
    featured: true,
    rating: 4.6
  }
];

const mockUsers = [];

exports.handler = async (event, context) => {
  const { httpMethod, path, body } = event;
  
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    // Products endpoints
    if (path === '/api/products' && httpMethod === 'GET') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ products: mockProducts })
      };
    }

    // Auth endpoints
    if (path === '/api/auth/register' && httpMethod === 'POST') {
      const { name, email, password } = JSON.parse(body);
      
      // Check if user exists
      if (mockUsers.find(u => u.email === email)) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ message: 'User already exists' })
        };
      }

      // Create user
      const user = {
        _id: `mock-${Date.now()}`,
        name,
        email,
        role: 'user'
      };
      mockUsers.push(user);

      // Generate mock token
      const token = `mock-token-${Date.now()}`;

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({
          token,
          user
        })
      };
    }

    if (path === '/api/auth/login' && httpMethod === 'POST') {
      const { email, password } = JSON.parse(body);
      
      const user = mockUsers.find(u => u.email === email);
      if (!user) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ message: 'Invalid credentials' })
        };
      }

      const token = `mock-token-${Date.now()}`;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          token,
          user
        })
      };
    }

    // Default response
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ message: 'Not found' })
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Server error' })
    };
  }
};