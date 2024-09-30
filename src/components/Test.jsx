import React, { useState, useEffect } from 'react';
import { transformComponentCode } from '../utils/tools';
import GridContainer from '../components/container/GridContainer';
import FlexContainer from '../components/container/FlexContainer';
import ResponsiveContainer from '../components/container/ResponsiveContainer';
import NestedContainer from '../components/container/NestedContainer';

// 原有的 generateComponentCode 函数保持不变
const generateComponentCode = () => {
  return `
const FlightCard = () => {
  const flight = {
    airline: 'United Airlines',
    segments: [
      { code: 'SFO', time: '11:34pm' },
      { code: 'ORD', time: '10:14am' },
      { code: 'LGA', time: '2:54pm' },
    ],
    price: '$865',
    stops: '1 stop',
    duration: '7h 40m'
  };

  return (
    <div className="bg-white rounded-xl p-6 max-w-md mx-auto shadow-lg transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl" data-rs="1">
      <div className="flex items-center justify-between mb-6" data-rs="2">
        <div className="flex items-center" data-rs="3">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4 transition duration-300 ease-in-out transform hover:rotate-180" data-rs="4">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" fillRule="evenodd"></path>
            </svg>
          </div>
          <div className="text-gray-700" data-rs="5">
            <h2 className="text-xl font-bold">{flight.airline}</h2>
          </div>
        </div>
        <div className="text-right" data-rs="6">
          <p className="text-2xl font-bold text-blue-600">{flight.price}</p>
          <p className="text-sm text-gray-500">{flight.stops}</p>
        </div>
      </div>
      <div className="flex justify-between items-center" data-rs="7">
        {flight.segments.map((segment, index) => (
          <div key={index} className="text-center transition duration-300 ease-in-out transform hover:scale-110" data-rs={8 + index}>
            <p className="text-sm text-gray-500 mb-1">{segment.time}</p>
            <h3 className="text-2xl font-bold text-gray-700">{segment.code}</h3>
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-center items-center" data-rs="11">
        <svg className="w-6 h-6 text-blue-600 animate-pulse mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm font-semibold text-gray-600">{flight.duration}</p>
      </div>
    </div>
  );
};

export default FlightCard;
  `;
};

// 新增的 generateFlightCardCode 函数
const generateFlightCardCode = () => {
  return `
const FlightCard = () => {
  const flight = {
    airline: 'United 1849',
    aircraft: 'Boeing 737-900',
    departure: {
      city: 'Chicago',
      code: 'ORD',
      time: '7:00pm',
      date: 'Mon, Jul 3'
    },
    arrival: {
      city: 'New York',
      code: 'LGA',
      time: '11:21am',
      date: 'Mon, Jul 3'
    },
    duration: '7h 29m'
  };

  return (
    <div className="bg-blue-600 text-white rounded-xl p-6 max-w-sm mx-auto shadow-lg transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl" data-rs="1">
      <div className="flex items-center mb-4" data-rs="2">
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-3 transition duration-300 ease-in-out transform hover:rotate-180" data-rs="3">
          <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" fillRule="evenodd"></path>
          </svg>
        </div>
        <div data-rs="4" className="transition duration-300 ease-in-out transform hover:translate-x-2">
          <h2 className="text-xl font-bold">{flight.airline}</h2>
          <p className="text-sm opacity-75">{flight.aircraft}</p>
        </div>
      </div>
      <div className="flex justify-between items-center" data-rs="5">
        <div className="text-center transition duration-300 ease-in-out transform hover:scale-110" data-rs="6">
          <h3 className="text-3xl font-bold">{flight.departure.code}</h3>
          <p className="text-sm">{flight.departure.time}</p>
          <p className="text-xs opacity-75">{flight.departure.date}</p>
        </div>
        <div className="flex flex-col items-center transition duration-300 ease-in-out transform hover:scale-110" data-rs="7">
          <svg className="w-6 h-6 mb-2 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
          </svg>
          <p className="text-sm font-semibold">{flight.duration}</p>
        </div>
        <div className="text-center transition duration-300 ease-in-out transform hover:scale-110" data-rs="8">
          <h3 className="text-3xl font-bold">{flight.arrival.code}</h3>
          <p className="text-sm">{flight.arrival.time}</p>
          <p className="text-xs opacity-75">{flight.arrival.date}</p>
        </div>
      </div>
    </div>
  );
};

export default FlightCard;
  `;
};

//航班卡片
const generateSpiritFlightCardCode = () => {
  return `
const SpiritFlightCard = () => {
  const flight = {
    airline: 'Spirit',
    segments: [
      { code: 'SFO', time: '11:34pm' },
      { code: 'ORD', time: '10:14am' },
      { code: 'LGA', time: '2:54pm' },
    ],
    price: '$865',
    stops: '1 stop',
    duration: '7h 40m'
  };

  return (
    <div className="bg-white rounded-xl p-6 max-w-md mx-auto shadow-lg transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl" data-rs="1">
      <div className="flex items-center justify-between mb-6" data-rs="2">
        <div className="flex items-center space-x-2" data-rs="3">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center transition duration-300 ease-in-out transform hover:rotate-180" data-rs="4">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" fillRule="evenodd"></path>
            </svg>
          </div>
          <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center transition duration-300 ease-in-out transform hover:rotate-180" data-rs="5">
            <span className="text-black font-bold text-sm">{flight.airline}</span>
          </div>
        </div>
        <div className="text-right" data-rs="6">
          <p className="text-2xl font-bold text-gray-800">{flight.price}</p>
          <p className="text-sm text-gray-500">{flight.stops}</p>
          <p className="text-sm text-gray-500">{flight.duration}</p>
        </div>
      </div>
      <div className="flex justify-between items-center" data-rs="7">
        {flight.segments.map((segment, index) => (
          <div key={index} className="flex flex-col items-center" data-rs={8 + index}>
            <p className="text-sm text-gray-500 mb-1">{segment.time}</p>
            <div className="w-2 h-2 bg-gray-300 rounded-full mb-1"></div>
            <h3 className="text-lg font-bold text-gray-700">{segment.code}</h3>
          </div>
        ))}
      </div>
      <div className="mt-4 relative" data-rs="11">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-300 -translate-y-1/2"></div>
        {flight.segments.map((_, index) => (
          index < flight.segments.length - 1 && (
            <div key={index} className="absolute top-1/2 left-1/2 w-2 h-2 bg-gray-500 rounded-full -translate-x-1/2 -translate-y-1/2" style={{left: \`\${(index + 1) * 50}%\`}}></div>
          )
        ))}
      </div>
    </div>
  );
};

export default SpiritFlightCard;
  `;
};

const generateFlightSuggestionCode = () => {
  return `
const FlightSuggestion = () => {
  const suggestion = {
    image: \`https://picsum.photos/300/200?random=\${Math.floor(Math.random() * 1000)}\`,
    dateRange: 'Aug 1 - Oct 2',
    destination: 'KMHG, Tokyo, Japan',
    description: 'New York is a popular destination with many attractions.'
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-md mx-auto transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl" data-rs="1">
      <h2 className="text-2xl font-bold p-4 bg-gray-100">Flight suggestion</h2>
      <div className="flex p-4" data-rs="2">
        <div className="w-1/3 mr-4 overflow-hidden rounded-lg" data-rs="3">
          <img 
            src={suggestion.image} 
            alt="Destination" 
            className="w-full h-32 object-cover rounded-lg transition duration-300 ease-in-out transform hover:scale-110"
          />
        </div>
        <div className="w-2/3" data-rs="4">
          <p className="text-gray-600 mb-2">{suggestion.dateRange}</p>
          <h3 className="text-xl font-semibold mb-2 transition duration-300 ease-in-out hover:text-blue-600">
            Flight to {suggestion.destination}
          </h3>
          <p className="text-gray-700 text-sm">{suggestion.description}</p>
        </div>
      </div>
    </div>
  );
};

export default FlightSuggestion;
  `;
};

const generateEconomySeatCardCode = () => {
  return `
import React, { useState, useEffect } from 'react';

const EconomySeatCard = () => {
  const [seatInfo, setSeatInfo] = useState(null);

  useEffect(() => {
    // 模拟从API获取数据
    const fetchSeatInfo = () => {
      // 这里可以是实际的API调用
      return {
        class: 'Economy',
        cabin: 'Economy',
        features: [
          { icon: 'check', text: 'Seat choice' },
          { icon: 'dollar', text: 'Cancellation' },
          { icon: 'check', text: 'Changes' },
          { icon: 'check', text: 'Personal item' },
        ],
        baggage: 'ATL - DFW: OPC',
        price: 865,
      };
    };

    setSeatInfo(fetchSeatInfo());
  }, []);

  const renderIcon = (icon) => {
    switch (icon) {
      case 'check':
        return (
          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'dollar':
        return (
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  if (!seatInfo) return <div>Loading...</div>;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm mx-auto transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl" data-rs="1">
      <div className="flex justify-between items-start mb-4" data-rs="2">
        <div>
          <h2 className="text-2xl font-bold">{seatInfo.class}</h2>
          <p className="text-gray-500">Cabin: {seatInfo.cabin}</p>
        </div>
        <div className="w-24 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
          <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
          </svg>
        </div>
      </div>
      <ul className="space-y-2 mb-4" data-rs="3">
        {seatInfo.features.map((feature, index) => (
          <li key={index} className="flex items-center">
            {renderIcon(feature.icon)}
            <span className="ml-2 text-gray-700">{feature.text}</span>
          </li>
        ))}
      </ul>
      <p className="text-sm text-gray-600 mb-4" data-rs="4">
        Baggage infos:<br />
        {seatInfo.baggage}
      </p>
      <div className="flex items-center justify-between" data-rs="5">
        <div>
          <span className="text-2xl font-bold">$865</span>
          <span className="text-gray-500 ml-2">$865 for 1 traveler</span>
        </div>
        <button className="bg-gray-200 rounded-full p-2 transition duration-300 ease-in-out hover:bg-gray-300">
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default EconomySeatCard;
  `;
};

const generateVinylPlayerCardCode = () => {
  return `
import React, { useState, useEffect } from 'react';

const VinylPlayerCard = () => {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const fetchPlayers = () => {
      return [
        {
          name: 'ANGELS HORN\\nVinyl Record Player',
          price: 192.99,
          rating: 4
        },
        {
          name: 'Audio-Technica\\nAT-LP60X-BK',
          price: 134.39,
          rating: 4
        }
      ];
    };

    setPlayers(fetchPlayers());
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm mx-auto transition-all duration-300 hover:shadow-xl">
      <h2 className="text-xl font-bold mb-4">Vinyl Record Player</h2>
      <p className="text-gray-600 mb-4">
        If your son enjoys the nostalgic sound of vinyl, a record player would be a perfect gift to enhance his music listening experience.
      </p>
      <div className="grid grid-cols-2 gap-4">
        {players.map((player, index) => (
          <div key={index} className="border rounded-lg p-2 flex flex-col items-center transition-all duration-300 hover:shadow-md hover:scale-105">
            <div className="relative w-full h-32 mb-2 overflow-hidden rounded">
              <img 
                src={\`https://picsum.photos/200/150?random=\${index + 1}\`} 
                alt={player.name.replace('\\n', ' ')} 
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110" 
              />
            </div>
            <div className="text-center w-full">
              <p className="text-sm font-semibold h-10 overflow-hidden">
                {player.name.split('\\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    {i < player.name.split('\\n').length - 1 && <br />}
                  </React.Fragment>
                ))}
              </p>
              <p className="text-lg font-bold">{player.price.toFixed(2)}</p>
              <div className="flex justify-center">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className={\`w-4 h-4 \${i < player.rating ? 'text-yellow-400' : 'text-gray-300'} transition-colors duration-300\`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
            <button className="mt-2 text-blue-600 hover:text-blue-800 transition-colors duration-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </div>
        ))}
      </div>
      <button className="w-full mt-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-all duration-300 hover:shadow">
        Show more
      </button>
    </div>
  );
};

export default VinylPlayerCard;
  `;
};

const generateRestaurantListCode = () => {
  return `
import React, { useState, useEffect } from 'react';

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    // 模拟从API获取数据
    const fetchRestaurants = () => {
      return [
        {
          name: 'Sushi Sams',
          rating: 4.7,
          reviews: 562,
          distance: 2.8,
          cuisine: 'Japanese',
          priceRange: '$$',
          image: 'https://picsum.photos/100/100?random=1'
        },
        {
          name: 'Sushi Sams',
          rating: 4.7,
          reviews: 562,
          distance: 2.8,
          cuisine: 'Japanese',
          priceRange: '$$',
          image: 'https://picsum.photos/100/100?random=2'
        },
        {
          name: 'Sushi Sams',
          rating: 4.7,
          reviews: 562,
          distance: 2.8,
          cuisine: 'Japanese',
          priceRange: '$$',
          image: 'https://picsum.photos/100/100?random=3'
        }
      ];
    };

    setRestaurants(fetchRestaurants());
  }, []);

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<span key={i} className="text-orange-400">★</span>);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<span key={i} className="text-orange-400">★</span>);
      } else {
        stars.push(<span key={i} className="text-gray-300">★</span>);
      }
    }

    return stars;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm mx-auto">
      <h2 className="text-xl font-bold mb-4">Restaurants in NYC</h2>
      <div className="space-y-4">
        {restaurants.map((restaurant, index) => (
          <div key={index} className="flex items-center bg-gray-50 rounded-lg p-3 transition-all duration-300 hover:shadow-md">
            <img 
              src={restaurant.image} 
              alt={restaurant.name} 
              className="w-16 h-16 rounded-full object-cover mr-4"
            />
            <div>
              <h3 className="font-semibold">{restaurant.name}</h3>
              <div className="flex items-center">
                {renderStars(restaurant.rating)}
                <span className="ml-1 text-sm text-gray-600">{restaurant.rating} ({restaurant.reviews})</span>
              </div>
              <p className="text-sm text-gray-600">
                {restaurant.distance} mi • {restaurant.cuisine} • {restaurant.priceRange}
              </p>
            </div>
          </div>
        ))}
      </div>
      <button className="w-full mt-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-all duration-300">
        Show more
      </button>
    </div>
  );
};

export default RestaurantList;
  `;
};

// 通用的组件生成函数
const GeneratedComponent = ({ generateCode, className = "p-4" }) => {
  const [Component, setComponent] = useState(null);

  useEffect(() => {
    generateComponent();
  }, []);

  const generateComponent = () => {
    const code = generateCode();

    try {
      let component = transformComponentCode(code);
      setComponent(() => component);
    } catch (error) {
      console.error('Error generating component:', error);
    }
  };

  return (
    <div className={className}>
      {Component && <Component />}
    </div>
  );
};

// 使用通用组件生成函数创建特定组件
const ProductList = () => <GeneratedComponent generateCode={generateComponentCode} />;
const FlightCardList = () => <GeneratedComponent generateCode={generateFlightCardCode} />;
const SpiritFlightCardList = () => <GeneratedComponent generateCode={generateSpiritFlightCardCode} />;
const FlightSuggestionList = () => <GeneratedComponent generateCode={generateFlightSuggestionCode} />;
const EconomySeatCardList = () => <GeneratedComponent generateCode={generateEconomySeatCardCode} />;
const VinylPlayerCardList = () => <GeneratedComponent generateCode={generateVinylPlayerCardCode} />;
const RestaurantList = () => <GeneratedComponent generateCode={generateRestaurantListCode} />;
const GridContainerDemo = () => {
  return <div>
    <GridContainer columns={3} gap={1} padding={16}>
      <ProductList />
      <FlightCardList />
      <SpiritFlightCardList />
      <FlightSuggestionList/>
      <ProductList />
    </GridContainer>
  </div>
}

const FlexContainerDemo = () => {
  return <div>
    <FlexContainer direction="row" gap={2} padding={1}>

    <ProductList />
    <FlightCardList />
    <SpiritFlightCardList />
    <FlightSuggestionList/>
    <ProductList />
    </FlexContainer>
  </div>
}

const ResponsiveContainerDemo = () => {
  return <div>
    <ResponsiveContainer minWidth={400} gap={1} padding={1}>
    <ProductList />
    <FlightCardList />
    <SpiritFlightCardList />
    <FlightSuggestionList/>
    <RestaurantList />
    <VinylPlayerCardList />
    <EconomySeatCardList />
    </ResponsiveContainer>
  </div>
}

const Test = () => {
  return <div>
    <ResponsiveContainerDemo >
    </ResponsiveContainerDemo>
  </div>
}

export default Test;